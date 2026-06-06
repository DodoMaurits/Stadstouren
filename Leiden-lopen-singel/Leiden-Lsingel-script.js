let timerInterval;
let startTime;
let finalTime = null;
const isResultPage = !!localStorage.getItem("timeTravelResults");

document.addEventListener("DOMContentLoaded", () => {

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

    /* ----- JAARTALLENGRID ----- */
    const jaartallenContainer = document.getElementById("jaartallenGrid");
    if (jaartallenContainer) {
        jaartallenContainer.innerHTML = "";
    }    
    if (jaartallenContainer && !isResultPage) {
        for (let i = 1; i <= 12; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = 4;
            input.className = "jaartal-cirkel";
            input.placeholder = "...";
            const storageKey = `leiden-lsingel-jaartal-${i}`;
            const savedValue = localStorage.getItem(storageKey);
            if (savedValue) {
                input.value = savedValue;
                input.classList.add("filled");
            }
    
            input.addEventListener("input", () => {
                const value = input.value.replace(/\D/g, "").slice(0, 4);
                input.value = value;
                input.classList.remove("filled");
                if (value.length > 0) {
                    input.classList.add("editing");
                } else {
                    input.classList.remove("editing");
                    localStorage.removeItem(storageKey);
                }
            });
    
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const value = input.value.trim();
                    input.classList.remove("editing");
                    if (value) {
                        localStorage.setItem(storageKey, value);
                        input.classList.add("filled");
                    } else {
                        localStorage.removeItem(storageKey);
                        input.classList.remove("filled");
                    }
                    input.blur();
                }
            });
            input.addEventListener("blur", () => {
                const value = input.value.trim();
                input.classList.remove("editing");
                if (value) {
                    localStorage.setItem(storageKey, value);
                    input.classList.add("filled");
                } else {
                    localStorage.removeItem(storageKey);
                    input.classList.remove("filled");
                }
            });
            jaartallenContainer.appendChild(input);
        }
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
    
    /* ---------- ONTKNOPING MOORDMYSTERIE ---------- */
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
            localStorage.setItem("timerEnd", Date.now());
            window.location.href = targetPage;
        });
        updateButtonState(); /* Direct check bij laden van pagina */
    }
    const closeGameButton = document.getElementById("closeGameButton");
    if (closeGameButton) {
        closeGameButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = closeGameButton.href;
        });
    }

    /* ---------- ONTKNOPING TIJDREIZIGER ---------- */
    const correctYears = [
    "1901", // cirkel 1
    "1942", // cirkel 2
    "1632", // cirkel 3
    "1840", // cirkel 4
    "1516", // cirkel 5
    "1869", // cirkel 6
    "2043", // cirkel 7
    "1887", // cirkel 8
    "1977", // cirkel 9
    "1611", // cirkel 10
    "1903", // cirkel 11
    "1745"  // cirkel 12
    ];
    
    const timeFinalButton = document.getElementById("timeFinalButton");
    if (timeFinalButton) {
        function updateTimeButtonState() {
            let allFilled = true;
            for (let i = 1; i <= 12; i++) {
                const value = localStorage.getItem(
                    `leiden-lsingel-jaartal-${i}`
                );
                if (!value || value.trim() === "") {
                    allFilled = false;
                    break;
                }
            }
            timeFinalButton.disabled = !allFilled;
        }
        document.addEventListener("input", () => {
            setTimeout(updateTimeButtonState, 10);
        });
        updateTimeButtonState();
    }

    if (timeFinalButton) {
        timeFinalButton.addEventListener("click", () => {
            const randomIndex = Math.floor(Math.random() * 12);
            let results = [];
            for (let i = 1; i <= 12; i++) {
                const entered =
                    localStorage.getItem(`leiden-lsingel-jaartal-${i}`) || "";
                const correct =
                    correctYears[i - 1];
                results.push({
                    correct: entered === correct
                });
            }
            localStorage.setItem(
                "timeTravelResults",
                JSON.stringify(results)
            );
            const chosenCircle = results[randomIndex];
            localStorage.setItem(
                "selectedTimeCircle",
                randomIndex
            );
            localStorage.setItem(
                "timerEnd",
                Date.now()
            );
            if (chosenCircle.correct) {
                window.location.href =
                    "Leiden-Lsingel-tr-goed.html";
            } else {
                window.location.href =
                    "Leiden-Lsingel-tr-fout.html";
            }
        });
    }

    const resultGrid = document.getElementById("jaartallenGrid");
    const resultsData = localStorage.getItem("timeTravelResults");
    if (resultGrid && resultsData) {
        resultGrid.innerHTML = ""; // voorkomt dubbele grids
        const results = JSON.parse(resultsData);
        const selectedCircle = Number(
            localStorage.getItem("selectedTimeCircle")
        );
        for (let i = 1; i <= 12; i++) {
            const value =
                localStorage.getItem(
                    `leiden-lsingel-jaartal-${i}`
                ) || "";
            const circle =
                document.createElement("div");
            circle.className = "jaartal-result";
            circle.textContent = value;
            circle.classList.add(
                results[i - 1].correct
                    ? "correct"
                    : "incorrect"
            );
            if (selectedCircle === (i - 1)) {
                circle.classList.add("selected");
            }
            resultGrid.appendChild(circle);
        }
    }
});
