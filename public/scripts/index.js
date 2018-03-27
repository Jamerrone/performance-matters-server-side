const search = require('./modules/search')
const slider = require('./modules/slider')

if (!navigator.onLine) {
  document.getElementById('offlineFeedback').style.display = 'block'
} else {
  document.getElementById('offlineFeedback').style.display = 'none'
}
