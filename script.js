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

    // ----- Terugknop -----
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

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


