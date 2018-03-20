const sparql = require('./sparql')

module.exports.firstRequest = async (req, res) => {
  const data = await sparql.fetchStreetNames()
  if (req.query.sn && req.query.id) {
    console.log(`SN: ${req.query.sn} ID:${req.query.id}`)
  }
  res.render('index', { data: data })
}
