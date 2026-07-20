require("dotenv").config()
const app = require("../Backend/src/app")
const connectToDB = require("../Backend/src/config/database")

// Connect to database
connectToDB()

// Export Express app as serverless function
module.exports = app
