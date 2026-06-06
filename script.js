document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("searchInput");
    const dropdown = document.getElementById("dropdown");
    const errorMessage = document.getElementById("errorMessage");
    const boatBtn = document.getElementById("boatBtn");
    const walkBtn = document.getElementById("walkBtn");
    const places = [
        { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
    ];
    let selectedPlace = null;
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
    const items = document.querySelectorAll('.grid-item[data-opt]');
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

    /*----- NOTE KNOP -----*/
    const notesButton = document.getElementById("notesButton");
    if (notesButton) {
        notesButton.addEventListener("click", () => {
            openOverlay(`
                <div class="notes-modal">
                    <textarea id="notesArea"></textarea>
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
                notesSave.addEventListener("click", () => {
                    closeOverlay();
                });
            }, 0);
        });
    }

    /*----- HOMEKNOP SPEL SLUITEN-----*/
    const homeButton = document.getElementById("homeButton");
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            openOverlay(`
                <h2>Terug naar home?</h2>
                <p>Je voortgang wordt niet opgeslagen.</p>
                <div class="modal-buttons">
                    <a href="index.html" class="modal-btn">
                        Ja, ga terug
                    </a>
                    <button class="modal-btn" onclick="closeOverlay()">
                        Annuleren
                    </button>
                </div>
            `);
        });
    }

});

