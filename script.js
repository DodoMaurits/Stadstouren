document.addEventListener('DOMContentLoaded', function() {

    // Elementen ophalen
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("dropdown");
    const errorMessage = document.getElementById("errorMessage");

    const boatBtn = document.getElementById("boatBtn");
    const walkBtn = document.getElementById("walkBtn");

    const places = [
        { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
    ];

    let selectedPlace = null;

    // ----- Input -----
    if (searchInput) {
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
    }

    // ----- Selectie -----
    function selectPlace(place) {
        selectedPlace = place;
        searchInput.value = place.name;
        dropdown.style.display = "none";
        enableButtons();
    }

    // ----- Buttons -----
    function disableButtons() {
        if (boatBtn) boatBtn.disabled = true;
        if (walkBtn) walkBtn.disabled = true;
    }

    function enableButtons() {
        if (boatBtn) boatBtn.disabled = false;
        if (walkBtn) walkBtn.disabled = false;
    }

    function showError() {
        errorMessage.textContent = "Kies een plaats";
    }

    if (boatBtn) {
        boatBtn.addEventListener("click", () => {
            if (!selectedPlace) return showError();
            window.location.href = selectedPlace.boat;
        });
    }

    if (walkBtn) {
        walkBtn.addEventListener("click", () => {
            if (!selectedPlace) return showError();
            window.location.href = selectedPlace.walk;
        });
    }

    disableButtons();

    // ----- Routes grid -----
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url) window.location.href = url;
        });
    });

    // Pak alle grid-items
    const items = document.querySelectorAll('.grid-item');
    
    // Pak modal elementen
    const overlay = document.getElementById('overlay');
    const modalClose = document.getElementById('modalClose');
    const confirmBtn = document.getElementById('confirmBtn');
    
    // Klik op grid-item → modal tonen
    items.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.opt; // lees data-opt waarde
            confirmBtn.href = targetPage;        // zet link in modal-knop
    
            overlay.setAttribute('aria-hidden', 'false');
            overlay.classList.add('visible');    // voor fade-in animatie
        });
    });
    
    // Klik op sluitknop → modal sluiten
    modalClose.addEventListener('click', () => {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    });
    
    // Optioneel: klik buiten modal sluit ook
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            overlay.setAttribute('aria-hidden', 'true');
        }
    });

    // Info modal
    const infoBtn = document.getElementById('infoBtn');
    const infoOverlay = document.getElementById('infoOverlay');
    const infoClose = document.getElementById('infoClose');
    
    infoBtn.addEventListener('click', () => {
        infoOverlay.classList.add('visible');
        infoOverlay.setAttribute('aria-hidden', 'false');
    });
    
    infoClose.addEventListener('click', () => {
        infoOverlay.classList.remove('visible');
        infoOverlay.setAttribute('aria-hidden', 'true');
    });
    
    // Klik buiten de modal sluit ook
    infoOverlay.addEventListener('click', (e) => {
        if (e.target === infoOverlay) {
            infoOverlay.classList.remove('visible');
            infoOverlay.setAttribute('aria-hidden', 'true');
        }
    });

});

    // Verdachten-grid
document.querySelectorAll('.verdachte').forEach(el => {
    const id = el.dataset.id;

    // Herstel status
    if (localStorage.getItem('verdachte-' + id) === 'afgestreept') {
        el.classList.add('afgestreept');
    }

    // Klikgedrag
    el.addEventListener('click', () => {
        el.classList.toggle('afgestreept');

        if (el.classList.contains('afgestreept')) {
            localStorage.setItem('verdachte-' + id, 'afgestreept');
        } else {
            localStorage.removeItem('verdachte-' + id);
        }
    });
});

// ---- ANTWOORD CONTROLE ----
const answerInput = document.getElementById('answerInput');
const answerError = document.getElementById('answerError');

if (answerInput) {
    const correctAnswer = answerInput.dataset.answer
        .trim()
        .toLowerCase();

    answerInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = answerInput.dataset.answer.trim().toLowerCase();
        
        const distance = levenshtein(userAnswer, correctAnswer);
        
        if (distance <= 1) {
            answerError.style.display = "none";

            // Toon succes-overlay
            infoOverlay.classList.add('visible');
            infoOverlay.setAttribute('aria-hidden', 'false');
        } else {
            answerError.style.display = "block";

            // visuele feedback
            answerInput.classList.add('input-error');
            setTimeout(() => {
                answerInput.classList.remove('input-error');
            }, 400);
        }
    });
}

const correctAnswers = answerInput.dataset.answer
    .toLowerCase()
    .split(',')
    .map(a => a.trim());

if (correctAnswers.includes(userAnswer)) {
    // goed
}

function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // vervanging
                    matrix[i][j - 1] + 1,     // invoeging
                    matrix[i - 1][j] + 1      // verwijdering
                );
            }
        }
    }

    return matrix[b.length][a.length];
}











