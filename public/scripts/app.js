{
  // GLOBAL VARIABLES \\
  let sliderTimeoutHandler
  const alphabeticalFilter = document.getElementById('alphabeticalFilter')
  const leftSliderControl = document.getElementById('left')
  const loader = document.getElementById('loader')
  const rightSliderControl = document.getElementById('right')
  const searchInputField = document.getElementById('search')
  const streetsOverview = document.getElementById('streetsOverview')
  const timeline = document.getElementById('timeline')

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
  window.addEventListener('load', () => loader.classList.remove('show'))
  window.addEventListener('hashchange', () => clearSearch())
  alphabeticalFilter.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => clearSearch())
  })
}
