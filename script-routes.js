document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url) {
                window.location.href = url;
            }
        });
    });
});
