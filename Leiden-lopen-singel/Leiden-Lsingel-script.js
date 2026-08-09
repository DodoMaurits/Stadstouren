const isResultPage = !!localStorage.getItem("timeTravelResults");

document.addEventListener("DOMContentLoaded", () => {

    /* ----- NAVIGATIEKNOPPEN ----- */
    (function() {
        const pages = document.querySelectorAll('.page');
        let currentPageId = "0";    
        // Navigeer naar een pagina
        function navigateTo(pageId) {
            const targetPage = document.getElementById(`page-${pageId}`);
            if (!targetPage) return;
            pages.forEach(page => page.classList.remove('active'));
            targetPage.classList.add('active');
            currentPageId = pageId;
            window.location.hash = pageId;
            window.scrollTo(0, 0);

            setTimeout(() => {
                buildVerdachtenGrid();
                restoreVerdachtenState();
                if (typeof updateButtonState === 'function') {
                    updateButtonState(); // Update de knopstatus
                }
            }, 50);
        }
        // Klik op navigatieknooppen
        document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-page]');
        if (!button) return;
        e.preventDefault();
        navigateTo(button.getAttribute('data-page'));
        });
        // Start op de eerste pagina
        const initialPage = window.location.hash.substring(1) || "0";
        navigateTo(initialPage);
    })();
    
    /* ----- VERDACHTENGRID ----- */
    function buildVerdachtenGrid() {
        // Selecteer ALLE containers (niet alleen de eerste)
        const containers = document.querySelectorAll(".verdachten-grid-container");
    
        containers.forEach(container => {
            // Bouw de grid alleen als hij leeg is
            if (container.innerHTML.trim() === "") {
                container.innerHTML = `
                    <div class="verdachte" data-id="boomverzorger">
                        <img src="../icons/De_boomverzorger.png" alt="Verdachte">
                        <p><br>De boomverzorger</p>
                    </div>
                    <div class="verdachte" data-id="vogeldief">
                        <img src="../icons/De_vogeldief.png" alt="Verdachte">
                        <p><br>De vogeldief</p>
                    </div>
                    <div class="verdachte" data-id="vogelspotter">
                        <img src="../icons/De_vogelspotter.png" alt="Verdachte">
                        <p><br>De vogelspotter</p>
                    </div>
                    <div class="verdachte" data-id="dakloze">
                        <img src="../icons/De_dakloze.png" alt="Verdachte">
                        <p><br>De dakloze</p>
                    </div>
                    <div class="verdachte" data-id="vogelverzorger">
                        <img src="../icons/De_vogelverzorger.png" alt="Verdachte">
                        <p><br>De vogelverzorger van de volière</p>
                    </div>
                    <div class="verdachte" data-id="eigenaar">
                        <img src="../icons/De_eigenaar.png" alt="Verdachte">
                        <p><br>De eigenaar<br>van de muziektent</p>
                    </div>
                    <div class="verdachte" data-id="portier">
                        <img src="../icons/De_portier.png" alt="Verdachte">
                        <p><br>De portier<br>van de concertzaal</p>
                    </div>
                    <div class="verdachte" data-id="schoonmaker">
                        <img src="../icons/De_schoonmaker.png" alt="Verdachte">
                        <p><br>De schoonmaker<br>van het zwanenbassin</p>
                    </div>
                `;
            }
    
            // Voeg click handlers toe (alleen als ze nog niet bestaan)
            container.querySelectorAll(".verdachte").forEach(el => {
                if (!el.hasClickHandler) { // Voorkom dubbele handlers
                    el.addEventListener('click', () => {
                        el.classList.toggle('afgestreept');
                        const id = el.dataset.id;
                        if (el.classList.contains('afgestreept')) {
                            localStorage.setItem('verdachte-' + id, 'afgestreept');
                        } else {
                            localStorage.removeItem('verdachte-' + id);
                        }
                        if (typeof updateButtonState === 'function') {
                            setTimeout(updateButtonState, 10);
                        }
                    });
                    el.hasClickHandler = true;
                }
            });
        });
    }

    // Herstel de state
    function restoreVerdachtenState() {
        // Herstel state voor ALLE verdachten in de DOM
        document.querySelectorAll(".verdachte").forEach(el => {
            const id = el.dataset.id;
            el.classList.toggle('afgestreept', localStorage.getItem('verdachte-' + id) === 'afgestreept');
        });
    }

    // Initialiseer
    buildVerdachtenGrid();
    restoreVerdachtenState();

    // Luister naar navigatie
    document.addEventListener('click', (e) => {
        const button = e.target.closest('[data-page]');
        if (!button) return;
        setTimeout(() => {
            buildVerdachtenGrid();
            restoreVerdachtenState();
        }, 50);
    });
    
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
            const activePage = document.querySelector('.page.active');
            if (!activePage) return [];
            return Array.from(activePage.querySelectorAll(".verdachte"))
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
        /* Voeg click handlers toe aan bestaande verdachten (voor de eerste pagina) */
        document.querySelectorAll(".verdachte").forEach(el => {
            if (!el.hasClickHandler) {
                el.addEventListener("click", () => setTimeout(updateButtonState, 10));
                el.hasClickHandler = true;
            }
        });
        /* Listeners om knopstatus te updaten */
        answerInputFinal.addEventListener("input", updateButtonState);
        /* Klik op finale knop → juiste ontknopingspagina */
        finalButton.addEventListener("click", () => {
            const weaponCorrect = weaponIsCorrect();
            const suspectCorrect = suspectIsCorrect();
            let targetPage = "";
            if (weaponCorrect && suspectCorrect) {
                targetPage = "102";
            } else if (weaponCorrect && !suspectCorrect) {
                targetPage = "103";
            } else if (!weaponCorrect && suspectCorrect) {
                targetPage = "101";
            } else {
                targetPage = "100";
            }
            localStorage.setItem("timerEnd", Date.now());
            navigateTo(targetPage);
        });
        updateButtonState(); /* Direct check bij laden van pagina */
    }
    const targetPageElement = document.getElementById(`page-${targetPage}`);
    if (targetPageElement) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        targetPageElement.classList.add('active');
        window.location.hash = targetPage;
        window.scrollTo(0, 0);
    }
    const closeGameButton = document.getElementById("closeGameButton");
    if (closeGameButton) {
        closeGameButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
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
