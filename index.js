const express = require('express')
const sparql = require('./sparql/index')
const app = express()
express.static('global')
app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('*', sparql.firstRequest)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
