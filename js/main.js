// Bee's Bakery Cafe — shared behaviors
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Menu page: highlight active category as you scroll
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
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    menuSections.forEach(function (s) { obs.observe(s); });
  }

  // Contact form -> mailto fallback (no backend on this static site)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var message = form.message.value.trim();
      var subject = encodeURIComponent('Website inquiry from ' + (name || 'a guest'));
      var body = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\n\n' + message
      );
      window.location.href = 'mailto:beesbakeryoakhurst@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  // Current year in footer
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
