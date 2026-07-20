require("dotenv").config()
const app = require("../src/app")
const connectToDB = require("../src/config/database")

// Connect to database
connectToDB()

// Export the express app for Vercel Serverless Functions
module.exports = app
