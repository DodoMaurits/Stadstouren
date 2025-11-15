const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const errorMessage = document.getElementById("errorMessage");

const boatBtn = document.getElementById("boatBtn");
const walkBtn = document.getElementById("walkBtn");

const places = [
    { name: "Leiden", boat: "leiden-vaarroutes.html", walk: "leiden-wandelroutes.html" }
];

let selectedPlace = null;

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

    const filtered = places.filter(p => p.name.toLowerCase().includes(query));
    dropdown.style.display = filtered.length ? "block" : "none";

    filtered.forEach(place => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.textContent = place.name;
        item.addEventListener("click", () => selectPlace(place));
        dropdown.appendChild(item);
    });
});

function selectPlace(place) {
    selectedPlace = place;
    searchInput.value = place.name;
    searchInput.style.color = "black";
    dropdown.style.display = "none";
    errorMessage.textContent = "";
    enableButtons();
}

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

disableButtons();
