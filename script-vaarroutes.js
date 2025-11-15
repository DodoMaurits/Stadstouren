document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const modalClose = document.getElementById('modalClose');
    const confirmBtn = document.getElementById('confirmBtn');

    let selectedUrl = null;

    // Klik op een scenario
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            selectedUrl = item.dataset.opt;
            overlay.classList.add('show');
            confirmBtn.href = selectedUrl; // direct koppelen
        });
    });

    // Sluit modal
    modalClose.addEventListener('click', () => {
        overlay.classList.remove('show');
    });

    // Klik buiten modal sluit modal
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('show');
    });
});
