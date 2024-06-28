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

async function getVozaci() {
    // popunjavanje tabele

    // selektuje table body iz html-a
    let tableBody = document.getElementById("tableBody")
    tableBody.innerHTML = null
    // čisti tabelu prije popunjavanja 

    try {
        // kreiramo red u tabeli
        let row
        const response = await fetch(`${BASE_URL}vozaci`)
        const data = await response.json() // niz svih vozaca iz baze
        console.log(data)
        data.forEach((vozaci) => {
            row = `<tr>
        <td>${vozaci?.id}</td>
        <td>${vozaci?.ime}</td>
        <td>${vozaci?.prezime}</td>
        <td>${vozaci?.broj_vozacke_dozvole}</td>
        <td>${vozaci?.datum_isteka_dozvole}</td>
        <td>${vozaci?.kategorije_vozacke_dozvole}</td>
        <td>${vozaci?.kontakt_informacije}</td>
        <td>${vozaci?.ogranicenja_za_voznju}</td>
        <td>${vozaci?.status}</td>
        <td><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-pencil" 
                viewBox="0 0 16 16"
                onClick="openUpdateModal(${vozaci?.id})"
                >
                <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
            </svg></td>
        <td>
            <div class="action-button" onClick="deleteVozaci(${vozaci?.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
            </div>
        </td>
    </tr>`

            tableBody.innerHTML += row

        })

    } catch (err) {
        tableBody.innerHTML = `<tr>Desila se greška!${err}</tr>`
    }
}



async function deleteVozaci(vozaciId) {
    console.log(vozaciId)
    try {
        // pokušavamo da izbrišemo vozilo
        const response = await fetch(`${BASE_URL}vozaci/${vozaciId}`, {
            method: "DELETE"
        })

        getVozaci()

    } catch (err) {
        // ako se desi greška prilikom brisanja odradi ovo ispod
        console.log("greška je", err);
    }
}

getVozaci()

