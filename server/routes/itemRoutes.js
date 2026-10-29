const express = require("express");
const {
  createItem,
  deleteItem,
  getItem,
  listItems,
  updateItem,
  updateItemStatus,
} = require("../controllers/itemController");

const router = express.Router();

router.route("/").get(listItems).post(createItem);
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);
router.patch("/:id/status", updateItemStatus);

module.exports = router;
