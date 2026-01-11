document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       HULPFUNCTIES
    ========================== */

    function openOverlay(overlay) {
        if (!overlay) return;
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeOverlay(overlay) {
        if (!overlay) return;
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function levenshtein(a, b) {
        const m = [];
        for (let i = 0; i <= b.length; i++) m[i] = [i];
        for (let j = 0; j <= a.length; j++) m[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                m[i][j] = b[i - 1] === a[j - 1]
                    ? m[i - 1][j - 1]
                    : Math.min(
                        m[i - 1][j - 1] + 1,
                        m[i][j - 1] + 1,
                        m[i - 1][j] + 1
                    );
            }
        }
        return m[b.length][a.length];
    }

    /* =========================
       MODALS (UNIVERSEEL)
    ========================== */

    document.addEventListener('click', (e) => {

        // Kruisje
        if (e.target.classList.contains('modal-close')) {
            const overlay = e.target.closest('.overlay');
            closeOverlay(overlay);
        }

        // Klik buiten modal
        if (e.target.classList.contains('overlay')) {
            closeOverlay(e.target);
        }
    });

    /* =========================
       ZOEKVELD + KNOPPEN
    ========================== */

    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("dropdown");
    const errorMessage = document.getElementById("errorMessage");
    const boatBtn = document.getElementById("boatBtn");
    const walkBtn = document.getElementById("walkBtn");

    const places = [
        { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
    ];

    let selectedPlace = null;

    function disableButtons() {
        if (boatBtn) boatBtn.disabled = true;
        if (walkBtn) walkBtn.disabled = true;
    }

    function enableButtons() {
        if (boatBtn) boatBtn.disabled = false;
        if (walkBtn) walkBtn.disabled = false;
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            dropdown.innerHTML = "";
            errorMessage.textContent = "";
            selectedPlace = null;
            disableButtons();

            if (!query) {
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
            if (!selectedPlace) {
                errorMessage.textContent = "Kies een plaats";
                return;
            }
            window.location.href = selectedPlace.boat;
        });
    }

    if (walkBtn) {
        walkBtn.addEventListener("click", () => {
            if (!selectedPlace) {
                errorMessage.textContent = "Kies een plaats";
                return;
            }
            window.location.href = selectedPlace.walk;
        });
    }

    disableButtons();

    /* =========================
       GRID ITEMS + CONFIRM MODAL
    ========================== */

    const confirmOverlay = document.getElementById('overlay');
    const confirmBtn = document.getElementById('confirmBtn');

    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.opt || item.dataset.url;
            if (confirmBtn && target) confirmBtn.href = target;
            openOverlay(confirmOverlay);
        });
    });

    /* =========================
       INFO MODAL
    ========================== */

    const infoBtn = document.getElementById('infoBtn');
    const infoOverlay = document.getElementById('infoOverlay');

    if (infoBtn && infoOverlay) {
        infoBtn.addEventListener('click', () => {
            openOverlay(infoOverlay);
        });
    }

    /* =========================
       VERDACHTEN GRID
    ========================== */

    document.querySelectorAll('.verdachte').forEach(el => {
        const id = el.dataset.id;

        if (localStorage.getItem('verdachte-' + id)) {
            el.classList.add('afgestreept');
        }

        el.addEventListener('click', () => {
            el.classList.toggle('afgestreept');
            if (el.classList.contains('afgestreept')) {
                localStorage.setItem('verdachte-' + id, '1');
            } else {
                localStorage.removeItem('verdachte-' + id);
            }
        });
    });

    /* =========================
       ANTWOORD CONTROLE
    ========================== */

    const answerInput = document.getElementById('answerInput');
    const answerError = document.getElementById('answerError');
    const successOverlay = document.getElementById('modalOverlay') || infoOverlay;

    if (answerInput && answerError && successOverlay) {
        answerInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            const user = answerInput.value.trim().toLowerCase();
            const correct = answerInput.dataset.answer.trim().toLowerCase();

            if (levenshtein(user, correct) <= 1) {
                answerError.style.display = 'none';
                openOverlay(successOverlay);
            } else {
                answerError.style.display = 'block';
                answerInput.classList.add('input-error');
                setTimeout(() => answerInput.classList.remove('input-error'), 400);
            }
        });
    }

});
