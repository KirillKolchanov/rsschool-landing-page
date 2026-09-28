/**
 * Menu page: product cards are rendered from data/products.json,
 * the category tabs switch the visible set without reloading the page.
 */
const DATA_URL = 'data/products.json';

const tabs = [...document.querySelectorAll('.tab')];
const grid = document.querySelector('.menu__grid');
const categoryTitle = document.querySelector('#category-title');

let products = [];

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

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
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

  // the first category is always active after the page is opened
  renderCategory(tabs[0].dataset.category);
}

if (grid && tabs.length > 0) {
  initMenu();
}
