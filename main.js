// Bee's Bakery Cafe — shared behaviors
document.addEventListener('DOMContentLoaded', function () {

  // ---------- Mobile nav toggle ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Menu page: highlight active category as you scroll ----------
  var menuLinks = document.querySelectorAll('.menu-nav a');
  var menuSections = document.querySelectorAll('.menu-section');
  if (menuLinks.length && menuSections.length && 'IntersectionObserver' in window) {
    var byId = {};
    menuLinks.forEach(function (l) { byId[l.getAttribute('href').replace('#', '')] = l; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          menuLinks.forEach(function (l) { l.classList.remove('active'); });
          var link = byId[entry.target.id];
          if (link) {
            link.classList.add('active');
            link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    menuSections.forEach(function (s) { obs.observe(s); });
  }

  // ---------- Contact form -> mailto fallback (no backend on this static site) ----------
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var reason = form.reason ? form.reason.value.trim() : '';
      var message = form.message.value.trim();
      var subject = encodeURIComponent('Website inquiry from ' + (name || 'a guest') + (reason ? ' — ' + reason : ''));
      var body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nReason: ' + reason + '\n\n' + message
      );
      window.location.href = 'mailto:beesbakeryoakhurst@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  // ---------- Current year in footer ----------
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Reveal-on-scroll ----------
  var revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Gallery lightbox (with prev/next + keyboard nav) ----------
  var gallery = document.getElementById('gallery');
  var box = document.getElementById('lightbox');
  if (gallery && box) {
    var img = document.getElementById('lightbox-img');
    var caption = document.getElementById('lightbox-caption');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');
    var figures = Array.prototype.slice.call(gallery.querySelectorAll('figure'));
    var currentIndex = -1;

    function showImage(index) {
      if (index < 0) index = figures.length - 1;
      if (index >= figures.length) index = 0;
      currentIndex = index;
      var fig = figures[currentIndex];
      var full = fig.getAttribute('data-full');
      var altText = fig.querySelector('img').alt;
      img.src = full;
      img.alt = altText;
      if (caption) caption.textContent = altText;
    }

    function openLightbox(index) {
      showImage(index);
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }

    gallery.addEventListener('click', function (e) {
      var fig = e.target.closest('figure');
      if (!fig) return;
      openLightbox(figures.indexOf(fig));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); showImage(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); showImage(currentIndex + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
});
