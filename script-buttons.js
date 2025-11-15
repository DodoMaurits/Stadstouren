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
