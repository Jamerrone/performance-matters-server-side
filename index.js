const express = require('express')
const minifyHTML = require('express-minify-html')
const sparql = require('./sparql/index')

const app = express()
express.static('global')
app.set('view engine', 'pug')
app.use(
  express.static('public'),
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  })
)

app.get('*', sparql.firstRequest)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
