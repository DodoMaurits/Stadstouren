const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// Plaatsen die jij ondersteunt:
const places = [
    { name: "Leiden", link: "leiden.html" },
    // later kun je hier meer steden toevoegen
];

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    resultsDiv.innerHTML = "";

    if (query.length === 0) return;

    const filtered = places.filter(place =>
        place.name.toLowerCase().includes(query)
    );

    filtered.forEach(place => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = place.name;

        div.addEventListener("click", () => {
            window.location.href = place.link;
        });

        resultsDiv.appendChild(div);
    });
});
