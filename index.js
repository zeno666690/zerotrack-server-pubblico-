const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const app = express();
app.use(express.json());

const SUPABASE_URL = "https://rergtekkabatdaqyzfjs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9XdB00d5-VrNQkrLAhZAVw__yiYZ7MU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.post("/", async (req, res) => {
    const { victim, lat, lon } = req.body;
    if (!victim || lat == null || lon == null) {
        return res.status(400).json({ error: "bad request" });
    }
    try {
        const { error } = await supabase
            .from("position")
            .upsert({ victim, lat, lon, ts: Date.now() }, { onConflict: "victim" });
        if (error) throw error;
        res.json({ ok: true, ts: Date.now() });
    } catch (e) {
        console.error("Supabase POST error:", e);
        res.status(500).json({ error: "database error" });
    }
});

app.get("/", async (req, res) => {
    const victim = req.query.victim;
    if (!victim) {
        return res.status(400).json({ error: "missing victim param" });
    }
    try {
        const { data, error } = await supabase
            .from("position")
            .select("lat, lon, ts")
            .eq("victim", victim)
            .single();
        if (error) {
            if (error.code === "PGRST116") { // no rows
                return res.status(404).json({ error: "not found" });
            }
            throw error;
        }
        res.json(data);
    } catch (e) {
        console.error("Supabase GET error:", e);
        res.status(500).json({ error: "database error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`ZeroTrack Supabase server on port ${PORT}`);
});
