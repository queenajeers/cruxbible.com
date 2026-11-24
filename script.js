// cruxbible.com: the rotating word, the poster rows and the nav's edge.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Poster rows (each row is drawn twice so the slide loops without a seam).
  const posters = [
    ['creation', 'Creation', 'Genesis 1'],
    ['fall', 'The Fall', 'Genesis 3'],
    ['flood', 'Noah’s Ark', 'Genesis 6–9'],
    ['promise', 'The Promise', 'Genesis 15'],
    ['exodus', 'The Red Sea', 'Exodus 14'],
    ['sinai', 'Mount Sinai', 'Exodus 19–20'],
    ['david', 'David & Goliath', '1 Samuel 17'],
    ['psalms', 'The Psalms', 'Psalms'],
    ['daniel', 'The Lions’ Den', 'Daniel 6'],
    ['jonah', 'Jonah', 'Jonah 1–2'],
    ['birth', 'The Birth of Jesus', 'Luke 2'],
    ['shepherd', 'The Good Shepherd', 'John 10'],
    ['cross', 'The Cross', 'John 19'],
    ['tomb', 'The Empty Tomb', 'John 20'],
    ['pentecost', 'Pentecost', 'Acts 2'],
    ['newcreation', 'All Things New', 'Revelation 21–22'],
  ];
  const card = ([file, title, ref]) =>
    `<figure class="poster"><img src="art/posters/${file}.webp" alt="${title}, ${ref}" loading="lazy" width="560" height="560">` +
    `<figcaption><b>${title}</b><small>${ref}</small></figcaption></figure>`;
  const rows = [posters.filter((_, i) => i % 2 === 0), posters.filter((_, i) => i % 2 === 1)];
  document.querySelectorAll('[data-marquee] .track').forEach((track, i) => {
    const html = rows[i].map(card).join('');
    track.innerHTML = reduce ? html : html + html;
    if (!reduce) track.querySelectorAll('.poster').forEach((p, k) => { if (k >= rows[i].length) p.setAttribute('aria-hidden', 'true'); });
  });

  // "See ___ in a whole new way."
  const words = ['Creation', 'the Exodus', 'the Psalms', 'the Prophets', 'the Cross', 'Revelation', 'Genesis'];
  const word = document.querySelector('.rot-word');
  if (word && !reduce) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      word.classList.add('out');
      setTimeout(() => {
        word.textContent = words[i];
        word.classList.remove('out');
        word.classList.add('in');
        requestAnimationFrame(() => requestAnimationFrame(() => word.classList.remove('in')));
      }, 350);
    }, 2400);
  }

  // A hairline under the nav once the page scrolls.
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero collage: each column drifts at its own pace as the page scrolls.
  const cols = [...document.querySelectorAll('.col[data-speed]')];
  if (cols.length && !reduce) {
    let ticking = false;
    const drift = () => {
      const y = Math.min(window.scrollY, 1200);
      cols.forEach((c) => { c.style.transform = `translate3d(0, ${(y * parseFloat(c.dataset.speed)).toFixed(1)}px, 0)`; });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
    drift();
  }
})();
