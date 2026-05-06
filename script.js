// Auto-load gallery images. Tries images/foto<N>.jpg and images/<N>.jpg
// for N from 1..60, in parallel, ignoring missing numbers.
(async function () {
  const gallery = document.getElementById('gallery');
  const placeholder = document.getElementById('galleryPlaceholder');
  const MAX = 60;

  const tryLoad = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const tasks = [];
  for (let i = 1; i <= MAX; i++) {
    tasks.push(
      tryLoad(`images/foto${i}.jpg`).then(s => s || tryLoad(`images/${i}.jpg`))
        .then(src => ({ i, src }))
    );
  }
  const results = await Promise.all(tasks);
  const found = results.filter(r => r.src).sort((a, b) => a.i - b.i).map(r => r.src);

  if (found.length === 0) return;
  if (placeholder) placeholder.style.display = 'none';

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
