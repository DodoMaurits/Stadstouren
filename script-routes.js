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

---//Terugknop//---
document.querySelector('.close').addEventListener('click', function () {
    history.back();
});
