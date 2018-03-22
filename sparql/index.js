const sparql = require('./sparql')

module.exports.firstRequest = async (req, res) => {
  const data = {}
  data.streets = await sparql.fetchStreetNames()
  req.query.sn = req.query.sn || 'aagtdorperpad'
  req.query.id = req.query.id || '5'
  data.details = await sparql.fetchStreetDetails(req.query.sn, req.query.id)
  res.render(
    'index',
    {
      streets: data.streets,
      details: data.details,
      streetName: Object.values(data.details)[0][0].streetName.value
    },
    (err, html) => {
      if (err) {
        console.log(err)
      }
      res.send(html)
    }
  )
}
