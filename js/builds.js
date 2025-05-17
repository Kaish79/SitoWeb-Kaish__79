document.addEventListener('DOMContentLoaded', function() {
    const showAllButton = document.getElementById('showAllButton');
    const showAllButtonSurv = document.getElementById('showAllButtonSurv');
    const survivors = document.querySelectorAll('.divSurvivor');
    const killers = document.querySelectorAll('.divKiller');
    const credits = document.querySelector(".posCredits");
    const characters = document.querySelectorAll('.divKiller');
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    const modalDescription = document.getElementById("modalDescription");
    const modalImg = document.getElementById("modalImg");
    const navbar = document.getElementById("socialNavbar");
    const altBuilds = document.querySelectorAll('.altBuilds');

    // Cambia i dati per il nuovo Google Sheet
    let SHEET_ID = '1YOoavuCzr6f_-qg8TAiAvGopUbYjA0YBkiLFeWMORnM';
    let SHEET_TITLE = 'Perks';
    let SHEET_RANGE = 'A:C';  // Colonne A (ID), B (Nome), C (Descrizione)

    let FULL_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_TITLE}&range=${SHEET_RANGE}`;
    let descriptions = {}; // Oggetto per memorizzare le descrizioni

    fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {
            // Analizza i dati JSON
            const json = JSON.parse(rep.substring(47, rep.length - 2));
            const dataTable = json.table;
            const rows = dataTable.rows;

            rows.forEach(row => {
                const imageId = row.c[0]?.v; // ID dell'immagine nella colonna A
                const description = row.c[2]?.v; // Descrizione nella colonna C
                if (imageId) {
                    descriptions[imageId] = description;
                }
            });
        })
        .catch(error => console.error('Error: fetching descriptions from Google Sheet', error));

    document.querySelectorAll('.altPerks img').forEach(function(image) {
        image.addEventListener('click', function(event) {
            event.preventDefault();
            const imageId = this.getAttribute('data-name');
            const description = descriptions[imageId];
            const modalTitle = document.getElementById('modalTitle');
            modalTitle.innerText = this.title; // Usa il title dell'immagine

            modalDescription.innerHTML = description || "Nessuna descrizione disponibile.";
            modalImg.src = this.src; // Aggiorna la sorgente dell'immagine nel modal
            modalImg.alt = this.alt; // Aggiorna il testo alternativo dell'immagine nel modal
            modal.style.display = "block";
        });
    });

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    showAllButton.addEventListener('click', function() {
        showAllButtonSurv.classList.remove('active');
        this.classList.add('active');

        killers.forEach(function(killer) {
            killer.classList.remove('hidden', 'centeredKiller');
            credits.classList.remove('credits');
        });
        survivors.forEach(function(surv) {
            surv.classList.add('hidden');
        });
    });

    showAllButtonSurv.addEventListener('click', function() {
        showAllButton.classList.remove('active');
        killers.forEach(function(killer) {
            killer.classList.add('hidden');
        });
        survivors.forEach(function(surv) {
            surv.classList.remove('hidden');
            credits.classList.add('credits');
        });
        this.classList.add('active');
    });

    document.querySelectorAll('.altBuilds').forEach(function(button) {
        button.addEventListener('click', function() {
            let parentKiller = this.closest('.divKiller');
            let selectedBuild = this.getAttribute('data-name');

            parentKiller.querySelectorAll('.altBuilds').forEach(function(btn) {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            parentKiller.querySelectorAll('.perkKiller').forEach(function(perk) {
                if (perk.classList.contains(selectedBuild)) {
                    perk.classList.remove('hidden');
                } else {
                    perk.classList.add('hidden');
                }
            });
        });
    });

    // Assicurarsi che tutti i personaggi siano visibili al caricamento della pagina
    window.addEventListener('load', function() {
        characters.forEach(function(character) {
            character.classList.remove('hidden');
        });
    });
});