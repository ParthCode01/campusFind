# CampusFind — Campus Lost & Found Portal

CampusFind is a full-stack lost-and-found portal for a university community. Students can publish lost or found item reports, browse and filter reports, contact the person who submitted a report, and update its status when the item is reunited with its owner.

## Objectives

- Practice building a MERN application with React, Express, Node.js, and MongoDB.
- Implement REST endpoints and end-to-end create, read, update, and delete flows.
- Connect a React frontend to an Express API with Axios.
- Practice input validation, error handling, responsive UI, and environment configuration.

## Features

- Dashboard cards showing total reports, open lost reports, open found reports, and resolved reports.
- Server-side search by title or description and combined type, category, and status filters.
- Report, view, edit, delete, resolve, and reopen item reports.
- Required-field and email validation in the form and API.
- Loading, validation, API error, empty database, and empty filter states.
- Responsive layouts, keyboard focus states, and confirmation before deleting.
- MongoDB persistence; reports remain after a browser refresh.

This academic version does **not** implement authentication or authorization. Contact names and email addresses are visible to users. Authentication, authorization, and appropriate privacy safeguards would be necessary before production use.

## Technologies

- **Frontend:** React 18, Vite, JavaScript/JSX, React Router DOM, Axios, plain CSS.
- **Backend:** Node.js, Express, Mongoose, MongoDB, dotenv, cors.
- **Database:** Local MongoDB by default; MongoDB Atlas can also be used.

## Architecture

The browser renders React pages and reusable components. The `itemService.js` module sends Axios requests to the Express REST API. Express routes dispatch to controller functions, which validate request data and use the Mongoose `Item` model to read and write MongoDB documents. Responses use JSON, and centralized middleware formats unexpected errors.

## Folder structure

```text
CampusFind/
├── .gitignore
├── README.md
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/
│   │   │   ├── EditItem.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ItemDetails.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── ReportItem.jsx
│   │   ├── services/itemService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── itemController.js
    ├── middleware/
    │   └── errorMiddleware.js
    ├── models/
    │   └── Item.js
    ├── routes/
    │   ├── healthRoutes.js
    │   └── itemRoutes.js
    ├── .env.example
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── server.js
```

## Database schema

Mongoose model: `Item` (MongoDB collection: `items`). MongoDB generates `_id`.

| Field | Type | Rules |
| --- | --- | --- |
| `title` | String | Required, trimmed |
| `description` | String | Required, trimmed |
| `category` | String | Required: Electronics, Documents / ID Cards, Bags, Accessories, Books / Stationery, Keys, Other |
| `type` | String | Required: `Lost` or `Found` |
| `location` | String | Required, trimmed |
| `date` | Date | Required |
| `contactName` | String | Required, trimmed |
| `contactEmail` | String | Required, trimmed, lowercase |
| `status` | String | `Open` or `Resolved`; defaults to `Open` |
| `createdAt`, `updatedAt` | Date | Managed by Mongoose timestamps |

## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | API and MongoDB health |
| `GET` | `/items` | List reports; optional `search`, `type`, `category`, and `status` query parameters |
| `GET` | `/items/:id` | Get a report by MongoDB ID |
| `POST` | `/items` | Create a report (returns `201`) |
| `PUT` | `/items/:id` | Update supplied report fields |
| `PATCH` | `/items/:id/status` | Set status to `Open` or `Resolved` |
| `DELETE` | `/items/:id` | Delete a report |

Successful requests return `{ "success": true, "data": ... }` (and a message for mutations). Errors return `{ "success": false, "message": "..." }`. Invalid input and malformed MongoDB IDs return `400`, missing records/routes return `404`, and unexpected server errors return a generic `500` message.

Example requests:

```powershell
# Health
Invoke-RestMethod http://localhost:5000/api/health

# List found electronics matching a search
Invoke-RestMethod 'http://localhost:5000/api/items?search=wallet&type=Found&category=Accessories&status=Open'

# Create a report
$item = @{
  title = "Blue student ID"
  description = "Blue university ID card found near the library entrance."
  category = "Documents / ID Cards"
  type = "Found"
  location = "Main library entrance"
  date = "2026-10-26"
  contactName = "Alex Student"
  contactEmail = "alex@example.edu"
} | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/items -Method Post -ContentType 'application/json' -Body $item
```

