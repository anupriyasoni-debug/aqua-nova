// BEFORE-AFTER SLIDER FUNCTIONALITY
const container = document.getElementById('comparisonContainer');
const beforeWrapper = document.getElementById('imgBeforeWrapper');
const handle = document.getElementById('sliderHandle');

let isDragging = false;

// start dragging when mouse is pressed anywhere on the image
container.addEventListener('mousedown', () => {
  isDragging = true;
});

// stop dragging when mouse is released anywhere on the page
window.addEventListener('mouseup', () => {
  isDragging = false;
});

// update slider position as mouse moves
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  updateSlider(e.clientX);
});

// also support touch devices (mobile/tablet)
container.addEventListener('touchstart', () => {
  isDragging = true;
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  updateSlider(e.touches[0].clientX);
});

// shared function to move the slider
function updateSlider(clientX) {
  const rect = container.getBoundingClientRect();
  let x = clientX - rect.left;
  let percent = (x / rect.width) * 100;

  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  beforeWrapper.style.width = percent + '%';
  handle.style.left = percent + '%';
}

// PROMISE WALL FUNCTIONALITY
const promiseInput = document.getElementById('promiseInput');
const promiseBtn = document.getElementById('promiseBtn');
const promiseWall = document.getElementById('promiseWall');

// a few starter promises so the wall doesn't look empty at first
const starterPromises = [
  "I will stop using single-use plastic",
  "I will pick up litter at the beach",
  "I will spread awareness about coral reefs"
];

starterPromises.forEach(addPromiseCard);

promiseBtn.addEventListener('click', () => {
  const text = promiseInput.value.trim();

  if (text === '') {
    return; // don't add empty promises
  }

  addPromiseCard(text);
  promiseInput.value = ''; // clear the input box
});

// allow pressing Enter key instead of clicking the button
promiseInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    promiseBtn.click();
  }
});

function addPromiseCard(text) {
  const card = document.createElement('div');
  card.className = 'promise-card';
  card.textContent = '🌊 ' + text;
  promiseWall.appendChild(card);
}

// PROMISE INFO MODAL FUNCTIONALITY
const promiseInfoBtn = document.getElementById('promiseInfoBtn');
const promiseModalOverlay = document.getElementById('promiseModalOverlay');
const promiseModalClose = document.getElementById('promiseModalClose');

promiseInfoBtn.addEventListener('click', () => {
  promiseModalOverlay.classList.add('active');
});

promiseModalClose.addEventListener('click', () => {
  promiseModalOverlay.classList.remove('active');
});

// close modal when clicking outside the box (on the dark overlay)
promiseModalOverlay.addEventListener('click', (e) => {
  if (e.target === promiseModalOverlay) {
    promiseModalOverlay.classList.remove('active');
  }
});

// close modal with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    promiseModalOverlay.classList.remove('active');
  }
});

// VOICES OF THE OCEAN - SCROLL REVEAL
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.3 // triggers when 30% of the element is visible on screen
});

revealElements.forEach((el) => {
  revealObserver.observe(el);
});
// COUNT-UP ANIMATION FOR STAT NUMBERS
const statNumbers = document.querySelectorAll('.stat-number');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target); // only run once per card
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach((el) => countObserver.observe(el));

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1500; // 1.5 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(progress * target);
    el.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}