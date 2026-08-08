async (page) => {
  const results = {};

  async function analyzeImage(path) {
    return await page.evaluate(async (imgPath) => {
      const img = new Image();
      img.src = 'http://localhost:8099/' + imgPath;
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;

      const isBody = (r, g, b) => Math.abs(r - 0x33) < 40 && Math.abs(g - 0x66) < 40 && Math.abs(b - 0xcc) < 40;
      const isHead = (r, g, b) => Math.abs(r - 0xcc) < 30 && Math.abs(g - 0xaa) < 30 && Math.abs(b - 0x88) < 30;

      let bodyCount = 0, headCount = 0, minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          const i = (y * img.width + x) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          if (isBody(r, g, b)) {
            bodyCount++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
          if (isHead(r, g, b)) headCount++;
        }
      }
      return {
        width: img.width,
        height: img.height,
        bodyCount,
        headCount,
        bbox: bodyCount > 0 ? { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 } : null,
      };
    }, path);
  }

  results.movement = {
    tab1: await analyzeImage('def-vis-tab1.png'),
    tab2: await analyzeImage('def-vis-tab2.png'),
  };
  results.control = {
    tab1: await analyzeImage('def-tab1.png'),
    tab2: await analyzeImage('def-tab2.png'),
  };

  return JSON.stringify(results, null, 2);
}
