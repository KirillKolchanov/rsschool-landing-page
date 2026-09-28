/**
 * Product modal on the menu page.
 * The native <dialog> gives the dimmed backdrop, focus trapping and closing
 * with Escape; the page scroll is locked while it is open.
 */
import { formatPrice } from './price.js';
import { lockScroll, unlockScroll } from './scroll-lock.js';

const modal = document.querySelector('.modal');
const imageBox = modal.querySelector('.modal__img-box');
const title = modal.querySelector('#modal-title');
const description = modal.querySelector('.modal__description');
const priceOutput = modal.querySelector('.modal__price');
const closeButton = modal.querySelector('.modal__close');

function fillModal(product) {
  const image = document.createElement('img');

  image.className = 'modal__img';
  image.src = product.image;
  image.alt = product.name;
  image.width = 340;
  image.height = 340;

  imageBox.replaceChildren(image);
  title.textContent = product.name;
  description.textContent = product.description;
  priceOutput.textContent = formatPrice(product.price);
}

export function openProductModal(product) {
  fillModal(product);
  lockScroll();
  modal.showModal();
}

function closeModal() {
  modal.close();
}

// "close" fires for every way of closing, including Escape
modal.addEventListener('close', unlockScroll);

closeButton.addEventListener('click', closeModal);

// the dialog has no padding, so a click on the dialog element itself is
// a click on the dimmed area around the content; the press must also start
// there, so selecting text inside the window does not close it
let pressedOnBackdrop = false;

modal.addEventListener('pointerdown', (event) => {
  pressedOnBackdrop = event.target === modal;
});

modal.addEventListener('click', (event) => {
  if (event.target === modal && pressedOnBackdrop) {
    closeModal();
  }

  pressedOnBackdrop = false;
});
