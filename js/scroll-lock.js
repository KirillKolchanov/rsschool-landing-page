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
  // as padding so the content does not jump to the right. The width is
  // measured as the real change of the page width: on phones the scrollbar
  // takes no space, and any padding there makes the browser rescale the page
  const widthBefore = document.documentElement.clientWidth;

  document.body.classList.add('scroll-lock');

  const scrollbarWidth = document.documentElement.clientWidth - widthBefore;

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
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
