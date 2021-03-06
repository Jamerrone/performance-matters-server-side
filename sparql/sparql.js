const fetch = require('node-fetch')

const generateStreetsSparqlQuery = () => `
PREFIX hg: <http://rdf.histograph.io/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
SELECT ?streetURL ?streetName WHERE {
  ?streetURL a hg:Street .
  ?streetURL geo:hasGeometry/geo:asWKT ?wkt .
  ?streetURL rdfs:label ?streetName .
  ?streetURL sem:hasEarliestBeginTimeStamp ?year .
  ?bbItem dct:spatial ?streetURL .
  ?bbItem foaf:depiction ?imgURL .
  ?bbItem dc:type ?type .
  FILTER (!Regex(?streetName, 'nieuw aangemaakte straat', 'i') && Regex(?type, 'foto', 'i')) .
}
GROUP BY ?streetURL
ORDER BY ?streetURL
`

const generateDetailsSparqlQuery = streetURL => `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE {
  ?bbItem dc:type ?type .
  ?bbItem dct:spatial ${streetURL} .
  ${streetURL} rdfs:label ?streetName .
  ?bbItem foaf:depiction ?imgURL .
  ?bbItem sem:hasBeginTimeStamp ?year .
  ${streetURL} geo:hasGeometry/geo:asWKT ?wkt .
  FILTER (Regex(?type, 'foto', 'i')) .
}
GROUP BY ?imgURL
ORDER BY ?year
`

const generateStreetURL = (streetName, streetID) =>
  `<https://adamlink.nl/geo/street/${streetName}/${streetID}>`

const generateQueryURL = encodedQuery =>
  `https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=${encodedQuery}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`

const encodeQuery = query => encodeURIComponent(query)

module.exports.fetchStreetNames = () => {
  const encodedQuery = encodeQuery(generateStreetsSparqlQuery())
  const queryURL = generateQueryURL(encodedQuery)
  return new Promise((resolve, reject) => {
    fetch(queryURL)
      .then(resp => resp.json())
      .then(data => {
        const results = data.results.bindings
        const formatedData = formatStreetData(results)
        resolve(formatedData)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const formatStreetData = data => {
  const formatedData = data.reduce((acc, item) => {
    const streetName = item.streetName.value
    const streetURLName = item.streetURL.value.split('/')[5]
    const streetURLId = item.streetURL.value.split('/')[6]
    const firstLetter = item.streetName.value[0].toLowerCase()
    if (!acc[firstLetter]) acc[firstLetter] = {}
    acc[firstLetter][streetName] = {}
    acc[firstLetter][streetName].streetURLName = streetURLName
    acc[firstLetter][streetName].streetURLId = streetURLId
    return acc
  }, {})
  return formatedData
}

module.exports.fetchStreetDetails = (streetName, streetID) => {
  const streetURL = generateStreetURL(streetName, streetID)
  const encodedQuery = encodeQuery(generateDetailsSparqlQuery(streetURL))
  const queryURL = generateQueryURL(encodedQuery)
  return new Promise((resolve, reject) => {
    fetch(queryURL)
      .then(resp => resp.json())
      .then(data => {
        const results = data.results.bindings
        const formatedData = formatDetailsData(results)
        resolve(formatedData)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const formatDetailsData = data => {
  const formatedData = data.reduce((acc, item) => {
    const year = item.year.value.slice(0, 4)
    acc[year] ? acc[year].push(item) : (acc[year] = [item])
    return acc
  }, {})
  return formatedData
}
