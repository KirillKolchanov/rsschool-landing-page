/**
 * Product modal on the menu page.
 * The native <dialog> gives the dimmed backdrop, focus trapping and closing
 * with Escape; the page scroll is locked while it is open.
 * The size (one of) and the additives (any number of) change the total price.
 */
import { formatCents, toCents } from './price.js';
import { lockScroll, unlockScroll } from './scroll-lock.js';

const modal = document.querySelector('.modal');
const imageBox = modal.querySelector('.modal__img-box');
const title = modal.querySelector('#modal-title');
const description = modal.querySelector('.modal__description');
const optionsForm = modal.querySelector('.modal__options');
const sizeTabs = modal.querySelector('[data-option="size"]');
const additiveTabs = modal.querySelector('[data-option="additives"]');
const priceOutput = modal.querySelector('.modal__price');
const closeButton = modal.querySelector('.modal__close');

let currentProduct = null;
let isScrollLocked = false;

function createOptionTab({ type, name, value, marker, label, isChecked }) {
  const tab = document.createElement('label');
  const input = document.createElement('input');
  const icon = document.createElement('span');

  tab.className = 'tab';

  input.className = 'visually-hidden';
  input.type = type;
  input.name = name;
  input.value = value;
  input.checked = isChecked;

  icon.className = 'tab__icon';
  icon.textContent = marker;

  tab.append(input, icon, label);

  return tab;
}

function renderOptions(product) {
  // the first size is selected and no additives are chosen, so the total
  // matches the price on the card
  const sizes = Object.entries(product.sizes).map(([key, size], index) => createOptionTab({
    type: 'radio',
    name: 'size',
    value: key,
    marker: key.toUpperCase(),
    label: size.size,
    isChecked: index === 0,
  }));

  const additives = product.additives.map((additive, index) => createOptionTab({
    type: 'checkbox',
    name: 'additives',
    value: String(index),
    marker: String(index + 1),
    label: additive.name,
    isChecked: false,
  }));

  sizeTabs.replaceChildren(...sizes);
  additiveTabs.replaceChildren(...additives);
}

function getTotalCents() {
  const selectedSize = optionsForm.elements.size.value;
  const checkedAdditives = [...optionsForm.querySelectorAll('[name="additives"]:checked')];

  const sizeCents = toCents(currentProduct.sizes[selectedSize]['add-price']);
  const additivesCents = checkedAdditives.reduce(
    (sum, input) => sum + toCents(currentProduct.additives[input.value]['add-price']),
    0,
  );

  return toCents(currentProduct.price) + sizeCents + additivesCents;
}

function updatePrice() {
  priceOutput.textContent = formatCents(getTotalCents());
}

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

  renderOptions(product);
  updatePrice();
}

function releaseScroll() {
  if (isScrollLocked) {
    unlockScroll();
    isScrollLocked = false;
  }
}

export function openProductModal(product) {
  currentProduct = product;
  fillModal(product);

  if (!isScrollLocked) {
    lockScroll();
    isScrollLocked = true;
  }

  modal.showModal();
}

// the scroll is released right away: the "close" event comes asynchronously
function closeModal() {
  modal.close();
  releaseScroll();
}

optionsForm.addEventListener('change', updatePrice);

optionsForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

// covers closing with Escape
modal.addEventListener('close', releaseScroll);

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
