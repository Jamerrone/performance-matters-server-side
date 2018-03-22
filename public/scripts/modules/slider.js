{
  let sliderTimeoutHandler
  const leftSliderControl = document.getElementById('left')
  const rightSliderControl = document.getElementById('right')
  const timeline = document.getElementById('timeline')

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
}
