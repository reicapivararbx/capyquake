export function detectDevice() {
  // Detection logic (NOT solely User-Agent):
  // 1. Check navigator.maxTouchPoints >= 1
  // 2. Check 'ontouchstart' in window
  // 3. Check screen orientation (portrait = likely mobile)
  // 4. Check window.innerWidth < 768
  // 5. Check User-Agent for mobile keywords (secondary only)
  
  // If 2+ mobile signals → return 'mobile', else 'pc'
  let mobileSignals = 0;
  
  // 1. Check navigator.maxTouchPoints >= 1
  if (navigator.maxTouchPoints >= 1) {
    mobileSignals++;
  }
  
  // 2. Check 'ontouchstart' in window
  if ('ontouchstart' in window) {
    mobileSignals++;
  }
  
  // 3. Check screen orientation (portrait = likely mobile)
  if (screen.orientation && screen.orientation.angle !== 0) {
    mobileSignals++;
  }
  // Also consider portrait orientation as a mobile indicator
  if (window.innerHeight > window.innerWidth) {
    mobileSignals++;
  }
  
  // 4. Check window.innerWidth < 768
  if (window.innerWidth < 768) {
    mobileSignals++;
  }
  
  // 5. Check User-Agent for mobile keywords (secondary only)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent) ||
      /iPad|iPhone|iPod/.test(userAgent) ||
      /Windows Phone/i.test(userAgent) ||
      /Mobile/i.test(userAgent)) {
    mobileSignals++;
  }
  
  return mobileSignals >= 2 ? 'mobile' : 'pc';
}

export function isMobile() {
  return detectDevice() === 'mobile';
}

export function setupDevice() {
  const device = detectDevice();
  document.body.dataset.device = device;
  return device;
}