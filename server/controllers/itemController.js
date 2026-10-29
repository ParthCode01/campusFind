const mongoose = require("mongoose");
const Item = require("../models/Item");

const categories = [
  "Electronics",
  "Documents / ID Cards",
  "Bags",
  "Accessories",
  "Books / Stationery",
  "Keys",
  "Other",
];
const types = ["Lost", "Found"];
const statuses = ["Open", "Resolved"];
const writableFields = [
  "title",
  "description",
  "category",
  "type",
  "location",
  "date",
  "contactName",
  "contactEmail",
  "status",
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateItemInput(body, { partial = false, allowStatus = true } = {}) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Request body must be a JSON object."];
  }

  for (const field of writableFields) {
    if (field === "status" && !allowStatus) continue;
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      if (!partial && field !== "status") errors.push(`${field} is required.`);
      continue;
    }

    const value = body[field];
    if (field === "status" && value === undefined) continue;
    if (typeof value !== "string" && field !== "date") {
      errors.push(`${field} must be a string.`);
      continue;
    }
    if (typeof value === "string" && !value.trim()) {
      errors.push(`${field} is required.`);
      continue;
    }

    if (field === "category" && !categories.includes(value.trim())) {
      errors.push(`category must be one of: ${categories.join(", ")}.`);
    }
    if (field === "type" && !types.includes(value.trim())) {
      errors.push("type must be Lost or Found.");
    }
    if (field === "status" && !statuses.includes(value.trim())) {
      errors.push("status must be Open or Resolved.");
    }
    if (
      field === "contactEmail" &&
      typeof value === "string" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      errors.push("contactEmail must be a valid email address.");
    }
    if (field === "date" && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) {
      errors.push("date must be a valid date.");
    }
  }

  return errors;
}

function getWritableFields(body) {
  return Object.fromEntries(
    writableFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function validateId(id, res) {
  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({ success: false, message: "Invalid item ID." });
    return false;
  }
  return true;
}

async function listItems(req, res, next) {
  try {
    const { search, type, category, status } = req.query;
    if (type && !types.includes(type)) {
      return res.status(400).json({ success: false, message: "type must be Lost or Found." });
    }
    if (category && !categories.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category." });
    }
    if (status && !statuses.includes(status)) {
      return res.status(400).json({ success: false, message: "status must be Open or Resolved." });
    }

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (typeof search === "string" && search.trim()) {
      const expression = new RegExp(escapeRegExp(search.trim()), "i");
      filter.$or = [{ title: expression }, { description: expression }];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (error) {
    return next(error);
  }
}

async function getItem(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
}

async function createItem(req, res, next) {
  try {
    const errors = validateItemInput(req.body, { allowStatus: true });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }
    const item = await Item.create(getWritableFields(req.body));
    return res.status(201).json({ success: true, data: item, message: "Item created successfully." });
  } catch (error) {
    return next(error);
  }
}

async function updateItem(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;
    const errors = validateItemInput(req.body, { partial: true, allowStatus: false });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }
    const updates = getWritableFields(req.body);
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "Provide at least one item field to update." });
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }
    return res.json({ success: true, data: item, message: "Item updated successfully." });
  } catch (error) {
    return next(error);
  }
}

async function deleteItem(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }
    return res.json({ success: true, data: item, message: "Item deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

async function updateItemStatus(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;
    if (!req.body || !Object.prototype.hasOwnProperty.call(req.body, "status")) {
      return res.status(400).json({ success: false, message: "status is required." });
    }
    const errors = validateItemInput({ status: req.body.status }, { partial: true });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found." });
    }
    return res.json({ success: true, data: item, message: "Item status updated successfully." });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createItem, deleteItem, getItem, listItems, updateItem, updateItemStatus };
