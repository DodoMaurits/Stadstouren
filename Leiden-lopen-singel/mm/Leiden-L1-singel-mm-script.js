document.addEventListener("DOMContentLoaded", () => {

/* ---------- GEDEELDE LAY-OUT ---------- */
    const container = document.querySelector(".container");
    if (container) {
        container.insertAdjacentHTML("afterbegin", `
            <div class="top-row">
                <button id="notesButton" class="notes-button">✏️</button>
                <button class="home-button" id="homeButton">x</button>
            </div>

            <div id="notesOverlay" class="overlay">
                <div class="modal notes-modal">
                    <button id="notesClose" class="modal-close">✕</button>
                    <h2>Notitieboekje</h2>
                    <textarea
                        id="notesArea"
                        placeholder="Schrijf hier je notities..."
                    ></textarea>
                </div>
            </div>

            <div id="homeOverlay" class="overlay">
                <div class="modal">
                    <h2>Weet je het zeker?</h2>
                    <p>Je verlaat het spel en je notities worden gewist.</p>
                    <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
                        <a href="../../Leiden-L1-singel.html" id="homeConfirm" class="back-button">Ja</a>
                        <button id="homeCancel" class="back-button">Nee</button>
                    </div>
                </div>
            </div>
        `);
    }
    const homeConfirm = document.getElementById("homeConfirm");
    if (homeConfirm) {
        homeConfirm.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = homeConfirm.href;
        });
    }

    /* ----- VERDACHTENGRID ----- */
    const verdachtenContainer = document.getElementById("verdachtenGrid");
    if (verdachtenContainer) {
        verdachtenContainer.innerHTML = `
            <div class="verdachte" data-id="boomverzorger">
                <img src="../../icons/De_boomverzorger.png" alt="Verdachte">
                <p><br>De boomverzorger</p></div>

            <div class="verdachte" data-id="vogeldief">
                <img src="../../icons/De_vogeldief.png" alt="Verdachte">
                <p><br>De vogeldief</p></div>

            <div class="verdachte" data-id="vogelspotter">
                <img src="../../icons/De_vogelspotter.png" alt="Verdachte">
                <p><br>De vogelspotter</p></div>

            <div class="verdachte" data-id="dakloze">
                <img src="../../icons/De_dakloze.png" alt="Verdachte">
                <p><br>De dakloze</p></div>

            <div class="verdachte" data-id="vogelverzorger">
                <img src="../../icons/De_vogelverzorger.png" alt="Verdachte">
                <p><br>De vogelverzorger van de volière</p></div>

            <div class="verdachte" data-id="eigenaar">
                <img src="../../icons/De_eigenaar.png" alt="Verdachte">
                <p><br>De eigenaar<br>van de muziektent</p></div>

            <div class="verdachte" data-id="portier">
                <img src="../../icons/De_portier.png" alt="Verdachte">
                <p><br>De portier<br>van de concertzaal</p></div>

            <div class="verdachte" data-id="schoonmaker">
                <img src="../../icons/De_schoonmaker.png" alt="Verdachte">
                <p><br>De schoonmaker<br>van het zwanenbassin</p></div>
        `;
    
        verdachtenContainer.querySelectorAll(".verdachte").forEach(el => {
            const id = el.dataset.id;
            if (localStorage.getItem('verdachte-' + id) === 'afgestreept') {
                el.classList.add('afgestreept');
            } else {
                el.classList.remove('afgestreept');
            }
            el.addEventListener('click', () => { 
                el.classList.toggle('afgestreept');
                if (el.classList.contains('afgestreept')) {
                    localStorage.setItem('verdachte-' + id, 'afgestreept');
                } else {
                    localStorage.removeItem('verdachte-' + id);
                }
            });
        });
    }
    
    /* ---------- ANTWOORD CONTROLE ---------- */
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
    
    /* ---------- INFOOVERLAY SLUITEN ---------- */
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
    
    /* ---------- ONTKNOPING FINALE ---------- */
    const answerInputFinal = document.getElementById("answerInput");
    const finalButton = document.getElementById("finalButton");
    
    if (answerInputFinal && finalButton) {
        const correctWeapon = answerInputFinal.dataset.answer
            .toLowerCase()
            .split(",")
            .map(a => a.trim());
        const correctSuspectId = "eigenaar"; // pas aan per scenario
        /* Check welke verdachten nog groen zijn */
        function getRemainingSuspects() {
            return Array.from(document.querySelectorAll(".verdachte"))
                .filter(v => !v.classList.contains("afgestreept"));
        }
        /* Controleer of het wapen correct is */
        function weaponIsCorrect() {
            const user = answerInputFinal.value.trim().toLowerCase();
            if (!user) return false;
            return correctWeapon.some(correct => levenshtein(user, correct) <= 1);
        }
        /* Controleer of de juiste verdachte groen is */
        function suspectIsCorrect() {
            const remaining = getRemainingSuspects();
            return remaining.length === 1 && remaining[0].dataset.id === correctSuspectId;
        }
        /* Update de finale knop status */
        function updateButtonState() {
            const hasInput = answerInputFinal.value.trim().length > 0;
            const oneSuspectLeft = getRemainingSuspects().length === 1;
            finalButton.disabled = !(hasInput && oneSuspectLeft);
        }
        /* Listeners om knopstatus te updaten */
        answerInputFinal.addEventListener("input", updateButtonState);
        document.querySelectorAll(".verdachte").forEach(el => {
            el.addEventListener("click", () => setTimeout(updateButtonState, 10));
        });
        /* Klik op finale knop → juiste ontknopingspagina */
        finalButton.addEventListener("click", () => {
            const weaponCorrect = weaponIsCorrect();
            const suspectCorrect = suspectIsCorrect();
            let targetPage = "";
            if (weaponCorrect && suspectCorrect) {
                targetPage = "Leiden-L1-singel-mm-goed.html";
            } else if (weaponCorrect && !suspectCorrect) {
                targetPage = "Leiden-L1-singel-mm-foutwapen.html";
            } else if (!weaponCorrect && suspectCorrect) {
                targetPage = "Leiden-L1-singel-mm-goedwapen.html";
            } else {
                targetPage = "Leiden-L1-singel-mm-fout.html";
            }
            localStorage.clear();
            window.location.href = targetPage;
        });
        updateButtonState(); /* Direct check bij laden van pagina */
    }
});

/* ---------- SPELLINGSAFWIJKINGEN (LEVENSHTEIN) ---------- */
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
