const galleries = {
  machinara: [
    'assets/projects/machinara-02.png','assets/projects/machinara-03.png','assets/projects/machinara-04.png','assets/projects/machinara-05.png','assets/projects/machinara-06.png','assets/projects/machinara-07.png','assets/projects/machinara-01.png'
  ],
  amaris: ['assets/projects/amaris-01.png','assets/projects/amaris-02.png','assets/projects/amaris-03.png','assets/projects/amaris-04.png','assets/projects/amaris-05.png','assets/projects/amaris-06.png'],
  artasy: ['assets/projects/artasy-01.png','assets/projects/artasy-02.png','assets/projects/artasy-03.png','assets/projects/artasy-04.png','assets/projects/artasy-05.png','assets/projects/artasy-06.png','assets/projects/artasy-07.png','assets/projects/artasy-08.png'],
  medical: ['assets/projects/medical-01.png','assets/projects/medical-02.png','assets/projects/medical-03.png','assets/projects/medical-04.png','assets/projects/medical-05.png'],
  spk: ['assets/projects/spk-01.png','assets/projects/spk-02.png','assets/projects/spk-03.png','assets/projects/spk-04.png','assets/projects/spk-05.png','assets/projects/spk-06.png'],
  siresik: ['assets/projects/siresik-02.png','assets/projects/siresik-03.png','assets/projects/siresik-04.png','assets/projects/siresik-05.png','assets/projects/siresik-06.png','assets/projects/siresik-01.png'],
  surat: ['assets/projects/surat-01.png','assets/projects/surat-02.png','assets/projects/surat-03.png','assets/projects/surat-04.png']
};

