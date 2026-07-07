// ── Active section nav highlight on scroll
    const sections = document.querySelectorAll('section[id], div[id]');
    const snavLinks = document.querySelectorAll('.snav a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 130) current = s.id;
      });
      snavLinks.forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === '#' + current);
      });
    }, { passive: true });