## Prerequisites

- Node.js 20 or later and npm.
- MongoDB Community Server running locally, or a MongoDB Atlas connection string.

## Installation and startup

Open **three PowerShell terminals** from the project folder.

### 1. Start MongoDB

Install and start MongoDB Community Server using the official MongoDB installer/service for your OS. On Windows, the MongoDB service is commonly named `MongoDB`:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

If the service is not installed, start your local `mongod` service/installation first, or configure an Atlas URI as described below. The default local URI is `mongodb://127.0.0.1:27017/campusfind`.

### 2. Configure and start the backend

```powershell
cd C:\path\to\CampusFind\server
Copy-Item .env.example .env
npm install
npm run dev
```

The API starts at `http://localhost:5000`. For a non-watch production-style start, use `npm start`.

### 3. Configure and start the frontend

```powershell
cd C:\path\to\CampusFind\client
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Build the frontend with `npm run build`.

## Environment variables

`server/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusfind
CLIENT_URL=http://localhost:5173
```

`client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

`.env` files are ignored by Git. The frontend defaults to `http://localhost:5000/api` if `VITE_API_URL` is omitted. Restart Vite after changing its environment variables.

### MongoDB Atlas alternative

Create a database and database user in MongoDB Atlas, allow your development IP in the Atlas network access settings, and copy the driver connection string. Put it in `MONGODB_URI` in `server/.env`, replacing the password placeholder with your database user's password. Do not commit or share the URI. Atlas is optional; a local MongoDB installation works with the default configuration.

## Troubleshooting

- **Server exits with a database connection error:** verify MongoDB is running and `MONGODB_URI` points to the correct local or Atlas database.
- **Frontend cannot reach the API:** ensure the backend is running, `VITE_API_URL` ends with `/api`, and `CLIENT_URL` matches the frontend origin; restart both processes after env changes.
- **Port already in use:** stop the other process or choose another backend `PORT` and update the frontend API URL.
- **No reports appear:** an empty database intentionally shows an empty state; create a report from the dashboard.
- **Atlas connection fails:** check network access allow-list, database user credentials, and the URI encoding for special characters in passwords.
- **PowerShell says the MongoDB service is missing:** install MongoDB Community Server or configure Atlas; the app does not install or manage MongoDB.

## Limitations and future enhancements

- There is no authentication or authorization; anyone who can access this app can create, edit, or delete reports, and contact details are public.
- Item photos, pagination, moderation, notifications, and audit history are not included.
- The development CORS configuration allows the configured frontend origin.
- Possible future work includes authenticated accounts, private contact relay, image uploads, report moderation, and automated API/UI tests.

## Viva preparation

**What does MERN stand for?** MongoDB, Express.js, React, and Node.js: database, server framework, UI library, and JavaScript runtime.

**What do React components and hooks do?** Components are reusable UI building blocks. Hooks such as `useState` hold component state, while `useEffect` loads data or synchronizes with external services.

**What do Node.js and Express do?** Node.js runs JavaScript on the server. Express provides routing and middleware for HTTP requests and responses.

**What do MongoDB and Mongoose do?** MongoDB stores JSON-like documents. Mongoose defines a schema and model, validates data, and provides methods to work with MongoDB.

**What is a REST API?** A set of HTTP endpoints that expose resources through standard methods and JSON representations.

**How do GET, POST, PUT, PATCH, and DELETE differ?** GET reads a resource; POST creates one; PUT updates a resource; PATCH applies a partial change (here, the status); DELETE removes it.

**How does form data travel to MongoDB and back?** A React form validates values and sends JSON with Axios. Express receives the request, a controller checks it, Mongoose writes an `Item` document to MongoDB, then the API returns JSON for React to display.

**How do validation and error handling work?** The browser checks required values and email format for immediate feedback. The API independently validates requests and enum values. Controllers return appropriate client errors, while centralized middleware formats unexpected errors without exposing stack traces.

**Why use environment variables?** They keep settings such as ports, database connection strings, and API URLs outside source code, allowing different local/deployment configurations without committing secrets.
