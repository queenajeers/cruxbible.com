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

  // Launch list: "Notify me" opens the dialog; the email goes to Cloud Firestore (project rebuke-visuals) through its
  // REST API. No SDK and no API key: the rules in firebase/firestore.rules allow exactly this one create and nothing
  // else. The document id is the SHA-256 of the email, so signing up twice keeps one entry.
  const dialog = document.getElementById('notify');
  if (dialog && typeof dialog.showModal === 'function') {
    const DB = 'projects/rebuke-visuals/databases/(default)';
    const COMMIT = `https://firestore.googleapis.com/v1/${DB}/documents:commit`;
    const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const form = dialog.querySelector('.notify-form');
    const input = form.elements.email;
    const trap = form.elements.website;
    const submit = form.querySelector('button[type="submit"]');
    const error = dialog.querySelector('.notify-error');
    const steps = dialog.querySelectorAll('.notify-step');
    let source = 'link';

    const show = (name) => steps.forEach((s) => { s.hidden = s.dataset.step !== name; });
    const setError = (msg) => {
      error.textContent = msg || '';
      error.hidden = !msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    const open = (from) => {
      source = from;
      if (!dialog.open) {
        show('form');
        setError('');
        dialog.showModal();
        input.focus();
      }
    };
    const sha256 = async (text) => {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
    };
    const save = async (email) => {
      const res = await fetch(COMMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          writes: [{
            update: {
              name: `${DB}/documents/waitlist/${await sha256(email)}`,
              fields: { email: { stringValue: email }, source: { stringValue: source } },
            },
            updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
            currentDocument: { exists: false },
          }],
        }),
      });
      if (res.ok) return;
      // Already on the list: the "must not exist yet" check fails, which is a success for the visitor.
      const body = await res.json().catch(() => ({}));
      const status = body.error && body.error.status;
      if (status === 'ALREADY_EXISTS' || status === 'FAILED_PRECONDITION') return;
      throw new Error(status || `HTTP ${res.status}`);
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-notify]');
      if (!trigger) return;
      e.preventDefault();
      open(trigger.dataset.notify);
    });
    dialog.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
    // A click on the dimmed backdrop lands on the <dialog> itself; one inside the card lands on a child.
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      if (location.hash === '#notify') history.replaceState(null, '', location.pathname + location.search);
    });
    input.addEventListener('input', () => { if (!error.hidden) setError(''); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim().toLowerCase();
      if (!EMAIL.test(email) || email.length > 254) {
        setError('Please enter a valid email address.');
        input.focus();
        return;
      }
      setError('');
      submit.disabled = true;
      submit.textContent = 'Saving…';
      try {
        if (!trap.value) await save(email); // bots fill the hidden field; people never see it
        dialog.querySelector('.notify-addr').textContent = email;
        form.reset();
        show('done');
        dialog.querySelector('[data-step="done"] .notify-h').focus();
      } catch (err) {
        setError('Sorry, that didn’t go through. Please check your connection and try again.');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Notify me';
      }
    });

    // cruxbible.com/#notify opens it straight away, for sharing.
    if (location.hash === '#notify') open('link');
    window.addEventListener('hashchange', () => { if (location.hash === '#notify') open('link'); });
  }
})();
