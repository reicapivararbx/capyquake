export function detectDevice() {
  const ua = navigator.userAgent || '';

  // Phones and tablets always report a mobile User-Agent.
  const uaMobile =
    /android/i.test(ua) ||
    /iPhone|iPod|Windows Phone|Mobile/i.test(ua) ||
    /iPad/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  if (uaMobile) return 'mobile';

  // Touch-capable notebooks have maxTouchPoints > 0 but large screens and
  // a desktop UA, so require BOTH touch and a small viewport.
  const hasTouch = navigator.maxTouchPoints >= 1 && 'ontouchstart' in window;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 768;

  if (hasTouch && smallViewport) return 'mobile';

  return 'pc';
}

export function isMobile() {
  return detectDevice() === 'mobile';
}

export function setupDevice() {
  const device = detectDevice();
  document.body.dataset.device = device;
  return device;
}
