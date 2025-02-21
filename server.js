require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const API_KEY = process.env.BARCODE_LOOKUP_API_KEY;

if (!API_KEY) {
    console.error("❌ ERROR: Missing API key! Check .env file.");
    process.exit(1); // Stop server if API key is missing
}

app.get("/api/barcode/:barcode", async (req, res) => {
    const barcode = req.params.barcode;
    console.log(`🔎 Fetching data for barcode: ${barcode}`);

    try {
        const response = await axios.get(`https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${API_KEY}`);
        console.log("✅ API Response:", response.data);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            console.error("❌ API Error:", error.response.status, error.response.data);
            res.status(error.response.status).json({ error: "Failed to fetch product data", details: error.response.data });
        } else {
            console.error("❌ Network Error:", error.message);
            res.status(500).json({ error: "Network error", details: error.message });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
