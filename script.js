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
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // voorkom toggle als je op select of option klikt
            if (['SELECT', 'OPTION', 'LABEL'].includes(e.target.tagName)) return;

            const menu = item.querySelector('.scenario-menu');

            // verberg alle andere scenario-menus
            document.querySelectorAll('.scenario-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });

            // toggle huidige menu met getComputedStyle
            if (window.getComputedStyle(menu).display === 'none') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        });
    });
});




