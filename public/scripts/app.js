{
  let searchInputField
  let sliderTimeoutHandler
  const alphabeticalFilter = document.getElementById('alphabeticalFilter')
  const leftSliderControl = document.getElementById('left')
  const rightSliderControl = document.getElementById('right')
  const streetsOverview = document.getElementById('streetsOverview')
  const timeline = document.getElementById('timeline')

  const createSearchForm = () => {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const icon = document.createElement('i')
    input.type = 'text'
    input.id = 'search'
    input.placeholder = 'Search by streetname...'
    input.addEventListener('keyup', search)
    searchInputField = input
    icon.classList.add('fas', 'fa-search')
    form.appendChild(input)
    form.appendChild(icon)
    alphabeticalFilter.appendChild(form)
  }

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

  const scroll = val => {
    sliderTimeoutHandler = setInterval(() => {
      timeline.scrollLeft < timeline.scrollWidth
        ? (timeline.scrollLeft += val)
        : clearTimeout(sliderTimeoutHandler)
    }, 0)
  }

  rightSliderControl.addEventListener('mouseover', () => scroll(1))
  rightSliderControl.addEventListener('mouseleave', () =>
    clearTimeout(sliderTimeoutHandler)
  )

  leftSliderControl.addEventListener('mouseover', e => scroll(-1))
  leftSliderControl.addEventListener('mouseleave', e =>
    clearTimeout(sliderTimeoutHandler)
  )

  window.addEventListener('hashchange', () => clearSearch())
  alphabeticalFilter.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => clearSearch())
  })

  createSearchForm()
  lazyload()
}
