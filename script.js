document.addEventListener('DOMContentLoaded', function() {

    /* ----- INDEX ----- */
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("dropdown");
    const errorMessage = document.getElementById("errorMessage");
    const boatBtn = document.getElementById("boatBtn");
    const walkBtn = document.getElementById("walkBtn");
    const places = [
        { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
    ];
    if (searchInput) {
        searchInput.addEventListener("focus", () => {
            dropdown.innerHTML = "";
            places.forEach(place => {
                const item = document.createElement("div");
                item.className = "dropdown-item";
                item.textContent = place.name;
                item.addEventListener("click", () => {
                    selectPlace(place);
                });
                dropdown.appendChild(item);
            });
            dropdown.style.display = "block";
        });
    }
    let selectedPlace = null;
    function selectPlace(place) {
        selectedPlace = place;
        searchInput.value = place.name;
        dropdown.style.display = "none";
        enableButtons();
    }
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

    /* ----- GRID ITEMS ----- */
    if (document.querySelector('.grid-item[data-url]')) {
        initRoutesPage(); }
    if (document.querySelector('.grid-item[data-opt]')) {
        initScenarioPage(); }
    function initRoutesPage() {
        const items = document.querySelectorAll('.grid-item[data-url]');
    
        items.forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.dataset.url;
            });
        });
    }
    function initScenarioPage() {
        const items = document.querySelectorAll('.grid-item[data-opt]');
    
        items.forEach(item => {
            item.addEventListener('click', () => {
                const template = document.getElementById(item.dataset.template);
                const targetPage = item.dataset.opt;
    
                openOverlay(`
                    ${template.innerHTML}
                    <a href="${targetPage}" class="modal-btn">
                        Start avontuur
                    </a>
                `);
            });
        });
    }
    
    /* ----- OVERLAYFUNCTIE ----- */
    const overlay = document.getElementById('overlay');
    const overlayContent = document.getElementById('overlayContent');
    const overlayClose = document.getElementById('overlayClose');
    
    function openOverlay(html) {
        overlayContent.innerHTML = html;
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
    }
    
    function closeOverlay() {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        overlayContent.innerHTML = "";
    }
    overlayClose.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
    
    /* ----- STARTOVERLAY ----- */
    items.forEach(item => {
        item.addEventListener('click', () => {
            const template = document.getElementById(item.dataset.template);
            const targetPage = item.dataset.opt;
            openOverlay(`
                ${template.innerHTML}
                <p>
                    Nadat je op start drukt krijg je eerst een introductie.
                    Daarna start je zelf de tijd.
                </p>
                <a class="modal-btn" href="${targetPage}">
                    Start avontuur
                </a>
            `);
        });
    });

    /* ----- INFOOVERLAY ----- */
    const infoBtn = document.getElementById('infoBtn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            openOverlay(`
                <h2>Uitleg scenario</h2>
                <p>
                Elk scenario komt langs dezelfde plekken, maar vertelt een ander verhaal.
                Kies dus welk scenario het beste bij jouw smaak of de situatie past.
                <br><br>
                Ben je een fan van detectives en 'whodunit'? Kies dan het moordmysterie.
                Spreekt het leren over de geschiedenis van de stad je aan? Kies dan voor de tijdreiziger.
                Houd je van rekenen en puzzelen? Dan is de puzzeltocht iets voor jou.
                Ben je in een gezelschap met kleinere kinderen? Kies dan voor de schattenjacht.
                </p>
            `);
        });
    }

/* ---------- TOP-ROW ---------- */
    const container = document.querySelector(".container");
    if (container) {
        container.insertAdjacentHTML("afterbegin", `
        <div class="top-row">
            <button id="notesButton" class="notes-button">✏️</button>
            <div id="timer" class="timer">0:00:00</div>
            <button id="homeButton" class="home-button">x</button>
        </div>
        `);
    }

    /*----- NOTE KNOP -----*/
    const notesButton = document.getElementById("notesButton");
    if (notesButton) {
        notesButton.addEventListener("click", () => {
            openOverlay(`
                <div class="notes-modal">
                    <h2>Notitieboekje</h2>
                    <textarea id="notesArea" placeholder="Schrijf hier je notities..."></textarea>
                    <button id="notesSave">Opslaan</button>
                </div>
            `);
            setTimeout(() => {
                const notesArea = document.getElementById("notesArea");
                const notesSave = document.getElementById("notesSave");
                notesArea.value = localStorage.getItem("detectiveNotes") || "";
                notesArea.addEventListener("input", () => {
                    localStorage.setItem("detectiveNotes", notesArea.value);
                });
                notesSave.addEventListener("click", closeOverlay);
            }, 0);
        });
    }

    /* ----- TIMER ----- */
    const timerEl = document.getElementById("timer");
    const startTimerButton = document.getElementById("startTimerButton");
    if (startTimerButton) {
        startTimerButton.addEventListener("click", () => {
            localStorage.removeItem("timerEnd");
            localStorage.setItem("timerStart", Date.now());
        });
    }
    if (timerEl) {
        startTime = Number(localStorage.getItem("timerStart"));
        if (!startTime) {
            timerEl.textContent = "0:00:00";
        } else {
            const endTime = localStorage.getItem("timerEnd");
            function showTime(diff) {
                const hours = Math.floor(diff / 3600);
                const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
                const seconds = String(diff % 60).padStart(2, "0");
                timerEl.textContent = `${hours}:${minutes}:${seconds}`;
            }
            if (endTime) {
                const diff = Math.floor((endTime - startTime) / 1000);
                showTime(diff);
            } else {
                function updateTimer() {
                    const diff = Math.floor((Date.now() - startTime) / 1000);
                    showTime(diff);
                }
                updateTimer();
                timerInterval = setInterval(updateTimer, 1000);
            }
        }
    }

    /*----- HOMEKNOP SPEL SLUITEN-----*/
    const homeButton = document.getElementById("homeButton");
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            openOverlay(`
                <h2>Weet je het zeker?</h2>
                <p>Je verlaat het spel en je notities worden gewist.</p>
                <div class="modal-buttons" style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                    <a href="../../Leiden-L1-singel.html" class="back-button">Ja</a>
                    <button class="back-button" onclick="closeOverlay()">Nee</button>
                </div>
            `);
        });
    }

});

/* ---------- SPELLINGSAFWIJKINGEN (LEVENSHTEIN) ---------- */
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b[i - 1] === a[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
        }
    }
    return matrix[b.length][a.length];
}

