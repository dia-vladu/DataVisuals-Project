let tari = [];
let v = [];
let selector;
let selectedOption;
let medii = [];
let indicatori = ['PIB', 'SV', 'POP'];
let obiecte =[];
let data = [];

function aflaMedii(tari) {
    medii = [];
    for (let indicator of indicatori) {
        let media = 0;
        for (let tara of tari) {
            if (indicator == 'PIB') {
                media += tara.val_pib;
            }
            if (indicator == 'SV') {
                media += tara.val_sv;
            }
            if (indicator == 'POP') {
                media += tara.val_pop;
            }
        }
        media /= tari.length;
        medii.push(media);
    }
    //console.log(medii.length, medii);
}

function coloreaza() {
    aflaMedii(tari);
    let celule = [];
    let diferente = [];
    let diferente_pib = [];
    let diferente_sv = [];
    let diferente_pop = [];
    var tbody = document.getElementById("tbody");
    var cells = tbody.getElementsByTagName("td");
    for (let cell of cells) {
        celule.push(cell);
    }
    //console.log(celule.length);

    for (let cell of celule) {
        //console.log(celule.indexOf(cell));
        if (celule.indexOf(cell) % 4 != 0) {
            if (celule.indexOf(cell) % 4 == 1) {
                let val = {
                    "diferenta": Math.abs(medii[0] - cell.innerText),
                    "valoare": cell.innerText
                }
                diferente_pib.push(val);
            }
            if (celule.indexOf(cell) % 4 == 2) {
                let val = {
                    "diferenta": Math.abs(medii[1] - cell.innerText),
                    "valoare": cell.innerText
                }
                diferente_sv.push(val);
            }
            if (celule.indexOf(cell) % 4 == 3) {
                let val = {
                    "diferenta": Math.abs(medii[2] - cell.innerText),
                    "valoare": cell.innerText
                }
                diferente_pop.push(val);
            }
        }
    }

    diferente.push(diferente_pib.sort(function (a, b) { return a.diferenta - b.diferenta }),
        diferente_sv.sort(function (a, b) { return a.diferenta - b.diferenta }),
        diferente_pop.sort(function (a, b) { return a.diferenta - b.diferenta }));

    for (let cell of celule) {
        //console.log(celule.indexOf(cell));
        if (celule.indexOf(cell) % 4 != 0) {
            if (celule.indexOf(cell) % 4 == 1) {
                for (let i of diferente[0]) {
                    if (cell.innerText == i.valoare) {
                        var green = 0 + Math.round(255 / diferente[0].length) * diferente[0].indexOf(i);
                        var red = 255 - Math.round(255 / diferente[0].length) * diferente[0].indexOf(i);
                        //console.log(red, green);
                        cell.style.backgroundColor = `rgb(${red}, ${green}, 0, 0.5)`;
                    }
                }
            }
            if (celule.indexOf(cell) % 4 == 2) {
                for (let i of diferente[1]) {
                    if (cell.innerText == i.valoare) {
                        var green = 0 + Math.round(255 / diferente[1].length) * diferente[1].indexOf(i);
                        var red = 255 - Math.round(255 / diferente[1].length) * diferente[1].indexOf(i);
                        cell.style.backgroundColor = `rgb(${red}, ${green}, 0, 0.5)`;
                    }
                }
            }
            if (celule.indexOf(cell) % 4 == 3) {
                for (let i of diferente[2]) {
                    if (cell.innerText == i.valoare) {
                        var green = 0 + Math.round(255 / diferente[2].length) * diferente[2].indexOf(i);
                        var red = 255 - Math.round(255 / diferente[2].length) * diferente[2].indexOf(i);
                        cell.style.backgroundColor = `rgb(${red}, ${green}, 0, 0.5)`;
                    }
                }
            }
        }
        else {
            cell.style.textAlign = "right";
            cell.style.paddingRight = '25px';
        }
    }
}

function afisare(selectedOption) {

    v = [];
    tari = [];

    for (let item of obiecte) {
        if (item.an == selectedOption) {
            v.push(item);
        }
    }

    for (let i = 0; i < v.length / 3; i++) {
        val_sv = v[i].valoare;
        val_pop = v[i + 27].valoare;
        val_pib = v[i + (27 * 2)].valoare;

        if (val_pib == null) {
            val_pib = 0;
        }
        if (val_sv == null) {
            val_sv = 0;
        }
        if (val_pop == null) {
            val_pop = 0;
        }

        let tara = {
            "tara": v[i].tara,
            "an": selectedOption,
            "val_pib": val_pib,
            "val_sv": val_sv,
            "val_pop": val_pop
        };
        tari.push(tara);
    }

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ' ';

    for (var i = 0; i < tari.length; i++) {
        const rand = document.createElement('tr');
        const inreg = tari[i];
        tbody.append(rand);

        const adaugaCelula = text => {
            const celula = document.createElement('td');
            celula.innerText = text;
            rand.append(celula);
        }

        adaugaCelula(inreg.tara);
        adaugaCelula(inreg.val_pib);
        adaugaCelula(inreg.val_sv);
        adaugaCelula(inreg.val_pop);
    }
    let title = document.querySelector('#an');
    title.innerHTML = selectedOption;
    coloreaza();
}

async function aplicatie() {
    // const response = await fetch("./media/eurostat.json", { mode: 'no-cors', method: "get" });
    // console.log(response);

    // data = await response.json();
    let tari = ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"];
    let ani = ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
    let indicatori = ["demo_mlexpec?sex=T&age=Y1", "demo_pjan?sex=T&age=TOTAL", "sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB"];
    let stringTari = '';
    for (let tara of tari) {
        stringTari += '&geo=' + tara;
    }
    //console.log(stringTari);
    let stringAni = '';
    for (let an of ani) {
        stringAni += '&time=' + an;
    }
    //console.log(stringAni);
    for (let indicator of indicatori) {
        let data = [];
        const response = await fetch("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/" + indicator + stringAni + stringTari, { method: "get" });
        console.log(response);
        let date = await response.json();
        console.log(date.value);
        data = Object.values(date.value);
        console.log(data.length, data);
        for (let tara of tari) {
            let indi;
            if (indicator == 'demo_mlexpec?sex=T&age=Y1') {
                indi = 'SV';
            } else if (indicator == 'demo_pjan?sex=T&age=TOTAL') {
                indi = 'POP';
            } else if (indicator == 'sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB') {
                indi = 'PIB';
            }
            //console.log(data.length, data);
            for (let an of ani) {
                console.log(15 * tari.indexOf(tara) + (ani.indexOf(an)), data[15 * tari.indexOf(tara) + (ani.indexOf(an))]);
                let obj = {
                    "tara": tara,
                    "an": an,
                    "indicator": indi,
                    "valoare": data[15 * tari.indexOf(tara) + ani.indexOf(an)]
                }
                obiecte.push(obj);
            }
        }
    }
    console.log(obiecte.length);
    console.log(obiecte);

    selector = document.getElementById('select');
    selectedOption = selector.options[selector.selectedIndex].text;
    //console.log(selectedIndicator, selectedOption);
    afisare(selectedOption);

    //console.log(selectedOption, typeof selectedOption);

    selector.onchange = () => {
        selectedOption = selector.options[selector.selectedIndex].text;
        //console.log(selectedOption);
        //console.log(selectedOption, typeof selectedOption);
        afisare(selectedOption);
    }
}
document.addEventListener('DOMContentLoaded', aplicatie);