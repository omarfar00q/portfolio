const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => links.classList.toggle('open'));

// Hash routing logic
const sections = document.querySelectorAll('main > section');
const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const navCta = document.querySelector('.nav-links .nav-cta');

function updateActiveNav(hash) {
  const target = hash || '#home';
  navAnchors.forEach(a => a.classList.remove('active'));
  if (navCta) navCta.classList.remove('active');
  
  const match = document.querySelector(`.nav-links a[href="${target}"]`);
  if (match) match.classList.add('active');
}

function handleRouting() {
  const hash = window.location.hash || '#home';
  const targetId = hash.substring(1);
  
  let found = false;
  sections.forEach(sec => {
    if (sec.id === targetId) {
      sec.style.display = '';
      // Re-trigger fade-in animation
      sec.style.animation = 'none';
      sec.offsetHeight; // force reflow
      sec.style.animation = '';
      found = true;
    } else {
      sec.style.display = 'none';
    }
  });
  
  // If hash is invalid, default to home
  if (!found && sections.length > 0) {
    sections.forEach(sec => sec.style.display = 'none');
    const home = document.getElementById('home');
    if (home) home.style.display = '';
  }
  
  setTimeout(() => window.scrollTo(0, 0), 10);
  
  // Update active nav state
  updateActiveNav(hash);
  
  // Close mobile menu
  if (links) links.classList.remove('open');

  // Re-trigger code-line animations in About section
  if (targetId === 'about') {
    document.querySelectorAll('.code-line').forEach(line => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = '';
    });
  }
}

window.addEventListener('hashchange', handleRouting);
// Initial load
handleRouting();

// Reveal animations via IntersectionObserver
const revealItems = document.querySelectorAll('.section, .project-card, .skill-card, .achievement, .ach-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [{opacity:0, transform:'translateY(18px)'}, {opacity:1, transform:'translateY(0)'}],
        {duration:650, easing:'cubic-bezier(.2,.7,.2,1)', fill:'forwards'}
      );
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.08});
revealItems.forEach(el => observer.observe(el));

// Back to top button visibility
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  // Show when scrolled past a threshold, or always on non-home pages
  const checkScroll = () => {
    const hash = window.location.hash || '#home';
    if (hash !== '#home') {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };
  window.addEventListener('hashchange', checkScroll);
  checkScroll();
}

// Copy email to clipboard
const copyBtn = document.getElementById('copyEmailBtn');
const copyBtnText = document.getElementById('copyBtnText');
const emailToCopy = 'omarfarooq2424@gmail.com';

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailToCopy);
      copyBtnText.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtnText.textContent = 'Copy Email';
        copyBtn.classList.remove('copied');
      }, 2500);
    } catch (err) {
      // Fallback for older browsers or restricted permissions
      const textarea = document.createElement('textarea');
      textarea.value = emailToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBtnText.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtnText.textContent = 'Copy Email';
        copyBtn.classList.remove('copied');
      }, 2500);
    }
  });
}
