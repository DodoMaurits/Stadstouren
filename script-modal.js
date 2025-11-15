document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const modalClose = document.getElementById('modalClose');
    const opt1 = document.getElementById('opt1');
    const opt2 = document.getElementById('opt2');
    const opt3 = document.getElementById('opt3');

    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            opt1.href = item.dataset.opt1;
            opt2.href = item.dataset.opt2;
            opt3.href = item.dataset.opt3;
            overlay.classList.add('show');
        });
    });

    modalClose.addEventListener('click', () => {
        overlay.classList.remove('show');
    });

    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('show');
    });
});
