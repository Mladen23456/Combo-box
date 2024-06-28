const BASE_URL = "/api/";

function w3_open() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}

async function getRadniNalog() {
    // popunjavanje tabele

    // selektuje table body iz html-a
    let tableBody = document.getElementById("tableBody")
    tableBody.innerHTML = null // čisti tabelu prije popunjavanja 

    try {
        // kreiramo red u tabeli
        let row
        const response = await fetch(`${BASE_URL}radni-nalozi`)
        const data = await response.json() // niz svih vozila iz baze

        data.forEach((radni_nalog) => {
            row = `
            <tr>
                <td>${radni_nalog?.id}</td>
                <td>${radni_nalog?.vozilo_id}</td>
                <td>${radni_nalog?.vozac_id}</td>
                <td>${radni_nalog?.opis_zadatka}</td>
                <td>${radni_nalog?.datum_i_vrijeme_izdavanja}</td>
                <td>${radni_nalog?.rok_zavrsavanja}</td>
                <td>${radni_nalog?.status}</td>
                <td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pencil" 
                        viewBox="0 0 16 16"
                        onClick="openUpdateModal(${radni_nalog?.id})"
                        >
                        <path
                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg></td>
                <td>
                    <div class="action-button" onClick="deleteRadniNalog(${radni_nalog?.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-trash" viewBox="0 0 16 16">
                            <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path
                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </div>
                </td>
            </tr>
            `
            tableBody.innerHTML += row

        })
        

    } catch (err) {
        tableBody.innerHTML = `<tr>Desila se greška!</tr>`
    }
}

async function deleteRadniNalog(radni_nalogId) {
    console.log("pozvana funkcija")
    try {
        // pokušavamo da izbrišemo vozilo
        const response = await fetch(`${BASE_URL}radni-nalozi/${radni_nalogId}`, {
            method: "DELETE"
        })

        getRadniNalog()

    } catch (err) {
        // ako se desi greška prilikom brisanja odradi ovo ispod
        console.log("greška je", err);
    }
}

getRadniNalog()

async function insertRadniNalog() {

    // kreiramo objekat vozilo koji šaljemo na api ili backend
    // atributi imaju isti naziv kao u pydantic šemi na backendu
    // vrijednosti kupimo iz input polja koje selektujemo preko id-a

    const radni_nalog = {
        vozilo_id: document.getElementById("vozilo_id").value,
        vozac_id: document.getElementById("vozac_id").value,
        opis_zadatka: document.getElementById("opis_zadatka").value,
        datum_i_vrijeme_izdavanja: document.getElementById("datum_i_vrijeme_izdavanja").value,
        rok_zavrsavanja: document.getElementById("rok_zavrsavanja").value,
        status: document.getElementById("status").value
    }

    try {
        for (let radniNalogAtribut in getRadniNalog) {
            // for petlja prolazi kroz svaki atribut objekta vozilo
            // if provjerava da li je polje prazno
            if (!radni_nalog[radniNalogAtribut]) {
                throw new Error("Nisu popunjena sva polja!")
            }
        }

        // pokušavamo da pošaljemo podatke na server i upišemo u bazu pomoću fetcha
        const response = await fetch(`${BASE_URL}radni-nalozi`, {
            method: "POST", // metoda post je za slanje podataka tj. upis
            body: JSON.stringify(radni_nalog), // u body ide objekat koji šaljemo apiju tj vozilo
            headers: {
                "Content-type": "application/json" // tip podatka
            }
        })

        if (!response.ok) { // provjeravamo da li nije upisan podatak u bazu
            throw new Error("Podaci nisu upisani u bazu!") // ako nije bacamo grešku
        }

        // forsira refresh stranice
        location.reload()

    } catch (err) { // hvatamo grešku
        document.getElementById("greskaUpisa").innerHTML = err?.message
    }

}
let idSelektovanogVozila = null

