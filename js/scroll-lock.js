/**
 * Page scroll lock shared by the burger menu and the product modal.
 * A counter keeps the page locked while at least one of them is open.
 */
let locks = 0;

export function lockScroll() {
  locks += 1;

  if (locks > 1) {
    return;
  }

  // the scrollbar disappears with overflow: hidden — keep its width
  // as padding so the content does not jump to the right
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
  document.body.classList.add('scroll-lock');
}

export function unlockScroll() {
  if (locks === 0) {
    return;
  }

  locks -= 1;

  if (locks > 0) {
    return;
  }

  document.body.classList.remove('scroll-lock');
  document.body.style.paddingRight = '';
}
