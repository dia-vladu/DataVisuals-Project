let canvas, context, W, H;
let tari = [];
let v = [];
let val_pib, val_sv, val_pop;
let v_pibMax, v_pibMin, v_svMax, v_svMin, v_popMax, v_popMin;
let cercuri = [];
let data = [];
let obiecte = [];

let listOfColors = ['rgba(255, 0, 0, 0.7)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 0, 255, 0.7)', 'rgba(255, 255, 0, 0.7)',
    'rgba(128, 0, 128, 0.7)', 'rgba(64, 224, 208, 0.7)', 'rgba(255, 192, 203, 0.7)', 'rgba(255, 165, 0, 0.7)',
    'rgba(173, 216, 230, 0.7)', 'rgba(144, 238, 144, 0.7)', 'rgba(230, 230, 250, 0.7)', 'rgba(165, 42, 42, 0.7)',
    'rgba(128, 128, 128, 0.7)', 'rgba(139, 0, 0, 0.7)', 'rgba(0, 100, 0, 0.7)', 'rgba(0, 0, 139, 0.7)',
    'rgba(184, 134, 11, 0.7)', 'rgba(75, 0, 130, 0.7)', 'rgba(0, 206, 209, 0.7)', 'rgba(255, 20, 147, 0.7)',
    'rgba(255, 140, 0, 0.7)', 'rgba(72, 61, 139, 0.7)', 'rgba(0, 128, 0, 0.7)', 'rgba(153, 50, 204, 0.7)',
    'rgba(139, 35, 35, 0.7)', 'rgba(211, 211, 211, 0.7)', 'rgba(143, 58, 132, 0.7)'];

function desenare(selectedOption) {
    context.clearRect(0, 0, W, H);

    v = [];
    tari = [];

    for (let item of obiecte) {
        if (item.an == selectedOption) {
            v.push(item);
        }
    }
    //console.log(v.length);
    //console.log(v);

    let nume_tari = [];
    for (let i = 0; i < v.length / 3; i++) {
        nume_tari.push(v[i].tara);
    }
    //console.log(nume_tari.length);
    //console.log(nume_tari);

    for (let i = 0; i < v.length / 3; i++) {
        val_sv = v[i].valoare;
        val_pop = v[i + 27].valoare;
        val_pib = v[i + (27 * 2)].valoare;

        let tara = {
            "tara": v[i].tara,
            "an": selectedOption,
            "val_pib": val_pib,
            "val_sv": val_sv,
            "val_pop": val_pop
        };
        tari.push(tara);
    }

    //console.log(tari.length);
    //console.log(tari);

    v_pibMax = Math.max(...tari.filter(val => val.val_pib != null).map(val => val.val_pib));
    v_pibMin = Math.min(...tari.filter(val => val.val_pib != null).map(val => val.val_pib));
    v_svMax = Math.max(...tari.filter(val => val.val_sv != null).map(val => val.val_sv));
    v_svMin = Math.min(...tari.filter(val => val.val_sv != null).map(val => val.val_sv));
    v_popMax = Math.max(...tari.filter(val => val.val_pop != null).map(val => val.val_pop));
    v_popMin = Math.min(...tari.filter(val => val.val_pop != null).map(val => val.val_pop));

    desenareAxe();
    desenare_an(selectedOption);

    tari.sort(function (a, b) { return b.val_pop - a.val_pop });

    for (let i of tari) {
        context.beginPath();

        context.fillStyle = listOfColors[tari.indexOf(i)];

        let raza = 2 + ((i.val_pop - v_popMin) / 1000000) * 0.45;
        let xi, yi;
        if (i.val_sv == null) {
            xi = 50 + ((W - 75) / 5) + ((W - 75) - ((W - 75) / 5)) / (v_pibMax - v_pibMin) * (i.val_pib - v_pibMin);
            yi = H - 30;
        }
        if (i.val_pib == null) {
            xi = 50;
            yi = H - 30 - ((H - 60) / 5) - ((H - 60 - ((H - 60) / 5)) / (v_svMax - v_svMin) * (i.val_sv - v_svMin));
        } else {
            xi = 50 + ((W - 75) / 5) + ((W - 75) - ((W - 75) / 5)) / (v_pibMax - v_pibMin) * (i.val_pib - v_pibMin);
            yi = H - 30 - ((H - 60) / 5) - ((H - 60 - ((H - 60) / 5)) / (v_svMax - v_svMin) * (i.val_sv - v_svMin));
        }
        context.arc(xi, yi, raza, 0, Math.PI * 2);

        context.closePath();
        context.fill();

        let cerc = {
            "tara": i.tara,
            "val_pib": i.val_pib,
            "val_sv": i.val_sv,
            "val_pop": i.val_pop,
            "xi": xi,
            "yi": yi,
            "r": raza
        };
        cercuri.push(cerc);
    }
}