const openUpdateModal = async (idRadnogNaloga) => {
    // openUpdateModal funkcija otvara modal i popunjava ga sa podacima odabranog vozila

    idSelektovanogRadnogNaloga = idRadnogNaloga

    var myModal = new bootstrap.Modal(document.getElementById('updateModal'), {
        keyboard: false
    }) // selektujemo update modal iz DOM-a

    myModal.show()

    try {
        // fetchujemo podatke za vozilo na koje kliknemo upate
        const response = await fetch(`${BASE_URL}radni-nalozi/${idSelektovanogRadnogNaloga}`)

        if (!response.ok) { // provjeravamo da li nije upisan podatak u bazu
            throw new Error("Ne možemo da dobijemo podatke!") // ako nije bacamo grešku
        }

        const data = await response.json()

        // linije ispod popunjavaju input boxove u update modalu
        document.getElementById("vozacUpdate").value = data?.vozac_id
        document.getElementById("voziloUpdate").value = data?.vozilo_id
        document.getElementById("opisZadatka").value = data?.opis_zadatka
        document.getElementById("datum_i_vrijeme_izdavanjaUpdate").value = data?.datum_i_vrijeme_izdavanja
        document.getElementById("rok_zavrsavanjaUpdate").value = data?.rok_zavrsavanja
        document.getElementById("statusUpdate").value = data?.status
    } catch (err) {
        document.getElementById("greskaUpisaUpdate").innerHTML = err?.message
    }

}

const updateRadniNalog = async () => {
    // updateujemo postojeće vozilo

    // kreiramo veliki objekat koji šaljemo na server
    const radni_nalog = {
        // isti nazivi atributa kao na backendu
        vozac_id: document.getElementById("VozacUpdate").value,
        vozilo_id: document.getElementById("VoziloUpdate").value,
        opis_zadatka: document.getElementById("OpiszadatkaUpdate").value,
        datum_i_vrijeme_izdavanja: document.getElementById("DatumivrijemeizdavanjaUpdate").value,
        rok_zavrsavanja: document.getElementById("RokzavrsavanjaUpdate").value,
        status: document.getElementById("statusUpdate").value
    }

    try {
        for (let radni_nalogAtribut in radni_nalog) {
            // for petlja prolazi kroz svaki atribut objekta vozilo
            // if provjerava da li je polje prazno
            if (!radni_nalog[radni_nalogAtribut]) {
                throw new Error("Nisu popunjena sva polja!")
            }
        }
        // pokušavamo da pošaljemo podatke na server i izmjenimo u bazi pomoću fetcha
        const response = await fetch(`${BASE_URL}radni-nalozi/${idSelektovanogRadnogNaloga}`, {
            method: "PUT", // metoda put je za update podataka 
            body: JSON.stringify(radni_nalog), // u body ide objekat koji šaljemo apiju tj vozilo
            headers: {
                "Content-type": "application/json" // tip podatka
            }
        })

        if (!response.ok) { // provjeravamo da li nije izmjenjen podatak u bazu
            throw new Error("Podaci nisu imjenjeni u bazi!") // ako nije bacamo grešku
        }

        location.reload()
        
    } catch (err) { // hvatamo grešku
        document.getElementById("greskaUpisaUpdate").innerHTML = err?.message
    }
}

const clearInputFields = () => {
    // ova funkcija čisti input polja, odnosno briše dosadašnji input
    document.getElementById("vozac_id").value = ""
    document.getElementById("vozilo_id").value = ""
    document.getElementById("opis_zadatka").value = ""
    document.getElementById("datum_i_vrijeme_izdavanja").value = ""
    document.getElementById("rok_zavravanja").value = ""
    document.getElementById("status").value = ""
}

var myModalEl = document.getElementById('exampleModal') // selektujemo insert modal
myModalEl.addEventListener('hidden.bs.modal', function (event) {
    // na zatvaranje insert modala pokrećemo clear inputs funkciju koja čisti input polja
    clearInputFields()
    // kod ispod uklana i prikaz greške kod validacije
    document.getElementById("greskaUpisa").innerHTML = null
})