requestAnimationFrame(() => {
  document.body.classList.remove('js-pending');
  document.body.classList.add('is-ready');
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateSwap(image, direction = 1) {
  if (reducedMotion || !image.animate) return;
  image.animate([
    { opacity: .18, transform: `translate3d(${direction * 24}px,8px,0) scale(.986)`, filter: 'blur(2px)' },
    { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0px)' }
  ], {
    duration: 760,
    easing: 'cubic-bezier(.16,1,.3,1)'
  });
}

const heroImage = document.getElementById('hero-preview-image');
const heroTabs = [...document.querySelectorAll('.showcase-item')];
const heroStageCount = document.getElementById('hero-stage-count');
const heroActiveTitle = document.getElementById('hero-active-title');
const heroActiveKind = document.getElementById('hero-active-kind');
const heroActiveDesc = document.getElementById('hero-active-desc');
const heroPreview = document.querySelector('.hero-preview');
let heroAuto = null;

function setHeroSlide(tabIndex, direction = 1) {
  const tab = heroTabs[tabIndex];
  if (!tab || !heroImage) return;
  const previousIndex = heroTabs.findIndex(item => item.classList.contains('active'));
  heroTabs.forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  heroPreview?.classList.remove('is-changing');
  void heroPreview?.offsetWidth;
  heroPreview?.classList.add('is-changing');
  window.setTimeout(() => heroPreview?.classList.remove('is-changing'), 820);
  heroImage.src = tab.dataset.heroImage;
  heroImage.alt = tab.dataset.heroAlt;
  if (heroStageCount) heroStageCount.textContent = `${String(tabIndex + 1).padStart(2,'0')} / ${String(heroTabs.length).padStart(2,'0')}`;
  const progressBar = document.getElementById('showcase-progress-bar');
  if (progressBar && !reducedMotion) {
    progressBar.style.animation = 'none';
    void progressBar.offsetWidth;
    progressBar.style.animation = 'showcaseProgress 4.6s linear forwards';
  }
  if (heroActiveTitle) heroActiveTitle.textContent = tab.dataset.heroTitle || tab.textContent.trim();
  if (heroActiveKind) heroActiveKind.textContent = tab.dataset.heroKind || '';
  if (heroActiveDesc) heroActiveDesc.textContent = tab.dataset.heroDesc || '';
  animateSwap(heroImage, tabIndex >= previousIndex ? direction : -1);
}

heroTabs.forEach((tab, tabIndex) => {
  tab.addEventListener('click', () => setHeroSlide(tabIndex, tabIndex >= heroTabs.findIndex(item => item.classList.contains('active')) ? 1 : -1));
});

function startHeroAuto() {
  if (reducedMotion || heroTabs.length < 2) return;
  stopHeroAuto();
  heroAuto = window.setInterval(() => {
    const current = heroTabs.findIndex(item => item.classList.contains('active'));
    const next = (current + 1) % heroTabs.length;
    setHeroSlide(next, 1);
  }, 4600);
}

function stopHeroAuto() {
  if (heroAuto) {
    window.clearInterval(heroAuto);
    heroAuto = null;
  }
}

if (heroPreview) {
  heroPreview.addEventListener('mouseenter', stopHeroAuto);
  heroPreview.addEventListener('mouseleave', startHeroAuto);
  heroPreview.addEventListener('focusin', stopHeroAuto);
  heroPreview.addEventListener('focusout', startHeroAuto);
}

setHeroSlide(0, 1);
startHeroAuto();

document.querySelectorAll('.project-row[data-gallery]').forEach(project => {
  const key = project.dataset.gallery;
  const images = galleries[key] || [];
  const image = project.querySelector('.gallery-image');
  const counter = project.querySelector('.gallery-counter');
  const prev = project.querySelector('.gallery-prev');
  const next = project.querySelector('.gallery-next');
  let index = 0;

  const render = direction => {
    if (!images.length) return;
    index = (index + images.length) % images.length;
    image.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;
    animateSwap(image, direction);
  };

  prev?.addEventListener('click', () => {
    index -= 1;
    render(-1);
  });

  next?.addEventListener('click', () => {
    index += 1;
    render(1);
  });
});

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.section-intro, .project-row, .more-work, .process, .proof-band, .capabilities, .studio, .contact, .motion-reveal, .motion-reveal-left, .motion-reveal-right');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
}

const projectRows = [...document.querySelectorAll('.project-row[data-index]')];
const projectLinks = [...document.querySelectorAll('[data-project-link]')];
const railMeter = document.querySelector('.rail-meter span');
if ('IntersectionObserver' in window && projectRows.length && projectLinks.length) {
  const activeObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const idx = visible.target.dataset.index;
    projectLinks.forEach(link => link.classList.toggle('active', link.dataset.projectLink === idx));
    const projectIndexStatus = document.querySelector('.project-index-status');
    if (projectIndexStatus) projectIndexStatus.textContent = `${idx} / ${String(projectRows.length).padStart(2,'0')}`;
    const activeLink = projectLinks.find(link => link.dataset.projectLink === idx);
    activeLink?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    if (railMeter) {
      const pos = Math.max(1, Number(idx));
      railMeter.style.height = `${(pos / projectRows.length) * 100}%`;
    }
  }, { rootMargin: '-24% 0px -52% 0px', threshold: [0.15,0.35,0.6] });
  projectRows.forEach(row => activeObserver.observe(row));
}

if (!reducedMotion) {
  let ticking = false;
  const updateScrollMotion = () => {
    const studio = document.querySelector('.studio');
    const contact = document.querySelector('.contact');
    if (studio) {
      const rect = studio.getBoundingClientRect();
      const shift = Math.max(-55, Math.min(55, (window.innerHeight * .5 - rect.top) * .055));
      studio.style.setProperty('--studio-shift', `${shift}px`);
    }
    if (contact) {
      const rect = contact.getBoundingClientRect();
      const shift = Math.max(-70, Math.min(70, (window.innerHeight * .55 - rect.top) * .05));
      contact.style.setProperty('--contact-shift', `${shift}px`);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollMotion);
      ticking = true;
    }
  }, { passive: true });
  updateScrollMotion();
}
