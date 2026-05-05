    // ── Hamburger
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });

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
