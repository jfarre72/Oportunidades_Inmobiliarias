// Auto-detects images (foto<N>.<ext> or <N>.<ext>, N=1..60) and renders
// a professional carousel: main slide + thumbnails + counter + lightbox.
(async function () {
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carTrack');
  const thumbs = document.getElementById('carThumbs');
  const counter = document.getElementById('carCounter');
  const btnPrev = document.getElementById('carPrev');
  const btnNext = document.getElementById('carNext');
  const btnExpand = document.getElementById('carExpand');
  const placeholder = document.getElementById('galleryPlaceholder');

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');

  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const prefixes = ['foto', ''];
  const MAX = 60;

  const tryLoad = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });

  const candidates = [];
  for (let i = 1; i <= MAX; i++) {
    for (const p of prefixes) {
      for (const ext of exts) {
        candidates.push({ i, src: `images/${p}${i}.${ext}` });
      }
    }
  }

  const results = await Promise.all(candidates.map(c =>
    tryLoad(c.src).then(ok => ok ? { i: c.i, src: ok } : null)
  ));

  const byIndex = new Map();
  for (const r of results) {
    if (r && !byIndex.has(r.i)) byIndex.set(r.i, r.src);
  }
  const photos = [...byIndex.entries()].sort((a, b) => a[0] - b[0]).map(e => e[1]);

  if (photos.length === 0) return;
  placeholder.style.display = 'none';

  // Render slides
  photos.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel__slide' + (idx === 0 ? ' is-active' : '');
    slide.dataset.index = idx;
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Foto ${idx + 1}`;
    img.loading = idx === 0 ? 'eager' : 'lazy';
    slide.appendChild(img);
    track.appendChild(slide);

    const thumb = document.createElement('button');
    thumb.className = 'carousel__thumb' + (idx === 0 ? ' is-active' : '');
    thumb.dataset.index = idx;
    thumb.setAttribute('role', 'tab');
    thumb.setAttribute('aria-label', `Ver foto ${idx + 1}`);
    const tImg = document.createElement('img');
    tImg.src = src;
    tImg.alt = '';
    tImg.loading = 'lazy';
    thumb.appendChild(tImg);
    thumbs.appendChild(thumb);
  });

  let current = 0;

  const update = (next) => {
    current = (next + photos.length) % photos.length;
    track.querySelectorAll('.carousel__slide').forEach((s, i) =>
      s.classList.toggle('is-active', i === current)
    );
    thumbs.querySelectorAll('.carousel__thumb').forEach((t, i) =>
      t.classList.toggle('is-active', i === current)
    );
    counter.textContent = `${current + 1} / ${photos.length}`;
    const activeThumb = thumbs.children[current];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    if (!lb.hidden) lbImg.src = photos[current];
  };

  update(0);

  btnPrev.addEventListener('click', () => update(current - 1));
  btnNext.addEventListener('click', () => update(current + 1));

  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('.carousel__thumb');
    if (btn) update(parseInt(btn.dataset.index, 10));
  });

  // Click main image -> lightbox
  const openLightbox = () => {
    lbImg.src = photos[current];
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => { lb.hidden = true; document.body.style.overflow = ''; };

  track.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') openLightbox();
  });
  btnExpand.addEventListener('click', openLightbox);

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => update(current - 1));
  lbNext.addEventListener('click', () => update(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    const inCarousel = !lb.hidden ||
      carousel.matches(':hover') ||
      document.activeElement === btnPrev ||
      document.activeElement === btnNext;
    if (e.key === 'Escape' && !lb.hidden) closeLightbox();
    if (!inCarousel) return;
    if (e.key === 'ArrowLeft') update(current - 1);
    if (e.key === 'ArrowRight') update(current + 1);
  });

  // Touch swipe on stage
  let touchX = null;
  const stage = carousel.querySelector('.carousel__stage');
  stage.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) update(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // Preload neighbors for snappier nav
  const preload = (i) => { const im = new Image(); im.src = photos[(i + photos.length) % photos.length]; };
  preload(1); preload(photos.length - 1);
})();

document.getElementById('year').textContent = new Date().getFullYear();