document.addEventListener('DOMContentLoaded', function() {


    // Funkcija za unos novog radnog naloga
    window.insertRadniNalog = function() {
        const voziloId = document.getElementById('vozilo_id').value;
        const vozacId = document.getElementById('vozac_id').value;
        const opisZadatka = document.getElementById('opis_zadatka').value;
        const datumIVrijemeIzdavanja = document.getElementById('datum_i_vrijeme_izdavanja').value;
        const rokZavrsavanja = document.getElementById('rok_zavrsavanja').value;
        const status = document.getElementById('status').value;

        if (!voziloId || !vozacId || !opisZadatka || !datumIVrijemeIzdavanja || !rokZavrsavanja || !status) {
            document.getElementById('greskaUpisa').textContent = "Sva polja moraju biti popunjena.";
            return;
        }

        const newRow = `
            <tr>
                <td>#</td>
                <td>${vozila.find(v => v.id == voziloId).naziv}</td>
                <td>${vozaci.find(v => v.id == vozacId).ime}</td>
                <td>${opisZadatka}</td>
                <td>${datumIVrijemeIzdavanja}</td>
                <td>${rokZavrsavanja}</td>
                <td>${status}</td>
                <td><button class="btn btn-warning" onclick="editRadniNalog(this)">Izmjeni</button></td>
                <td><button class="btn btn-danger" onclick="deleteRadniNalog(this)">Izbriši</button></td>
            </tr>
        `;

        document.getElementById('tableBody').insertAdjacentHTML('beforeend', newRow);
        document.getElementById('greskaUpisa').textContent = "";
        document.querySelector('#exampleModal .btn-close').click();
    };

    // Funkcija za ažuriranje radnog naloga
    window.updateVozilo = function() {
        // Implementiraj funkciju za ažuriranje radnog naloga
    };

    // Funkcija za uređivanje radnog naloga (popunjavanje update modala)
    window.editRadniNalog = function(button) {
        const row = button.closest('tr');
        const vozilo = row.children[1].textContent;
        const vozac = row.children[2].textContent;
        const opis = row.children[3].textContent;
        const datum = row.children[4].textContent;
        const rok = row.children[5].textContent;
        const status = row.children[6].textContent;

        document.getElementById('voziloUpdate').value = vozila.find(v => v.naziv == vozilo).id;
        document.getElementById('vozacUpdate').value = vozaci.find(v => v.ime == vozac).id;
        document.getElementById('opisZadatka').value = opis;
        document.getElementById('datum_i_vrijeme_izdavanjaUpdate').value = datum;
        document.getElementById('rok_zavrsavanjaUpdate').value = rok;
        document.getElementById('statusUpdate').value = status;

        document.getElementById('updateModal').dataset.rowIndex = row.rowIndex;
        new bootstrap.Modal(document.getElementById('updateModal')).show();
    };

    // Funkcija za brisanje radnog naloga
    window.deleteRadniNalog = function(button) {
        const row = button.closest('tr');
        row.parentNode.removeChild(row);
    };
});
document.addEventListener("DOMContentLoaded", function () {
    // Funkcija za popunjavanje select elementa sa statusima
    function popuniStatusSelect() {
        var statusi = ["Planirano", "U toku", "Završeno"];
        var statusSelects = document.querySelectorAll("#status, #statusUpdate");

        statusSelects.forEach(function (select) {
            select.innerHTML = ""; // Očisti postojeće opcije
            
            statusi.forEach(function (status) {
                var opcija = document.createElement("option");
                opcija.value = status.toLowerCase(); // Postavi vrednost opcije
                opcija.textContent = status; // Postavi tekst prikaza opcije
                select.appendChild(opcija);
            });
        });
    }

    popuniStatusSelect();
});

