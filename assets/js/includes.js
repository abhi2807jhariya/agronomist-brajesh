function openEmailLinksInNewTab() {
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

function setActiveNavigation() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const navLinks = document.querySelectorAll('.site-header .navbar-nav .nav-link');
  if (!navLinks.length) return;

  navLinks.forEach((link) => link.classList.remove('active'));

  let activeLink = null;
  if (path.includes('contact.html')) {
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="contact.html"]') ||
                 document.querySelector('.site-header .navbar-nav a[href*="#contact"]');
  } else if (path.includes('experience.html')) {
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="experience.html"]') ||
                 document.querySelector('.site-header .navbar-nav a[href*="#expertise"]');
  } else if (path.includes('about.html')) {
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="about.html"]');
  } else if (path.includes('farmer-meetings.html') || path.includes('product-demonstrations.html') || path.includes('dealer-networks.html')) {
    activeLink = document.querySelector('.site-header .navbar-nav .dropdown-toggle');
  } else if (hash === '#expertise') {
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="experience.html"]') ||
                 document.querySelector('.site-header .navbar-nav a[href*="#expertise"]');
  } else if (hash === '#contact') {
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="contact.html"]') ||
                 document.querySelector('.site-header .navbar-nav a[href*="#contact"]');
  } else {
    // Default Home link (strictly inside .navbar-nav to avoid matching .navbar-brand)
    activeLink = document.querySelector('.site-header .navbar-nav a[href*="#hero"]') ||
                 document.querySelector('.site-header .navbar-nav a[href*="index.html"]');
  }

  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Highlight specific dropdown item if inside blog pages
  if (path.includes('product-demonstrations.html')) {
    document.querySelector('.site-header .dropdown-menu a[href*="product-demonstrations.html"]')?.classList.add('active');
  } else if (path.includes('farmer-meetings.html')) {
    document.querySelector('.site-header .dropdown-menu a[href*="farmer-meetings.html"]')?.classList.add('active');
  } else if (path.includes('dealer-networks.html')) {
    document.querySelector('.site-header .dropdown-menu a[href*="dealer-networks.html"]')?.classList.add('active');
  }

  navLinks.forEach((link) => {
    if (!link.dataset.navBound) {
      link.dataset.navBound = 'true';
      link.addEventListener('click', () => {
        const href = link.getAttribute('href') || '';
        if (!link.classList.contains('dropdown-toggle') && (href.startsWith('#') || href.includes('index.html#'))) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }

        // Close mobile menu on click if open
        const navCollapse = document.getElementById('mainNavigation');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          toggler?.click();
        }
      });
    }
  });
}

window.addEventListener('hashchange', setActiveNavigation);
document.addEventListener('DOMContentLoaded', setActiveNavigation);

document.querySelectorAll('[data-include], .site-header, .site-footer').forEach(async (element) => {
  try {
    const includePath = element.dataset.include || (element.classList.contains('site-header') ? '/includes/header.html' : '/includes/footer.html');
    const response = await fetch(includePath);
    if (!response.ok) throw new Error(`Could not load ${includePath}`);
    element.outerHTML = await response.text();
    setActiveNavigation();
    openEmailLinksInNewTab();
  } catch (error) {
    console.error(error);
  }
});

setActiveNavigation();
openEmailLinksInNewTab();
