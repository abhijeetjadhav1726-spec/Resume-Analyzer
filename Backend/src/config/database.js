const mongoose = require("mongoose")
const dns = require("dns")

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI;
    try {
        await mongoose.connect(mongoUri)
        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Initial database connection failed:", err.message)
        
        if (err.message.includes("ENOTFOUND") || err.message.includes("ECONNREFUSED") || err.message.includes("querySrv")) {
            console.log("Attempting DNS fallback to Google DNS (8.8.8.8)...")
            try {
                dns.setServers(["8.8.8.8", "8.8.4.4"])
                await mongoose.connect(mongoUri)
                console.log("Connected to Database using Google DNS fallback")
                return
            } catch (fallbackErr) {
                console.error("Google DNS fallback connection failed:", fallbackErr.message)
            }
        }
        
        console.error("\n❌ DATABASE CONNECTION ERROR:")
        console.error("Could not connect to MongoDB Atlas. This is likely due to:")
        console.error("1. A firewall or network blocking access to MongoDB Atlas (Port 27017).")
        console.error("2. DNS resolution issues resolving the MongoDB Atlas SRV connection string.")
        console.error("3. Missing or incorrect MONGO_URI in Backend/.env file.")
        console.error("\n👉 Tip: If you are offline or have network restrictions, you can run a local MongoDB instance and set MONGO_URI=mongodb://localhost:27017/resume-analyzer in your Backend/.env file.\n")
    }
}

module.exports = connectToDB