function desenare_an(selectedOption) {
    context.fillStyle = 'rgb(144, 146, 164, 0.3)';
    context.font = "bold 50px Arial";
    context.fillText(selectedOption, W - 120, 50);
}

function desenareAxe() {

    context.beginPath();
    context.strokeStyle = 'white';
    context.moveTo(50, 30);
    context.lineTo(50, H - 30);
    context.stroke();

    context.moveTo(50, H - 30);
    context.lineTo(W - 25, H - 30);
    context.stroke();

    context.font = "normal 10px Arial";
    context.fillStyle = 'white';
    context.fillText("0", 30, H - 20);

    for (var i = 1; i <= 5; i++) {
        context.strokeStyle = 'rgb(144, 146, 164, 0.3)';
        context.moveTo(50 + (W - 25 - 50) / 5 * i, H - 30);
        context.lineTo(50 + (W - 25 - 50) / 5 * i, 30);

        context.moveTo(50, (H - 30) - (H - 30 - 30) / 5 * i);
        context.lineTo(W - 25, (H - 30) - (H - 30 - 30) / 5 * i);
        context.stroke();

        context.fillStyle = 'white';
        context.fillText((Math.round(((v_pibMax - v_pibMin) / 5 * i) + v_pibMin)), 50 + (W - 25 - 50) / 5 * i - 20, H - 20);
        context.fillText((Math.round(((v_svMax - v_svMin) / 5 * i) + v_svMin)), 25, (H - 30) - (H - 30 - 30) / 5 * i);
    }
    context.closePath();
}

function showTooltip(cercuri) {
    desenare(selectedOption);
    for (let item of cercuri) {
        if (mx >= item.xi - item.r && mx <= item.xi + item.r && my >= item.yi - item.r && my <= item.yi + item.r) {
            let x, y;
            if (mx + 1 + 100 > W - 25) {
                x = mx - 1 - 100;
            } else {
                x = mx + 1;
            }
            if (my + 80 > H - 30) {
                y = my - 80;
            } else {
                y = my;
            }
            context.clearRect(x, y, 100, 80);
            context.fillStyle = "rgb(25, 28, 81, 0.7)";
            context.fillRect(x, y, 100, 80);

            context.fillStyle = 'white';
            context.font = "normal 10px Arial";
            context.fillText("tara: " + item.tara, x + 15, y + 20);
            context.fillText("pop: " + item.val_pop, x + 15, y + 35);
            context.fillText("sv: " + item.val_sv, x + 15, y + 50);
            context.fillText("pib: " + item.val_pib, x + 15, y + 65);
        }
    }
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

    canvas = document.querySelector('#canvas_graph');
    context = canvas.getContext('2d');
    W = canvas.width;
    H = canvas.height;
    let btn = document.getElementById('animatie');
    selector = document.getElementById('select');
    selectedOption = selector.options[selector.selectedIndex].text;

    //console.log(selectedOption, typeof selectedOption);
    desenare(selectedOption);

    selector.onchange = () => {
        selectedOption = selector.options[selector.selectedIndex].text;
        //console.log(selectedOption);
        //console.log(selectedOption, typeof selectedOption);
        desenare(selectedOption);
        //console.log("cercuri " + cercuri.length);
        //console.log(cercuri);
    }

    //console.log(selector);

    let timerId;
    btn.onclick = () => {
        var nr = 2006;
        var x = 0;
        var intervalID = setInterval(function () {
            desenare(nr++);

            if (++x === 15) {
                window.clearInterval(intervalID);
            }
        }, 1000);
    }

    canvas.addEventListener('mousemove', e => {
        mx = e.x - canvas.getBoundingClientRect().x;
        my = e.y - canvas.getBoundingClientRect().y;
        showTooltip(cercuri);
    });
}
document.addEventListener('DOMContentLoaded', aplicatie);