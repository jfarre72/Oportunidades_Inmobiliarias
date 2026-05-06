// Auto-load gallery images from images/1.jpg, 2.jpg ... up to 30.
// Stops on first missing image. Supports .jpg, .jpeg, .png, .webp.
(async function () {
  const gallery = document.getElementById('gallery');
  const placeholder = document.getElementById('galleryPlaceholder');
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const found = [];

  const tryLoad = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  for (let i = 1; i <= 30; i++) {
    let hit = null;
    for (const ext of exts) {
      const src = `images/${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      const ok = await tryLoad(src);
      if (ok) { hit = ok; break; }
    }
    if (!hit) break;
    found.push(hit);
  }

  if (found.length === 0) return;
  placeholder.style.display = 'none';

  found.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Foto ${idx + 1} — Charcas al 2500`;
    img.loading = 'lazy';
    img.dataset.index = idx;
    gallery.appendChild(img);
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const close = document.getElementById('lightboxClose');
  const prev = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');
  let current = 0;

  const open = (i) => {
    current = i;
    lbImg.src = found[current];
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const hide = () => { lb.hidden = true; document.body.style.overflow = ''; };
  const move = (delta) => {
    current = (current + delta + found.length) % found.length;
    lbImg.src = found[current];
  };

  gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') open(parseInt(e.target.dataset.index, 10));
  });
  close.addEventListener('click', hide);
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
  });
})();

document.getElementById('year').textContent = new Date().getFullYear();
