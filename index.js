app.post('/', async (req, res) => {
  const body = req.body
  console.log('POST:', body)
  if (body && body.victim && body.lat && body.lon) {
    const { data, error } = await supabase
      .from('position')
      .upsert({
        victim: body.victim,
        lat: body.lat,
        lon: body.lon,
        ts: body.ts || Date.now()
      })
    console.log('upsert result:', { data, error })
    if (error) {
      res.status(500).json({ error: 'db error', details: error.message })
    } else {
      res.json({ ok: true, ts: body.ts || Date.now() })
    }
  } else {
    res.status(400).json({ error: 'bad request' })
  }
})

app.get('/', async (req, res) => {
  const victim = req.query.victim
  console.log('GET victim:', victim)
  if (!victim) return res.json({ error: 'missing victim param' })
  const { data, error } = await supabase
    .from('position')
    .select('victim, lat, lon, ts')
    .eq('victim', victim)
    .maybeSingle()
  console.log('select result:', { data, error })
  if (error) return res.status(500).json({ error: 'db error', details: error.message })
  res.json(data || { error: 'not found' })
})
