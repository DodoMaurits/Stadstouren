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

    /* ----- STARTOVERLAY ----- */
    const items = document.querySelectorAll('.grid-item[data-opt]');
    const startOverlayPlaceholder = document.getElementById('startOverlay');
    if (startOverlayPlaceholder) {
        startOverlayPlaceholder.innerHTML = `
            <div id="overlay" class="overlay" aria-hidden="true">
                <div class="modal">
                    <button id="startClose" class="overlay-close">✕</button>
                    <div id="modalContent"></div>
                    <p>
                        Nadat je op start drukt krijg je eerst een introductie.
                        Daarna start je zelf de tijd.
                    </p>
                    <div class="modal-buttons">
                        <a id="confirmBtn" class="modal-btn" href="#">
                            Start avontuur
                        </a>
                    </div>
                </div>
            </div>
        `;
        const overlay = document.getElementById('overlay');
        const startClose = document.getElementById('startClose');
        const confirmBtn = document.getElementById('confirmBtn');
        const modalContent = document.getElementById('modalContent');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const targetPage = item.dataset.opt;
                const templateId = item.dataset.template;
                const template = document.getElementById(templateId);
                if (template && modalContent) {
                    modalContent.innerHTML = template.innerHTML;
                }
                confirmBtn.href = targetPage;
                overlay.classList.add('visible');
                overlay.setAttribute('aria-hidden', 'false');
            });
        });
        startClose.addEventListener('click', () => {
            overlay.classList.remove('visible');
            overlay.setAttribute('aria-hidden', 'true');
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
                overlay.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /* ----- INFOOVERLAY ----- */
    const infoBtn = document.getElementById('infoBtn');
    if (infoBtn) {
        const infoText = `
            Elk scenario komt langs dezelfde plekken, maar vertelt een ander verhaal.
            Kies dus welk scenario het beste bij jouw smaak of de situatie past.<br><br>
    
            Ben je een fan van detectives en 'whodunit'? Kies dan het moordmysterie.
            Spreekt het leren over de geschiedenis van de stad je aan? Kies dan voor de tijdreiziger.
            Houd je van rekenen en puzzelen? Dan is de puzzeltocht iets voor jou.
            Ben je in een gezelschap met kleinere kinderen? Kies dan voor de schattenjacht.
        `;
        document.body.insertAdjacentHTML('beforeend', `
            <div id="infoOverlay" class="overlay" aria-hidden="true">
                <div class="modal">
                    <button id="infoClose" class="overlay-close">✕</button>
                    <h2 style="font-weight: bold; margin-bottom: 10px;">
                        Uitleg scenario
                    </h2>
                    <p>${infoText}</p>
                </div>
            </div>
        `);
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
        infoOverlay.addEventListener('click', (e) => {
            if (e.target === infoOverlay) {
                infoOverlay.classList.remove('visible');
                infoOverlay.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /*----- NOTE KNOP -----*/
    const notesButton = document.getElementById("notesButton");
    const notesOverlay = document.getElementById("notesOverlay");
    const notesClose = document.getElementById("notesClose");
    const notesArea = document.getElementById("notesArea");
    const notesSave = document.getElementById("notesSave");
    
    if (notesButton && notesOverlay && notesClose && notesArea) {
        notesArea.value = localStorage.getItem("detectiveNotes") || "";
        notesButton.addEventListener("click", () => {
            notesOverlay.classList.add("visible");
        });
        notesClose.addEventListener("click", () => {
            notesOverlay.classList.remove("visible");
        });
        if (notesSave) {
            notesSave.addEventListener("click", () => {
                notesOverlay.classList.remove("visible");
            });
        }
        notesArea.addEventListener("input", () => {
            localStorage.setItem("detectiveNotes", notesArea.value);
        });
    }

    const homeButton = document.getElementById("homeButton");
    const homeOverlay = document.getElementById("homeOverlay");
    const homeCancel = document.getElementById("homeCancel");
    if (homeButton && homeOverlay && homeCancel) {
        homeButton.addEventListener("click", () => {
            homeOverlay.classList.add("visible");
        });
        homeCancel.addEventListener("click", () => {
            homeOverlay.classList.remove("visible");
        });
        homeOverlay.addEventListener("click", (e) => {
            if (e.target === homeOverlay) {
                homeOverlay.classList.remove("visible");
            }
        });
    }

});

