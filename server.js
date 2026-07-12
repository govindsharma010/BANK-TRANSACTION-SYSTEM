require("dotenv").config({path : "./src/.env"} );

const REQUIRED_ENV_VARS = ["MONGO_URI", "JWT_SECRET"];
for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = require("./src/app");
const connectDB = require("./src/config/db")

connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})