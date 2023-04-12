let svg;
let x, y;
let W, H;
let selectedOption;
let selectedIndicator;
let selector;
let pointString;
let points = [];
let listaRects = [];
let data = [];
let obiecte =[];

function setColor(selectedIndicator, line) {
    if (selectedIndicator == "PIB") {
        line.setAttribute('stroke', '#fd7e14');
    } else if (selectedIndicator == "SV") {
        line.setAttribute('stroke', '#e83e8c');
    } else if (selectedIndicator == "POP") {
        line.setAttribute('stroke', '#20c997');
    }
}

function desenareAxeOX() {
    var axaOX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axaOX.setAttribute('x1', 50);
    axaOX.setAttribute('y1', H - 30);
    axaOX.setAttribute('x2', W - 25);
    axaOX.setAttribute('y2', H - 30);
    axaOX.setAttribute('stroke', 'rgb(144, 146, 164)');
    axaOX.setAttribute('stroke-width', 2);
    svg.append(axaOX);
}

function desenAxeOY_AxePunctate(v) {

    var axaOY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axaOY.setAttribute('x1', 50);
    axaOY.setAttribute('y1', 30);
    axaOY.setAttribute('x2', 50);
    axaOY.setAttribute('y2', H - 30);
    axaOY.setAttribute('stroke', 'rgb(144, 146, 164)');
    axaOY.setAttribute('stroke-width', 2);
    svg.append(axaOY);

    for (let i = 0; i <= 5; i++) {
        var liniePct = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        liniePct.setAttribute('x1', 50);
        liniePct.setAttribute('y1', (H - 30) - ((H - 30 - 30) / 5) * i);
        liniePct.setAttribute('x2', W - 25);
        liniePct.setAttribute('y2', (H - 30) - ((H - 30 - 30) / 5) * i);
        liniePct.setAttribute('stroke', '#6c757d');
        liniePct.setAttribute('stroke-dasharray', 4);
        liniePct.setAttribute('fill-opacity', 0.7);
        liniePct.setAttribute('stroke-width', 1);
        svg.append(liniePct);

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        var maxi = Math.max(...v.map(val => val.valoare));
        var mini = Math.min(...v.map(val => val.valoare));
        if (maxi >= 1000000) {
            maxi /= 1000000;
            if (mini >= 1000000) {
                mini /= 1000000;
            }
        } else if (maxi >= 1000) {
            maxi /= 1000;
            if (mini >= 1000) {
                mini /= 1000;
            }
        }
        text.textContent = (Math.ceil(maxi) - Math.floor(mini)) / 5 * i + Math.floor(mini);
        text.setAttribute('x', 5);
        text.setAttribute('y', (H - 30) - ((H - 30 - 30) / 5) * i);
        text.setAttribute('font-size', 10);
        text.setAttribute('fill', 'rgb(144, 146, 164)');
        svg.append(text);
    }
}

function popularePoints(v, w, f) {
    points = [];
    for (let i = 0; i < v.length; i++) {
        let wi = 0.8 * w;
        let hi = v[i].valoare * f;
        let xi = i * w + 0.1 * w;
        var maxi = Math.max(...v.map(val => val.valoare));
        var mini = Math.min(...v.map(val => val.valoare));
        if (maxi >= 1000000) {
            maxi /= 1000000;
            if (mini >= 1000000) {
                mini /= 1000000;
            }
            if (v[i].valoare >= 1000000) {
                aux = v[i].valoare / 1000000;
            } else {
                aux = v[i].valoare;
            }
        } else if (maxi >= 1000) {
            maxi /= 1000;
            if (mini >= 1000) {
                mini /= 1000;
            }
            if (v[i].valoare >= 1000) {
                aux = v[i].valoare / 1000;
            } else {
                aux = v[i].valoare;
            }
        } else {
            aux = v[i].valoare;
        }
        let yi = H - 30 - ((H - 60)) / (Math.ceil(maxi) - Math.floor(mini)) * (aux - Math.floor(mini));
        let pct = {
            "xi": xi + 50,
            "yi": yi
        }
        points.push(pct);
        // console.log(points.length);
        // for (let i of points) {
        //     console.log(i.xi, i.yi);
        // }
    }
    //console.log(points.length);

    pointString = points.map(point => `${point.xi},${point.yi}`).join(' ');
    //console.log(pointString);
}

