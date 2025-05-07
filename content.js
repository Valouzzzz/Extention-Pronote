function modifierToutesLesNotes() {
  const elements = document.querySelectorAll('[aria-label]');
  elements.forEach(el => {
    const label = el.getAttribute('aria-label');
    const match = label ? label.match(/([\d,]+)(?:\s*Noté sur\s*(\d+))?/) : null;
    if (match) {
      let note = parseFloat(match[1].replace(',', '.'));
      let surCombien = match[2] ? parseFloat(match[2].replace(',', '.')) : 20;
      let noteSur20 = note / surCombien * 20;
      let noteArrondie = Math.max(13, Math.min(20, noteSur20));
      let noteTexte = noteArrondie.toFixed(2).replace('.', ',');
      el.textContent = noteTexte + ' /20';
      el.setAttribute('aria-label', noteTexte + ' Noté sur 20');
    }
  });
}

function ajouterInteractionProfAbsent() {
  const coursElements = document.querySelectorAll('li.flex-contain[tabindex="0"]');
  coursElements.forEach(cours => {
    const profAbsent = cours.querySelector('li.libelle-cours.flex-contain[aria-hidden="true"]');
    if (profAbsent && !profAbsent.dataset.listenerAdded) {
      profAbsent.dataset.listenerAdded = true;
      profAbsent.style.cursor = 'pointer';
      profAbsent.addEventListener('click', function () {
        const infoExistante = cours.querySelector('div.as-info.fixed');
        if (!infoExistante) {
          const li = document.createElement('li');
          li.classList.add('ie-chips');

          const div = document.createElement('div');
          div.classList.add('tag-style', 'm-left-s', 'container-etiquette', 'gd-util-rouge-foncee');
          div.textContent = 'Prof. absent';

          li.appendChild(div);
          const ul = cours.querySelector('ul.container-cours');
          if (ul) ul.appendChild(li);
        } else {
          infoExistante.remove();
        }
      });
    }
  });
}

// Observer qui relance les scripts quand le DOM change
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' || mutation.type === 'subtree') {
      modifierToutesLesNotes();
      ajouterInteractionProfAbsent();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Lancement initial
modifierToutesLesNotes();
ajouterInteractionProfAbsent();
