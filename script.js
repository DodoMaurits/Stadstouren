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

});

