
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as
      // server-to-server requests and some API clients.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
   BODY PARSING
========================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================
   STATIC UPLOADS
========================= */

// IMPORTANT: Multer must use this same directory.
const uploadDirectory =
  process.env.UPLOAD_DIR ||
  path.join(__dirname, "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

app.use("/uploads", express.static(uploadDirectory));

/* =========================
   ROUTES
========================= */

const authRoutes = require("./routes/authRoutes");

const heroRoutes = require("./routes/heroRoutes");

const aboutRoutes = require("./routes/aboutRoutes");
const aboutCategoryRoutes = require("./routes/aboutCategoryRoutes");
const aboutCardRoutes = require("./routes/aboutCardRoutes");

const causeRoutes = require("./routes/causeRoutes");

const partnerRoutes = require("./routes/partnerRoutes");

const eventRoutes = require("./routes/eventRoutes");
const eventCardRoutes = require("./routes/eventCardRoutes");

const resourceCategoryRoutes = require("./routes/resourceCategoryRoutes");
const resourceCardRoutes = require("./routes/resourceCardRoutes");

const contactRoutes = require("./routes/contactRoutes");

const settingsRoutes = require("./routes/settingsRoutes");
const whatwedoCategoryRoutes = require("./routes/whatwedoCategoryRoutes");
const whatWeDoCardRoutes = require("./routes/whatWeDoCardRoutes");

/* =========================
   API ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/hero", heroRoutes);

app.use("/api/about", aboutRoutes);
app.use("/api/about-categories", aboutCategoryRoutes);
app.use("/api/about-cards", aboutCardRoutes);

app.use("/api/causes", causeRoutes);

app.use("/api/partners", partnerRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/event-cards", eventCardRoutes);

app.use("/api/resource-categories", resourceCategoryRoutes);
app.use("/api/resource-cards", resourceCardRoutes);

app.use("/api/contacts", contactRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/api/whatwedocategories", whatwedoCategoryRoutes);
app.use("/api/whatwedocards", whatWeDoCardRoutes);

/* =========================
   HOME / HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PLC Information Management API is running.",
  });
});

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB once before accepting requests.
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Upload directory: ${uploadDirectory}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
