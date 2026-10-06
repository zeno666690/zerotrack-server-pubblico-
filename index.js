const express = require("express");
const app = express();
app.use(express.json());

// Rispondi sempre con coordinate fisse (Milano)
app.post("/", (req, res) => {
    console.log("POST ricevuto:", req.body);
    res.json({ ok: true, ts: Date.now() });
});

app.get("/", (req, res) => {
    const victim = req.query.victim;
    console.log("GET per:", victim);
    res.json({
        victim: victim || "unknown",
        lat: 45.4642,
        lon: 9.1899,
        src: "mock",
        ts: Date.now()
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server mock ZeroTrack in ascolto sulla porta ${PORT}`);
});
