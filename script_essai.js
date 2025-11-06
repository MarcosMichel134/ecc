// Fonctionnalité de recherche de cantiques
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('cantique-search');
  const searchBtn = document.getElementById('search-btn');
  
  // Fonction pour effectuer la recherche
  function performSearch() { 
    const cantiqueNumber = searchInput.value.trim();
    
    if (cantiqueNumber && !isNaN(cantiqueNumber) && cantiqueNumber > 0) {
      // Rediriger vers la page du cantique correspondant
      window.location.href = `../CANTIQUES/C${cantiqueNumber}.html`;
    } else {
      // Afficher un message d'erreur si le numéro n'est pas valide
      alert('Veuillez entrer un numéro de cantique valide');
      searchInput.focus();
    }
  }
  
  // Événement de clic sur le bouton de recherche
  searchBtn.addEventListener('click', performSearch);
  
  // Événement de touche "Entrée" dans le champ de recherche
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Reste du code existant pour la navigation entre sections...
  const sections = document.querySelectorAll('section');
  const progressIndicator = document.getElementById('progress-indicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;
  const totalSections = sections.length;
  
  // Créer les indicateurs de progression
  function createProgressIndicators() {
      for (let i = 0; i < totalSections; i++) {
          const dot = document.createElement('div');
          dot.classList.add('progress-dot');
          if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => goToSection(i));
          progressIndicator.appendChild(dot);
      }
  }
  
  // Mettre à jour les indicateurs de progression
  function updateProgressIndicators() {
      const dots = document.querySelectorAll('.progress-dot');
      dots.forEach((dot, index) => {
          if (index === currentIndex) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
  }
  
  // Mettre à jour l'état des boutons
  function updateButtons() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalSections - 1;
  }
  
  // Aller à une section spécifique
  function goToSection(index) {
      if (index < 0 || index >= totalSections) return;
      
      // Mettre à jour l'état des sections
      sections.forEach((section, i) => {
          section.classList.remove('active', 'previous');
          
          if (i === index) {
              section.classList.add('active');
          } else if (i < index) {
              section.classList.add('previous');
          }
      });
      
      currentIndex = index;
      updateProgressIndicators();
      updateButtons();
  }
  
  // Navigation tactile (swipe)
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', function(e) {
      touchStartY = e.changedTouches[0].screenY;
  });
  
  document.addEventListener('touchend', function(e) {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
  });
  
  function handleSwipe() {
      const swipeThreshold = 50; // Seuil minimal pour détecter un swipe
      
      if (touchEndY < touchStartY - swipeThreshold) {
          // Swipe vers le haut - aller à la section suivante
          if (currentIndex < totalSections - 1) {
              goToSection(currentIndex + 1);
          }
      } else if (touchEndY > touchStartY + swipeThreshold) {
          // Swipe vers le bas - aller à la section précédente
          if (currentIndex > 0) {
              goToSection(currentIndex - 1);
          }
      }
  }
  
  // Événements des boutons
  prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
          goToSection(currentIndex - 1);
      }
  });
  
  nextBtn.addEventListener('click', () => {
      if (currentIndex < totalSections - 1) {
          goToSection(currentIndex + 1);
      }
  });
  
  // Initialisation
  createProgressIndicators();
  updateButtons();
});
