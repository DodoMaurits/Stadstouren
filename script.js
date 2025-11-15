const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const errorMessage = document.getElementById("errorMessage");

const boatBtn = document.getElementById("boatBtn");
const walkBtn = document.getElementById("walkBtn");

// Stedenlijst
const places = [
    { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
];

let selectedPlace = null;

/* ---------------- INPUT GEBEURTENIS ---------------- */
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    dropdown.innerHTML = "";
    errorMessage.textContent = "";
    selectedPlace = null;
    disableButtons();

    if (query.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    const filtered = places.filter(p =>
        p.name.toLowerCase().includes(query)
    );

    dropdown.style.display = filtered.length ? "block" : "none";

    filtered.forEach(place => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = place.name;

        item.addEventListener("click", () => {
            selectPlace(place);
        });

        dropdown.appendChild(item);
    });
});

/* ---------------- SELECTIE ---------------- */
function selectPlace(place) {
    selectedPlace = place;
    searchInput.value = place.name;
    searchInput.style.color = "black"; // zwart
    dropdown.style.display = "none";
    errorMessage.textContent = "";
    enableButtons();
}

/* ---------------- BUTTON CHECK ---------------- */
boatBtn.addEventListener("click", () => {
    if (!selectedPlace) {
        showError();
        return;
    }
    window.location.href = selectedPlace.boat;
});

walkBtn.addEventListener("click", () => {
    if (!selectedPlace) {
        showError();
        return;
    }
    window.location.href = selectedPlace.walk;
});

/* ---------------- HULPFUNCTIES ---------------- */
function disableButtons() {
    boatBtn.disabled = true;
    walkBtn.disabled = true;
}

function enableButtons() {
    boatBtn.disabled = false;
    walkBtn.disabled = false;
}

function showError() {
    errorMessage.textContent = "Kies een plaats";
}

/* Bij laden: knoppen uit */
disableButtons();

// Selecteer alle vierkanten
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const opt1 = document.getElementById('opt1');
  const opt2 = document.getElementById('opt2');
  const opt3 = document.getElementById('opt3');

  // helper: maak slug van titel: "Varen 4 km Highlights" -> "varen-4-km-highlights"
  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a') // NL chars
      .replace(/\s+/g, '-')           // spaties -> -
      .replace(/[^\w\-]+/g, '')       // verwijder niet-woordtekens
      .replace(/\-\-+/g, '-')         // dubbele - -> -
      .replace(/^-+/, '').replace(/-+$/, '');
  }

  function openModal(routeTitle) {
    modalTitle.textContent = 'Scenario kiezen';
    modalSubtitle.textContent = routeTitle;

    const base = slugify(routeTitle); // basis voor links

    // Bouw voorbeeld links (pas aan naar jouw bestandsnamen)
    opt1.href = base + '-puzzeltocht.html';
    opt1.textContent = 'Puzzeltocht';

    opt2.href = base + '-moordmysterie.html';
    opt2.textContent = 'Moordmysterie';

    opt3.href = base + '-schattenjacht.html';
    opt3.textContent = 'Schattenjacht';

    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    // focus optioneel op eerste knop
    opt1.focus();
  }

  function closeModal() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Klik op vierkanten -> open modal
  document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // als klik op select/option/label: negeer
      if (['SELECT', 'OPTION', 'LABEL'].includes(e.target.tagName)) return;

      const titleEl = item.querySelector('.title');
      const routeTitle = titleEl ? titleEl.textContent.trim() : 'Route';
      openModal(routeTitle);
    });
  });

  // Sluit-actie en klik buiten modal sluit ook
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // esc toets sluit modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});






