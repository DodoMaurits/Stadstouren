// ======================
// Verdachten-grid (groen/rood toggle)
// ======================
document.querySelectorAll('.verdachte').forEach(el => {
    const id = el.dataset.id;

    // Herstel status uit localStorage
    if (localStorage.getItem('verdachte-' + id) === 'afgestreept') {
        el.classList.add('afgestreept'); // rood
    } else {
        el.classList.remove('afgestreept'); // groen
    }

    // Klikgedrag: toggle rood/groen
    el.addEventListener('click', () => {
        el.classList.toggle('afgestreept');
        // update finale knop status na DOM-update
        setTimeout(() => {
            if (typeof updateButtonState === 'function') updateButtonState();
        }, 10);
        
        // Sla status op
        if (el.classList.contains('afgestreept')) {
            localStorage.setItem('verdachte-' + id, 'afgestreept');
        } else {
            localStorage.removeItem('verdachte-' + id);
        }
    });
});

// ======================
// ANTWOORD CONTROLE
// ======================
const answerInput = document.getElementById('answerInput');
const answerError = document.getElementById('answerError');
const infoOverlay = document.getElementById('infoOverlay');

if (answerInput) {
    const correctAnswers = answerInput.dataset.answer
        .toLowerCase()
        .split(',')
        .map(a => a.trim());

    answerInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const userAnswer = answerInput.value.trim().toLowerCase();
        let isCorrect = correctAnswers.some(correct => levenshtein(userAnswer, correct) <= 1);

        if (isCorrect) {
            if (answerError) answerError.style.display = "none";
            if (infoOverlay) {
                infoOverlay.classList.add('visible');
                infoOverlay.setAttribute('aria-hidden', 'false');
            }
        } else {
            if (answerError) answerError.style.display = "block";
            answerInput.classList.add('input-error');
            setTimeout(() => {
                answerInput.classList.remove('input-error');
            }, 400);
        }
    });
}

// Levenshtein functie voor spellingsafwijkingen
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            matrix[i][j] = b[i - 1] === a[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
        }
    }
    return matrix[b.length][a.length];
}

// Info overlay sluiten
const infoClose2 = document.getElementById('infoClose2');
if (infoClose2 && infoOverlay) {
    infoClose2.addEventListener('click', () => {
        infoOverlay.classList.remove('visible');
        infoOverlay.setAttribute('aria-hidden', 'true');
    });

    infoOverlay.addEventListener('click', (e) => {
        if (e.target === infoOverlay) {
            infoOverlay.classList.remove('visible');
            infoOverlay.setAttribute('aria-hidden', 'true');
        }
    });
}

// ======================
// ONTKNOPING FINALE PAGINA
// ======================
const answerInputFinal = document.getElementById("answerInput");
const finalButton = document.getElementById("finalButton");

if (answerInputFinal && finalButton) {

    const correctWeapon = answerInputFinal.dataset.answer
        .toLowerCase()
        .split(",")
        .map(a => a.trim());

    const correctSuspectId = "eigenaar"; // pas aan per scenario

    // Check welke verdachten nog groen zijn
    function getRemainingSuspects() {
        return Array.from(document.querySelectorAll(".verdachte"))
            .filter(v => !v.classList.contains("afgestreept"));
    }

    // Controleer of het wapen correct is
    function weaponIsCorrect() {
        const user = answerInputFinal.value.trim().toLowerCase();
        if (!user) return false;
        return correctWeapon.some(correct => levenshtein(user, correct) <= 1);
    }

    // Controleer of de juiste verdachte groen is
    function suspectIsCorrect() {
        const remaining = getRemainingSuspects();
        return remaining.length === 1 && remaining[0].dataset.id === correctSuspectId;
    }

    // Update de finale knop status
    function updateButtonState() {
        const hasInput = answerInputFinal.value.trim().length > 0;
        const oneSuspectLeft = getRemainingSuspects().length === 1;
        finalButton.disabled = !(hasInput && oneSuspectLeft);
    }

    // Listeners om knopstatus te updaten
    answerInputFinal.addEventListener("input", updateButtonState);
    document.querySelectorAll(".verdachte").forEach(el => {
        el.addEventListener("click", () => setTimeout(updateButtonState, 10));
    });

    // Klik op finale knop → juiste ontknopingspagina
    finalButton.addEventListener("click", () => {
        const weaponCorrect = weaponIsCorrect();
        const suspectCorrect = suspectIsCorrect();

        let targetPage = "";

        if (weaponCorrect && suspectCorrect) {
            targetPage = "L1-singel-mm-goed.html";
        } else if (weaponCorrect && !suspectCorrect) {
            targetPage = "L1-singel-mm-foutwapen.html";
        } else if (!weaponCorrect && suspectCorrect) {
            targetPage = "L1-singel-mm-goedwapen.html";
        } else {
            targetPage = "L1-singel-mm-fout.html";
        }

        window.location.href = targetPage;
    });

    // Direct check bij laden van pagina
    updateButtonState();
}
