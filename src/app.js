const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require('cors');

/**
 * -Routes required
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")



const app = express();

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const envOrigins = (process.env.FRONTEND_URLS || "").split(",").map(s => s.trim()).filter(Boolean);
const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())
app.use(cookieParser())

/**
 * -Use Routes
 */
app.get("/" , (req, res) =>{
    res.send("Ledger Service is up and running")
})
app.use("/api/auth", authRouter) // user hit this route all apis redirected to authRouter
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

// 404 handler  for unmatched routes

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// centralized error handler — must have 4 args for Express to treat it as an error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value", field: Object.keys(err.keyValue || {})[0] });
  }

  res.status(500).json({ message: "Something went wrong on the server" });
});


module.exports = app;