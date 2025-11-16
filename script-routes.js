// Zorg dat het script pas draait als de pagina volledig geladen is
document.addEventListener('DOMContentLoaded', function() {
    
// Grid-items klikbaar maken
const gridItems = document.querySelectorAll('.grid-item');
gridItems.forEach(item => {
    item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) {window.location.href = url;}
    });
});

// Terug-knop
const backButton = document.querySelector('.back-button');
if (backButton) {
    backButton.addEventListener('click', () => {
        // Terug naar index.html
        window.location.href = 'index.html';
        // OF: history.back();
    });
}
}); 
Uncaught TypeError: Cannot read property 'addEventListener' of null
