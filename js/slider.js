/**
 * "Favorite coffee" slider.
 * One slide is visible at a time; the track is moved by a percentage of its
 * width, so the position stays correct after the window is resized.
 */
const SWIPE_THRESHOLD = 50;

const slider = document.querySelector('.slider');

function initSlider(root) {
  const viewport = root.querySelector('.slider__viewport');
  const track = root.querySelector('.slider__track');
  const slides = [...root.querySelectorAll('.slide')];
  const controls = [...root.querySelectorAll('.slider__control')];
  const [prevButton, nextButton] = root.querySelectorAll('.slider__arrow');

  let current = 0;

  function goTo(index) {
    // the switching is cyclic: after the last slide comes the first one
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(${-current * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== current));
    });

    controls.forEach((control, controlIndex) => {
      const isActive = controlIndex === current;

      control.classList.toggle('slider__control--active', isActive);

      if (isActive) {
        control.setAttribute('aria-current', 'true');
      } else {
        control.removeAttribute('aria-current');
      }
    });
  }

  prevButton.addEventListener('click', () => goTo(current - 1));
  nextButton.addEventListener('click', () => goTo(current + 1));

  controls.forEach((control, index) => {
    control.addEventListener('click', () => goTo(index));
  });

  // swipe on touch screens
  let swipeStartX = null;

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') {
      swipeStartX = event.clientX;
    }
  });

  viewport.addEventListener('pointerup', (event) => {
    if (swipeStartX === null) {
      return;
    }

    const distance = event.clientX - swipeStartX;

    swipeStartX = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) {
      return;
    }

    goTo(distance < 0 ? current + 1 : current - 1);
  });

  viewport.addEventListener('pointercancel', () => {
    swipeStartX = null;
  });

  goTo(0);
}

if (slider) {
  initSlider(slider);
}
