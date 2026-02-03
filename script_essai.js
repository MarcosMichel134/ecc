class CantiqueApp {
  constructor() {
    this.sections = document.querySelectorAll('.cantique-section');
    this.progressIndicator = document.getElementById('progress-indicator');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.currentPage = document.getElementById('current-page');
    this.totalPages = document.getElementById('total-pages');
    this.currentIndex = 0;
    this.totalSections = this.sections.length;
    
    this.init();
  }
  
  init() {
    // Initialiser la navigation
    this.initNavigation();
    
    // Initialiser la progression
    this.createProgressIndicators();
    
    // Initialiser la navigation au clavier
    this.initKeyboardNavigation();
    
    // Initialiser le swipe tactile
    this.initTouchNavigation();
    
    // Mettre à jour l'interface
    this.updateInterface();
  }
  
  // NAVIGATION ENTRE SECTIONS
  initNavigation() {
    this.prevBtn.addEventListener('click', () => this.goToPrevious());
    this.nextBtn.addEventListener('click', () => this.goToNext());
    
    // Mettre à jour les totaux
    this.totalPages.textContent = this.totalSections;
  }
  
  goToSection(index) {
    if (index < 0 || index >= this.totalSections) return;
    
    // Animation de transition
    this.sections.forEach((section, i) => {
      section.classList.remove('active', 'previous', 'next');
      
      if (i === index) {
        section.classList.add('active');
        section.setAttribute('aria-current', 'page');
      } else if (i < index) {
        section.classList.add('previous');
      } else {
        section.classList.add('next');
      }
    });
    
    this.currentIndex = index;
    this.updateInterface();
    
    // Annoncer le changement pour les lecteurs d'écran
    this.announceSectionChange();
  }
  
  goToPrevious() {
    if (this.currentIndex > 0) {
      this.goToSection(this.currentIndex - 1);
    }
  }
  
  goToNext() {
    if (this.currentIndex < this.totalSections - 1) {
      this.goToSection(this.currentIndex + 1);
    }
  }
  
  announceSectionChange() {
    const section = this.sections[this.currentIndex];
    const title = section.querySelector('.cantique-title')?.textContent || '';
    const announcement = `Section ${this.currentIndex + 1} sur ${this.totalSections}: ${title}`;
    
    // Créer un élément caché pour l'annonce
    let announcer = document.getElementById('aria-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'aria-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = announcement;
    
    // Effacer après l'annonce
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
  
  // INDICATEURS DE PROGRESSION
  createProgressIndicators() {
    this.progressIndicator.innerHTML = '';
    
    for (let i = 0; i < this.totalSections; i++) {
      const dot = document.createElement('button');
      dot.className = 'progress-dot';
      dot.setAttribute('aria-label', `Aller à la section ${i + 1}`);
      dot.setAttribute('data-title', `Section ${i + 1}`);
      
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        this.goToSection(i);
        dot.focus();
      });
      
      this.progressIndicator.appendChild(dot);
    }
  }
  
  updateProgressIndicators() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }
  
  // NAVIGATION CLAVIER
  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          this.goToPrevious();
          break;
          
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          if (!e.target.matches('input, textarea, button, [contenteditable]')) {
            e.preventDefault();
            this.goToNext();
          }
          break;
          
        case 'Home':
          e.preventDefault();
          this.goToSection(0);
          break;
          
        case 'End':
          e.preventDefault();
          this.goToSection(this.totalSections - 1);
          break;
      }
    });
  }
  
  // NAVIGATION TACTILE
  initTouchNavigation() {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchEndY = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartY, touchEndY, touchStartX, touchEndX);
    });
  }
  
  handleSwipe(startY, endY, startX, endX) {
    const verticalSwipe = Math.abs(endY - startY);
    const horizontalSwipe = Math.abs(endX - startX);
    const swipeThreshold = 50;
    
    // Préférer la navigation horizontale si le swipe est plus horizontal que vertical
    if (horizontalSwipe > verticalSwipe) {
      if (endX < startX - swipeThreshold) {
        // Swipe gauche -> suivant
        this.goToNext();
      } else if (endX > startX + swipeThreshold) {
        // Swipe droite -> précédent
        this.goToPrevious();
      }
    } else {
      if (endY < startY - swipeThreshold) {
        // Swipe haut -> suivant
        this.goToNext();
      } else if (endY > startY + swipeThreshold) {
        // Swipe bas -> précédent
        this.goToPrevious();
      }
    }
  }
  
  // MISE À JOUR DE L'INTERFACE
  updateInterface() {
    // Boutons
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.totalSections - 1;
    
    // Position actuelle
    this.currentPage.textContent = this.currentIndex + 1;
    
    // Indicateurs de progression
    this.updateProgressIndicators();
    
    // Mettre à jour les attributs ARIA
    this.updateAriaAttributes();
  }
  
  updateAriaAttributes() {
    this.sections.forEach((section, index) => {
      if (index === this.currentIndex) {
        section.setAttribute('aria-hidden', 'false');
      } else {
        section.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

// Initialiser l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  new CantiqueApp();
  
  // Ajouter un chargement fluide
  document.body.classList.add('loaded');
});
