import isServer from './isServer';

export function scrollToTop() {
  if (!isServer()) {
    window.scrollTo(0, 0);
  }
}
