/**
 * Menu page: product cards are rendered from data/products.json,
 * the category tabs switch the visible set without reloading the page.
 */
import { openProductModal } from './modal.js';
import { formatPrice } from './price.js';

const DATA_URL = 'data/products.json';
// how many cards are shown on 768px and narrower before "show more" is pressed
// (the limit itself is applied in CSS, so it follows the window width)
const COLLAPSED_CARDS_COUNT = 4;

const tabs = [...document.querySelectorAll('.tab')];
const grid = document.querySelector('.menu__grid');
const categoryTitle = document.querySelector('#category-title');
const moreButton = document.querySelector('.menu__more');

let products = [];
// every card keeps a link to its product object, the modal is built from it
const cardProducts = new WeakMap();

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createCard(product) {
  const card = createElement('li', 'card');
  const imageBox = createElement('div', 'card__img-box');
  const image = createElement('img', 'card__img');
  const body = createElement('div', 'card__body');
  const info = createElement('div', 'card__info');

  card.tabIndex = 0;

  image.src = product.image;
  image.alt = product.name;
  image.width = 340;
  image.height = 340;
  image.loading = 'lazy';

  imageBox.append(image);
  info.append(
    createElement('h3', 'heading-3', product.name),
    createElement('p', '', product.description),
  );
  body.append(info, createElement('p', 'heading-3', formatPrice(product.price)));
  card.append(imageBox, body);
  cardProducts.set(card, product);

  return card;
}

function renderCategory(category) {
  const categoryProducts = products.filter((product) => product.category === category);

  tabs.forEach((tab) => {
    const isActive = tab.dataset.category === category;

    tab.classList.toggle('tab--active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));

    // the tab text without its decorative emoji icon
    if (isActive) {
      categoryTitle.textContent = tab.lastChild.textContent.trim();
    }
  });

  grid.replaceChildren(...categoryProducts.map(createCard));

  // every category starts with the initial set of cards
  const hasHiddenCards = categoryProducts.length > COLLAPSED_CARDS_COUNT;

  grid.classList.toggle('menu__grid--collapsed', hasHiddenCards);
  moreButton.hidden = !hasHiddenCards;
}

function showAllCards() {
  grid.classList.remove('menu__grid--collapsed');
  moreButton.hidden = true;

  // the button disappears, so the focus goes to the first card that was hidden
  grid.children[COLLAPSED_CARDS_COUNT]?.focus();
}

function showError() {
  const message = createElement('li', 'menu__message', 'Sorry, the menu could not be loaded. Please try again later.');

  grid.replaceChildren(message);
}

async function initMenu() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }

    products = await response.json();
  } catch (error) {
    console.error(error);
    showError();
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (!tab.classList.contains('tab--active')) {
        renderCategory(tab.dataset.category);
      }
    });
  });

  moreButton.addEventListener('click', showAllCards);

  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card');

    if (card) {
      openProductModal(cardProducts.get(card));
    }
  });

  grid.addEventListener('keydown', (event) => {
    const card = event.target.closest('.card');

    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openProductModal(cardProducts.get(card));
    }
  });

  // the first category is always active after the page is opened
  renderCategory(tabs[0].dataset.category);
}

if (grid && moreButton && tabs.length > 0) {
  initMenu();
}
