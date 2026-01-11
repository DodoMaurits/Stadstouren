document.addEventListener('DOMContentLoaded', function() {

    // ----- ELEMENTEN -----
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("dropdown");
    const errorMessage = document.getElementById("errorMessage");
    const boatBtn = document.getElementById("boatBtn");
    const walkBtn = document.getElementById("walkBtn");

    const infoOverlay = document.getElementById('infoOverlay');
    const answerInput = document.getElementById('answerInput');
    const answerError = document.getElementById('answerError');

    const places = [
        { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
    ];

    let selectedPlace = null;

    // ----- FUNCTIES -----
    function disableButtons() {
        if (boatBtn) boatBtn.disabled = true;
        if (walkBtn) walkBtn.disabled = true;
    }

    function enableButtons() {
        if (boatBtn) boatBtn.disabled = false;
        if (walkBtn) walkBtn.disabled = false;
    }

    function showError(message) {
        if (errorMessage) errorMessage.textContent = message;
    }

    function levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function openOverlay(overlay) {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeOverlay(overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    }

    // ----- ZOEK EN SELECTIE -----
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            dropdown.innerHTML = "";
            showError("");
            selectedPlace = null;
            disableButtons();

            if (query.length === 0) {
                dropdown.style.display = "none";
                return;
            }

            const filtered = places.filter(p => p.name.toLowerCase().includes(query));
            dropdown.style.display = filtered.length ? "block" : "none";

            filtered.forEach(place => {
                const item = document.createElement("div");
                item.className = "dropdown-item";
                item.textContent = place.name;

                item.addEventListener("click", () => {
                    selectedPlace = place;
                    searchInput.value = place.name;
                    dropdown.style.display = "none";
                    enableButtons();
                });

                dropdown.appendChild(item);
            });
        });
    }

    if (boatBtn) {
        boatBtn.addEventListener("click", () => {
            if (!selectedPlace) return showError("Kies een plaats");
            window.location.href = selectedPlace.boat;
        });
    }

    if (walkBtn) {
        walkBtn.addEventListener("click", () => {
            if (!selectedPlace) return showError("Kies een plaats");
            window.location.href = selectedPlace.walk;
        });
    }

    disableButtons();

    // ----- GRID ITEMS -----
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url || item.dataset.opt;
            if (url) window.location.href = url;
        });
    });

    // ----- VERDACHTEN GRID -----
    document.querySelectorAll('.verdachte').forEach(el => {
        const id = el.dataset.id;
        if (localStorage.getItem('verdachte-' + id) === 'afgestreept') {
            el.classList.add('afgestreept');
        }

        el.addEventListener('click', () => {
            el.classList.toggle('afgestreept');
            if (el.classList.contains('afgestreept')) {
                localStorage.setItem('verdachte-' + id, 'afgestreept');
            } else {
                localStorage.removeItem('verdachte-' + id);
            }
        });
    });

    // ----- ANTWOORD CONTROLE -----
    if (answerInput && answerError && infoOverlay) {
        answerInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = answerInput.dataset.answer.trim().toLowerCase();
            const distance = levenshtein(userAnswer, correctAnswer);

            if (distance <= 1) {
                answerError.style.display = 'none';
                openOverlay(infoOverlay);
            } else {
                answerError.style.display = 'block';
                answerInput.classList.add('input-error');
                setTimeout(() => answerInput.classList.remove('input-error'), 400);
            }
        });
    }

    // ----- MODALS -----
    // Kruisje sluit alle modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.overlay');
            if (overlay) closeOverlay(overlay);
        });
    });

    // Klik buiten sluit overlay
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay(overlay);
        });
    });

});
