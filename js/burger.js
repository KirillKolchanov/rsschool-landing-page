/**
 * Burger menu (768px and narrower).
 * The main navigation turns into a panel that slides in from the right
 * and fills the space under the header.
 */
import { lockScroll, unlockScroll } from './scroll-lock.js';

const mobileQuery = window.matchMedia('(max-width: 768px)');
const header = document.querySelector('.header');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

let isOpen = false;

function openMenu() {
  // the panel starts right under the header, wherever it is on the screen
  header.style.setProperty('--menu-top', `${header.getBoundingClientRect().bottom}px`);
  header.classList.add('header--menu-open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close menu');
  lockScroll();
  isOpen = true;
}

function closeMenu() {
  if (!isOpen) {
    return;
  }

  header.classList.remove('header--menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  unlockScroll();
  isOpen = false;
}

if (header && burger && nav) {
  burger.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // the scroll is unlocked before the browser follows the link,
  // so the jump to the anchor works as usual
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
      burger.focus();
    }
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });
}
