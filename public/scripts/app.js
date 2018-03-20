{
  // GLOBAL VARIABLES \\
  let sliderTimeoutHandler
  const alphabeticalFilter = document.getElementById('alphabeticalFilter')
  const closeLightboxBtn = document.getElementById('closeLightbox')
  const detailsContent = document.getElementById('content')
  const detailsHeading = document.getElementById('heading')
  const dialog = document.getElementById('dialog')
  const leftSliderControl = document.getElementById('left')
  const lightboxImg = document.getElementById('lightboxImg')
  const loader = document.getElementById('loader')
  const rightSliderControl = document.getElementById('right')
  const searchInputField = document.getElementById('search')
  const streetNameHTML = document.getElementById('streetName')
  const streetsOverview = document.getElementById('streetsOverview')
  const timeline = document.getElementById('timeline')
  const map = L.map('map', { zoomControl: false })

  // QUERIES \\
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

  // INIT \\
  const init = () => {
    prepareMap()
    // fetchStreetNames()
  }

  // ADAMLINK \\
  const generateStreetURL = (streetName, streetID) =>
    `<https://adamlink.nl/geo/street/${streetName}/${streetID}>`

  const generateQueryURL = encodedQuery =>
    `https://api.data.adamlink.nl/datasets/AdamNet/all/services/hva2018/sparql?default-graph-uri=&query=${encodedQuery}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`

  const encodeQuery = query => encodeURIComponent(query)

  // LEAFLET MAP \\
  const prepareMap = () => {
    L.tileLayer.provider('CartoDB.Positron', { detectRetina: true }).addTo(map)
    map.dragging.disable()
    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()
    map.keyboard.disable()
    if (map.tap) map.tap.disable()
    return map
  }

  const removeMapLayers = () => {
    return map.eachLayer(layer => {
      if (layer instanceof L.GeoJSON) map.removeLayer(layer)
    })
  }

  // HELPERS \\
  const getRandomProperty = obj => {
    const keys = Object.keys(obj)
    return obj[keys[(keys.length * Math.random()) << 0]]
  }

  // STREET DETAILS \\
  const fetchStreetDetails = (streetName, streetID) => {
    const streetURL = generateStreetURL(streetName, streetID)
    const encodedQuery = encodeQuery(generateDetailsSparqlQuery(streetURL))
    const queryURL = generateQueryURL(encodedQuery)
    fetch(queryURL)
      .then(resp => resp.json())
      .then(data => {
        const results = data.results.bindings
        const formatedData = formatDetailsData(results)
        streetNameHTML.innerHTML = results[0]['streetName']['value']
        if (results[0].wkt) {
          removeMapLayers()
          const geojson = Terraformer.WKT.parse(results[0].wkt.value)
          const layer = L.geoJSON(geojson).addTo(map)
          layer.setStyle({ color: '#0055a0' })
          map.fitBounds(layer.getBounds(), { padding: [50, 50] })
        }
        displayStreetDetails(formatedData)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const formatDetailsData = data => {
    const formatedData = data.reduce((acc, item) => {
      const year = item.year.value.slice(0, 4)
      acc[year] ? acc[year].push(item) : (acc[year] = [item])
      acc.total = acc.total++ || 1
      return acc
    }, {})
    return formatedData
  }

  const displayStreetDetails = data => {
    detailsContent.innerHTML = ''
    detailsHeading.innerHTML = ''
    for (let key in data) {
      if (key !== 'total') {
        const div = document.createElement('div')
        const li = document.createElement('li')
        div.classList.add(key)
        li.innerHTML = key
        detailsContent.appendChild(div)
        for (let i = 0; i < data[key].length; i++) {
          const img = document.createElement('img')
          img.src = data[key][i]['imgURL']['value']
          img.title = data[key][i]['year']['value']
          img.addEventListener('click', lightbox(img.src))
          div.appendChild(img)
        }
        detailsHeading.appendChild(li)
      }
    }
  }

  // SEARCH \\
  const search = () => {
    const filter = searchInputField.value.toUpperCase()
    const li = streetsOverview.querySelectorAll('li')
    li.forEach(li => {
      const a = li.getElementsByTagName('a')[0] || li
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li.style.display = ''
      } else {
        li.style.display = 'none'
      }
    })
  }

  const clearSearch = () => {
    const li = streetsOverview.querySelectorAll('li')
    searchInputField.value = ''
    li.forEach(li => {
      li.style.display = ''
    })
  }

  // SLIDER \\
  const scroll = val => {
    sliderTimeoutHandler = setInterval(() => {
      timeline.scrollLeft < timeline.scrollWidth
        ? (timeline.scrollLeft += val)
        : clearTimeout(sliderTimeoutHandler)
    }, 0)
  }

  // LIGHTBOX \\
  const lightbox = url => {
    return () => {
      dialog.classList.add('show')
      lightboxImg.src = url
    }
  }

  // EVENT LISTENERS \\
  rightSliderControl.addEventListener('mouseover', () => scroll(1))
  rightSliderControl.addEventListener('mouseleave', () =>
    clearTimeout(sliderTimeoutHandler)
  )

  leftSliderControl.addEventListener('mouseover', e => scroll(-1))
  leftSliderControl.addEventListener('mouseleave', e =>
    clearTimeout(sliderTimeoutHandler)
  )

  searchInputField.addEventListener('keyup', search)
  closeLightboxBtn.addEventListener('click', () =>
    dialog.classList.remove('show')
  )
  window.addEventListener('load', () => loader.classList.remove('show'))
  window.addEventListener('hashchange', () => clearSearch())
  alphabeticalFilter.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => clearSearch())
  })

  init()
}