function desenare(selectedIndicator, selectedOption) {
    svg.innerHTML = "";

    let v = [];
    for (let item of obiecte) {
        if (item.tara == selectedOption && item.indicator == selectedIndicator) {
            v.push(item);
        }
    }
    desenAxeOY_AxePunctate(v);
    desenareAxeOX();

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    if(selectedIndicator == "PIB"){
        text.textContent = 'mii';
    }
    else if(selectedIndicator == 'POP'){
        if(selectedOption == 'CY' || selectedOption == 'LU' || selectedOption == 'MT'){
            text.textContent = 'sute de mii';
        }else{
            text.textContent = 'milioane';
        }
    }else{
        text.textContent = 'procente';
    }
    let title = document.querySelector('#tara_indicator');
    title.innerHTML = selectedOption + " - " + selectedIndicator;
    text.setAttribute('x', 55);
    text.setAttribute('y', 20);
    text.setAttribute('fill', 'rgb(144, 146, 164)');
    text.setAttribute('fill-opacity', 0.7);
    svg.append(text);

    let n = v.length;
    //console.log("Nr de elemente din lista: " + n);
    let w = (W - 50) / n;
    let f = (H - 60) / Math.max(...v.map(val => val.valoare));

    popularePoints(v, w, f);

    var linie = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    //console.log(typeof pointString);
    linie.setAttribute('points', pointString);
    linie.setAttribute('fill', 'none');
    setColor(selectedIndicator, linie);
    linie.setAttribute('stroke-width', 3);
    linie.setAttribute('stroke-linecap', 'round');
    svg.append(linie);

    for (let item of points) {

        let objLista = {
            'xi': item.xi,
            'yi': item.yi,
            'valoare': v[points.indexOf(item)].valoare,
            'an': v[points.indexOf(item)].an
        }
        listaRects.push(objLista);
    }
}

function showData(tooltip, item) {
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = 'an: ' + item.an;
    text.setAttribute('x', parseInt(tooltip.getAttribute('x')) + 15);
    text.setAttribute('y', parseInt(tooltip.getAttribute('y')) + 25);
    text.setAttribute('fill', 'white');
    svg.append(text);

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = 'val: ' + item.valoare;
    text.setAttribute('x', parseInt(tooltip.getAttribute('x')) + 15);
    text.setAttribute('y', parseInt(tooltip.getAttribute('y')) + 40);
    text.setAttribute('fill', 'white');
    svg.append(text);
}

function showTooltip(listaRects) {
    desenare(selectedIndicator, selectedOption);
    for (let item of listaRects) {
        if (mx >= item.xi - 10 && mx <= item.xi + 10 && my >= item.yi - 10 && my <= item.yi + 10) {
            let tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            if (mx + 1 + 120 > W - 25) {
                tooltip.setAttribute('x', mx - 1 - 120);
            } else {
                tooltip.setAttribute('x', mx + 1);
            }
            if (my + 50 > H - 30) {
                tooltip.setAttribute('y', my - 50);
            } else {
                tooltip.setAttribute('y', my);
            }
            tooltip.setAttribute('width', 120);
            tooltip.setAttribute('height', 50);
            tooltip.setAttribute('fill-opacity', 0.6);
            tooltip.setAttribute('fill', '#191c51');
            tooltip.setAttribute('rx', 10);
            svg.append(tooltip);

            showData(tooltip, item);
        }
    }
}

async function aplicatie() {
    // const response = await fetch("./media/eurostat.json", { method: "get" });
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

    svg = document.querySelector('svg');
    W = svg.getAttribute('width');
    H = svg.getAttribute('height');
    //console.log("SVG's width: " + W, "SVH's height: " + H);
    selector = document.getElementById('select');

    const buttons = document.querySelectorAll("input[type='radio']");
    //console.log(buttons.length);

    selectedOption = selector.options[selector.selectedIndex].text;
    selectedIndicator = document.querySelector("input[type='radio']:checked").value;
    //console.log(selectedIndicator, selectedOption);
    desenare(selectedIndicator, selectedOption);

    buttons.forEach(button => {
        selector.onclick = () => {
            selectedOption = selector.options[selector.selectedIndex].text;
            //console.log(selectedOption, typeof selectedOption);
            desenare(selectedIndicator, selectedOption);
        }

        button.onclick = () => {
            if (button.checked) {
                selectedOption = selector.options[selector.selectedIndex].text;
                selectedIndicator = button.value;

                //console.log(selectedOption);

                desenare(selectedIndicator, selectedOption);
            }
        }
    });

    svg.addEventListener('mouseover', e => {
        mx = e.x - svg.getBoundingClientRect().x;
        my = e.y - svg.getBoundingClientRect().y;
        showTooltip(listaRects);
    });
}
document.addEventListener('DOMContentLoaded', aplicatie);