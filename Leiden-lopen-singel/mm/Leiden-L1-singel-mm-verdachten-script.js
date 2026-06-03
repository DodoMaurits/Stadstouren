document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("verdachtenGrid");

    if (!container) return;

    container.innerHTML = `
            <div class="verdachte" data-id="boomverzorger">
                <img src="../../icons/De_boomverzorger.png" alt="Verdachte">
                <p><br>De boomverzorger</p>
            </div>

            <div class="verdachte" data-id="vogeldief">
                <img src="../../icons/De_vogeldief.png" alt="Verdachte">
                <p><br>De vogeldief</p>
            </div>

            <div class="verdachte" data-id="vogelspotter">
                <img src="../../icons/De_vogelspotter.png" alt="Verdachte">
                <p><br>De vogelspotter</p>
            </div>

            <div class="verdachte" data-id="dakloze">
                <img src="../../icons/De_dakloze.png" alt="Verdachte">
                <p><br>De dakloze</p>
            </div>

            <div class="verdachte" data-id="vogelverzorger">
                <img src="../../icons/De_vogelverzorger.png" alt="Verdachte">
                <p><br>De vogelverzorger van de volière</p>
            </div>

            <div class="verdachte" data-id="eigenaar">
                <img src="../../icons/De_eigenaar.png" alt="Verdachte">
                <p><br>De eigenaar<br>van de muziektent</p>
            </div>

            <div class="verdachte" data-id="portier">
                <img src="../../icons/De_portier.png" alt="Verdachte">
                <p><br>De portier<br>van de concertzaal</p>
            </div>

            <div class="verdachte" data-id="schoonmaker">
                <img src="../../icons/De_schoonmaker.png" alt="Verdachte">
                <p><br>De schoonmaker<br>van het zwanenbassin</p>
            </div>
        </div>
    `;
});
