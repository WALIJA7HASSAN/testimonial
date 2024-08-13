const testimonials = [
  {
    text: '“We have created a multi-million dollar organization, and we started with $40K in the bank … Business Mastery is a one stop shop to get every possible resource you need to define yourself, your business, and your future.”',
    name: '- ANDIRA',
  },
  {
    text: '“$1,000 dollars in 2018 and in 2021 it hit $5 million dollars… Next year, I mean, the sky’s the limit with all the teachings we’ve had from Tony.”',
    name: '- LETIZDA',
  },
  {
    text: '“Our latest results (4 months since attending Business Mastery) show $600,000 in increased revenue. We have only used these tools with one location. Extrapolated over our other 7 locations… this will yield a 8 figure return within 12 months.”',
    name: '- DAVID',
  },
]
const testimonialContainer = document.querySelector(
  '.testimonial-text-container'
)
const sliderSpansContainer = document.querySelector('.slider-spans-container')
const iconLeft = document.querySelector('.icon-left')
const iconRight = document.querySelector('.icon-right')
let currentIndex = 0
let autoSlideInterval
let isDragging = false
let startX, currentX

// Create testimonial HTML
function createTestimonialHTML(testimonial) {
  return `
    <div class="testimonial-text">
      <p>${testimonial.text}</p>
      <p class="testimonial-name"><strong>${testimonial.name}</strong></p>
    </div>
  `
}

// Create slider span HTML
function createSliderSpanHTML(index) {
  return `<li class="slider-span-container" data-index="${index}"><span class="slider-span"></span></li>`
}

// Render testimonials
function renderTestimonials(animationClass) {
  testimonialContainer.innerHTML = createTestimonialHTML(
    testimonials[currentIndex]
  )
  sliderSpansContainer.innerHTML = testimonials
    .map((_, index) => createSliderSpanHTML(index))
    .join('')
  updateActiveSpan(currentIndex) // Initialize the first testimonial
  initializeSliderSpanEventListeners() // Reattach event listeners

  // Add animation class with a short delay to ensure DOM update
  setTimeout(() => {
    const testimonial = testimonialContainer.querySelector('.testimonial-text')
    testimonial.classList.add(animationClass)
  }, 50)

  // Remove animation class after animation completes to reset for next update
  setTimeout(() => {
    const testimonial = testimonialContainer.querySelector('.testimonial-text')
    testimonial.classList.remove(animationClass)
  }, 1050) // 1000ms for animation + 50ms delay
}

// Update active slider span
function updateActiveSpan(index) {
  const sliderSpans = document.querySelectorAll('.slider-span-container')
  sliderSpans.forEach((container, idx) => {
    const span = container.querySelector('.slider-span')
    span.classList.toggle('active-slider-span', idx === index)
  })
}

// Reset animation class
function resetAnimation() {
  const testimonial = testimonialContainer.querySelector('.testimonial-text')
  testimonial.classList.remove('slide-right', 'slide-left')
}

// Show next testimonial
function showNextTestimonial() {
  resetAnimation()
  currentIndex = (currentIndex + 1) % testimonials.length
  renderTestimonials('slide-right') // Update content and reattach event listeners
  restartAutoSlide()
}

// Show previous testimonial
function showPrevTestimonial() {
  resetAnimation()
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length
  renderTestimonials('slide-left') // Update content and reattach event listeners
  restartAutoSlide()
}

// Update slider position
function updateSliderPosition(index) {
  updateActiveSpan(index)
}

// Restart auto slide
function restartAutoSlide() {
  clearInterval(autoSlideInterval)
  startAutoSlide()
}

// Start auto slide
function startAutoSlide() {
  autoSlideInterval = setInterval(showNextTestimonial, 2500)
}

// Handle span click
function handleSpanClick(index) {
  if (index !== currentIndex) {
    const animationClass = index > currentIndex ? 'slide-right' : 'slide-left'
    currentIndex = index

    renderTestimonials(animationClass) // Update content and reattach event listeners
    resetAnimation() // Reset animation class

    updateSliderPosition(currentIndex)
    restartAutoSlide()
  }
}

// Initialize slider span event listeners
function initializeSliderSpanEventListeners() {
  document.querySelectorAll('.slider-span-container').forEach((container) => {
    container.addEventListener('click', () => {
      handleSpanClick(parseInt(container.dataset.index))
    })
  })
}

// Initialize event listeners
function initializeEventListeners() {
  iconRight.addEventListener('click', showNextTestimonial)
  iconLeft.addEventListener('click', showPrevTestimonial)
}

// Handle touch and drag events
function handleTouchDragEvents() {
  testimonialContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
    isDragging = true
    clearInterval(autoSlideInterval)
  })

  testimonialContainer.addEventListener('touchmove', (e) => {
    if (isDragging) {
      currentX = e.touches[0].clientX
      const difference = currentX - startX
      testimonialContainer.style.transform = `translateX(${difference}px)`
    }
  })

  testimonialContainer.addEventListener('touchend', (e) => {
    handleDragEnd(e.changedTouches[0].clientX)
  })

  testimonialContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX
    isDragging = true
    clearInterval(autoSlideInterval)
  })

  testimonialContainer.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.clientX
      const difference = currentX - startX
      testimonialContainer.style.transform = `translateX(${difference}px)`
    }
  })

  testimonialContainer.addEventListener('mouseup', (e) => {
    handleDragEnd(e.clientX)
  })

  testimonialContainer.addEventListener('mouseleave', (e) => {
    if (isDragging) {
      handleDragEnd(e.clientX)
    }
  })

  function handleDragEnd(endX) {
    isDragging = false
    const difference = endX - startX
    const threshold = 20 // Lower threshold for smaller drags

    if (difference < -threshold) {
      // Dragging left
      showNextTestimonial()
    } else if (difference > threshold) {
      // Dragging right
      showPrevTestimonial()
    }

    // Smooth transition
    testimonialContainer.style.transition = 'transform 0.2s ease'
    testimonialContainer.style.transform = 'translateX(0)'

    restartAutoSlide()

    setTimeout(() => {
      testimonialContainer.style.transition = ''
    }, 200) // Shorter timeout after animation
  }
}

// Initialize the slider
renderTestimonials('slide-right')
initializeEventListeners()
startAutoSlide()
handleTouchDragEvents()