async function insertVozaca() {

    // kreiramo objekat vozilo koji šaljemo na api ili backend
    // atributi imaju isti naziv kao u pydantic šemi na backendu
    // vrijednosti kupimo iz input polja koje selektujemo preko id-a

    const vozaca = {
        // id: document.getElementById("id")?.value,
        ime: document.getElementById("ime")?.value,
        prezime: document.getElementById("prezime")?.value,
        broj_vozacke_dozvole: document.getElementById("broj_vozacke_dozvole")?.value,
        datum_isteka_dozvole: document.getElementById("datum_isteka_dozvole")?.value,
        kategorije_vozacke_dozvole: document.getElementById("kategorije_vozacke_dozvole")?.value,
        kontakt_informacije: document.getElementById("kontakt_informacije")?.value,
        ogranicenja_za_voznju: document.getElementById("ogranicenja_za_voznju")?.value,
        status: document.getElementById("status")?.value
    }

    console.log(vozaca)

    try {
        for (let vozacaAtribut in vozaca) {
            // for petlja prolazi kroz svaki atribut objekta vozilo
            // if provjerava da li je polje prazno
            if (!vozaca[vozacaAtribut]) {
                throw new Error("Nisu popunjena sva polja!")
            }
        }
     console.log(JSON.stringify(vozaca))
        // pokušavamo da pošaljemo podatke na server i upišemo u bazu pomoću fetcha
        const response = await fetch(`${BASE_URL}vozaci`, {
            method: "POST", // metoda post je za slanje podataka tj. upis
            body: JSON.stringify(vozaca), // u body ide objekat koji šaljemo apiju tj vozilo
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
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

let idSelektovanogVozaca = null

const openUpdateModal = async (idVozaca) => {
    // openUpdateModal funkcija otvara modal i popunjava ga sa podacima odabranog vozila

    idSelektovanogVozaca = idVozaca

    var myModal = new bootstrap.Modal(document.getElementById('updateModal'), {
        keyboard: false
    }) // selektujemo update modal iz DOM-a

    myModal.show()

    try {
        // fetchujemo podatke za vozilo na koje kliknemo upate
        const response = await fetch(`${BASE_URL}vozaci/${idVozaca}`)

        if (!response.ok) { // provjeravamo da li nije upisan podatak u bazu
            throw new Error("Ne možemo da dobijemo podatke!") // ako nije bacamo grešku
        }

        const data = await response.json()

        // linije ispod popunjavaju input boxove u update modalu
        document.getElementById("idUpdate").value = data?.id
        document.getElementById("imeUpdate").value = data?.ime
        document.getElementById("prezimeUpdate").value = data?.prezime
        document.getElementById("broj_vozacke_dozvoleUpdate").value = data?.broj_vozacke_dozvole
        document.getElementById("datum_isteka_dozvoleUpdate").value = data?.datum_isteka_dozvole
        document.getElementById("kategorije_vozacke_dozvoleUpdate").value = data?.kategorije_vozacke_dozvole
        document.getElementById("kontakt_informacijeUpdate").value = data?.kontakt_informacije
        document.getElementById("ogranicenja_za_voznjuUpdate").value = data?.ogranicenja_za_voznju
        document.getElementById("statusUpdate").value = data?.status
    } catch (err) {
        document.getElementById("greskaUpisaUpdate").innerHTML = err?.message
    }

}

const updateVozaca = async () => {
    // updateujemo postojeće vozilo

    // kreiramo veliki objekat koji šaljemo na server
    const vozaca = {
        id: document.getElementById("idUpdate")?.value,
        ime: document.getElementById("imeUpdate")?.value,
        prezime: document.getElementById("prezimeUpdate")?.value,
        broj_vozacke_dozvole: document.getElementById("broj_vozacke_dozvoleUpdate")?.value,
        datum_isteka_dozvole: document.getElementById("datum_isteka_dozvoleUpdate")?.value,
        kategorije_vozacke_dozvole: document.getElementById("kategorije_vozacke_dozvoleUpdate")?.value,
        kontakt_informacije: document.getElementById("kontakt_informacijeUpdate")?.value,
        ogranicenja_za_voznju: document.getElementById("ogranicenja_za_voznjuUpdate")?.value,
        status: document.getElementById("statusUpdate")?.value
    }



    try {
        for (let vozacaAtribut in vozaca) {
            // for petlja prolazi kroz svaki atribut objekta vozilo
            // if provjerava da li je polje prazno
            if (!vozaca[vozacaAtribut]) {
                throw new Error("Nisu popunjena sva polja!")
            }
        }

        // pokušavamo da pošaljemo podatke na server i izmjenimo u bazi pomoću fetcha
        const response = await fetch(`${BASE_URL}vozaci/${idSelektovanogVozaca}`, {
            method: "PUT", // metoda put je za update podataka 
            body: JSON.stringify(vozaca), // u body ide objekat koji šaljemo apiju tj vozilo
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
    document.getElementById("id").value =""
    document.getElementById("ime").value = ""
    document.getElementById("prezime").value =""
    document.getElementById("broj_vozacke_dozvole").value = ""
    document.getElementById("datum_isteka_dozvoleUpdate").value = ""
    document.getElementById("kategorije_vozacke_dozvole").value = ""
    document.getElementById("kontakt_informacije").value = ""
    document.getElementById("ogranicenja_za_voznju").value = ""
    document.getElementById("statusUpdate").value = ""
}

var myModalEl = document.getElementById('exampleModal') // selektujemo insert modal
myModalEl.addEventListener('hidden.bs.modal', function (event) {
    // na zatvaranje insert modala pokrećemo clear inputs funkciju koja čisti input polja
    clearInputFields()
    // kod ispod uklana i prikaz greške kod validacije
    document.getElementById("greskaUpisa").innerHTML = null
})

document.addEventListener("DOMContentLoaded", function () {
    // Funkcija za popunjavanje select elementa
    function popuniStatusSelect() {
        var statusSelect = document.getElementById("statusUpdate");
        var statusi = ["Aktivan", "Neaktivan", "Suspendovan"];
        
        statusi.forEach(function (status) {
            var opcija = document.createElement("option");
            opcija.value = status;
            opcija.textContent = status;
            statusSelect.appendChild(opcija);
        });
    }

    popuniStatusSelect();

    // Ako postoji više select elemenata sa istim ID-jem, koristićemo klasu za razlikovanje
    var updateSelects = document.querySelectorAll("#statusUpdate");
    updateSelects.forEach(function (select) {
        select.innerHTML = ""; // Očisti postojeće opcije
        var statusi = ["Aktivan", "Neaktivan", "Suspendovan"];
        
        statusi.forEach(function (status) {
            var opcija = document.createElement("option");
            opcija.value = status;
            opcija.textContent = status;
            select.appendChild(opcija);
        });
    });
});
