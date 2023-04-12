let svg_barChart, svg_lineChart;
let x, y;
let W_barChart, H_barChart, W_lineChart, H_lineChart;
let selectedOption_barChart, selectedOption_lineChart, selectedOption_tabel, selectedOption_bubbleChart;
let selectedIndicator_barChart, selectedIndicator_lineChart;
let selector_barChart, selector_lineChart, selector_tabel, selector_bubbleChart;
let obiecte = [];
let listaRects_bc = [], listaRects_lc = [];
let data = [];
let v;
let pointString;
let points = [];
let tari = [];
let medii = [];
let indicatori = ['PIB', 'SV', 'POP'];
let canvas, context, W_canvas, H_canvas;
let val_pib, val_sv, val_pop;
let v_pibMax, v_pibMin, v_svMax, v_svMin, v_popMax, v_popMin;
let cercuri = [];
let listOfColors = ['rgba(255, 0, 0, 0.7)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 0, 255, 0.7)', 'rgba(255, 255, 0, 0.7)',
    'rgba(128, 0, 128, 0.7)', 'rgba(64, 224, 208, 0.7)', 'rgba(255, 192, 203, 0.7)', 'rgba(255, 165, 0, 0.7)',
    'rgba(173, 216, 230, 0.7)', 'rgba(144, 238, 144, 0.7)', 'rgba(230, 230, 250, 0.7)', 'rgba(165, 42, 42, 0.7)',
    'rgba(128, 128, 128, 0.7)', 'rgba(139, 0, 0, 0.7)', 'rgba(0, 100, 0, 0.7)', 'rgba(0, 0, 139, 0.7)',
    'rgba(184, 134, 11, 0.7)', 'rgba(75, 0, 130, 0.7)', 'rgba(0, 206, 209, 0.7)', 'rgba(255, 20, 147, 0.7)',
    'rgba(255, 140, 0, 0.7)', 'rgba(72, 61, 139, 0.7)', 'rgba(0, 128, 0, 0.7)', 'rgba(153, 50, 204, 0.7)',
    'rgba(139, 35, 35, 0.7)', 'rgba(211, 211, 211, 0.7)', 'rgba(143, 58, 132, 0.7)'];

//Seteaza culoarea si opacitatea pentru desenarea dreptunghiurilor din bar chart in functiee de indicatorul selectat - (in svg)
function setColor_bc(selectedIndicator_barChart, rect) {
    if (selectedIndicator_barChart == "PIB") {
        rect.setAttribute('fill', '#fd7e14');
        rect.setAttribute('fill-opacity', 0.9);
    } else if (selectedIndicator_barChart == "SV") {
        rect.setAttribute('fill', '#e83e8c');
        rect.setAttribute('fill-opacity', 0.8);
    } else if (selectedIndicator_barChart == "POP") {
        rect.setAttribute('fill', '#20c997');
        rect.setAttribute('fill-opacity', 0.8);
    }
}

//Seteaza culoarea si opacitatea pentru desenarea liniilor din line chart in functiee de indicatorul selectat - (in svg)
function setColor_lc(selectedIndicator, line) {
    if (selectedIndicator == "PIB") {
        line.setAttribute('stroke', '#fd7e14');
    } else if (selectedIndicator == "SV") {
        line.setAttribute('stroke', '#e83e8c');
    } else if (selectedIndicator == "POP") {
        line.setAttribute('stroke', '#20c997');
    }
}

//Deseneaza axa OX (linia) - (in svg)
function desenareAxeOX(svg, W, H) {
    var axaOX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    axaOX.setAttribute('x1', 50);
    axaOX.setAttribute('y1', H - 30);
    axaOX.setAttribute('x2', W - 25);
    axaOX.setAttribute('y2', H - 30);
    axaOX.setAttribute('stroke', 'rgb(144, 146, 164)');
    axaOX.setAttribute('stroke-width', 2);
    svg.append(axaOX);
}

//Deseneaza Axa OY (linia) + liniile punctate orizontale (grilele de referinta ale chartului) + valorile de referinta de pe OY - (in svg)
function desenAxeOY_AxePunctate(v, svg, W, H) {
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
        liniePct.setAttribute('y1', (H - 30) - ((H - 60) / 5) * i);
        liniePct.setAttribute('x2', W - 25);
        liniePct.setAttribute('y2', (H - 30) - ((H - 60) / 5) * i);
        liniePct.setAttribute('stroke', '#6c757d');
        liniePct.setAttribute('stroke-dasharray', 4);
        liniePct.setAttribute('fill-opacity', 0.7);
        liniePct.setAttribute('stroke-width', 1);
        svg.append(liniePct);

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        let maxi = Math.max(...v.map(val => val.valoare));
        let mini = Math.min(...v.map(val => val.valoare));
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
        text.setAttribute('y', (H - 30) - ((H - 60) / 5) * i);
        text.setAttribute('font-size', 10);
        text.setAttribute('fill', 'rgb(144, 146, 164)');
        svg.append(text);
    }
}

//Deseneaza toate elementele bar chart-ului - (in svg)
function desenare_BarChart(selectedIndicator, selectedOption, svg, W, H) {
    svg.innerHTML = "";

    let v = [];
    for (let item of obiecte) {
        if (item.tara == selectedOption && item.indicator == selectedIndicator) {
            v.push(item);
        }
    }
    desenAxeOY_AxePunctate(v, svg_barChart, W_barChart, H_barChart);
    desenareAxeOX(svg_barChart, W_barChart, H_barChart);

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    if (selectedIndicator == "PIB") {
        text.textContent = 'mii';
    }
    else if (selectedIndicator == 'POP') {
        if (selectedOption == 'CY' || selectedOption == 'LU' || selectedOption == 'MT') {
            text.textContent = 'sute de mii';
        } else {
            text.textContent = 'milioane';
        }
    } else {
        text.textContent = 'procente';
    }
    text.setAttribute('x', 55);
    text.setAttribute('y', 20);
    text.setAttribute('fill', 'rgb(144, 146, 164)');
    text.setAttribute('fill-opacity', 0.7);
    svg.append(text);
    let title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.innerHTML = selectedOption + " - " + selectedIndicator;
    title.setAttribute('x', W - 110);
    title.setAttribute('y', 20);
    title.setAttribute('fill', 'rgb(144, 146, 164)');
    title.setAttribute('fill-opacity', 0.7);
    svg.append(title);

    let n = v.length;
    //console.log("Nr de elemente din lista: " + n);
    let w = (W - 75) / n;
    let f = (H - 60) / Math.max(...v.map(val => val.valoare));

    let aux;
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

        //console.log(aux);
        let yi = H - 30 - ((H - 60)) / (Math.ceil(maxi) - Math.floor(mini)) * (aux - Math.floor(mini));

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xi + 50);
        rect.setAttribute('y', yi);
        rect.setAttribute('width', wi);
        rect.setAttribute('height', H - 30 - yi);
        setColor_bc(selectedIndicator, rect);
        svg.append(rect);

        let objLista = {
            'xi': xi + 50,
            'yi': yi,
            'wi': wi,
            'hi': hi,
            'valoare': v[i].valoare,
            'an': v[i].an
        }
        listaRects_bc.push(objLista);
    }
}

//Populeaza lista de puncte prin care trece un polyline - (in svg)
function popularePoints(v, w, f, H) {
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
    }
    //console.log(points.length);

    pointString = points.map(point => `${point.xi},${point.yi}`).join(' ');
    //console.log(pointString);
}

//Deseneaza toate elementele line chart-ului - (in svg)
function desenare_lineChart(selectedIndicator, selectedOption, svg, W, H) {
    svg.innerHTML = "";

    let v = [];
    for (let item of obiecte) {
        if (item.tara == selectedOption && item.indicator == selectedIndicator) {
            v.push(item);
        }
    }
    desenAxeOY_AxePunctate(v, svg, W, H);
    desenareAxeOX(svg, W, H);

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    if (selectedIndicator == "PIB") {
        text.textContent = 'mii';
    }
    else if (selectedIndicator == 'POP') {
        if (selectedOption == 'CY' || selectedOption == 'LU' || selectedOption == 'MT') {
            text.textContent = 'sute de mii';
        } else {
            text.textContent = 'milioane';
        }
    } else {
        text.textContent = 'procente';
    }
    text.setAttribute('x', 55);
    text.setAttribute('y', 20);
    text.setAttribute('fill', 'rgb(144, 146, 164)');
    text.setAttribute('fill-opacity', 0.7);
    svg.append(text);
    let title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.innerHTML = selectedOption + " - " + selectedIndicator;
    title.setAttribute('x', W - 110);
    title.setAttribute('y', 20);
    title.setAttribute('fill', 'rgb(144, 146, 164)');
    title.setAttribute('fill-opacity', 0.7);
    svg.append(title);

    let n = v.length;
    //console.log("Nr de elemente din lista: " + n);
    let w = (W - 50) / n;
    let f = (H - 60) / Math.max(...v.map(val => val.valoare));

    popularePoints(v, w, f, H);

    var linie = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    //console.log(typeof pointString);
    linie.setAttribute('points', pointString);
    linie.setAttribute('fill', 'none');
    setColor_lc(selectedIndicator, linie);
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
        listaRects_lc.push(objLista);
    }
}

//Deseneaza valorile care se afiseaza in tooltip in functie de pozitia mouse-ului - (in svg)
function showData(tooltip, item, svg) {
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

//Deseneaza forma tooltip-ului (adica doar dreptunghiul) - (in svg)
function desenareTooltip(svg, mx, my, item, W, H) {
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
    tooltip.setAttribute('width', 125);
    tooltip.setAttribute('height', 50);
    tooltip.setAttribute('fill-opacity', 0.6);
    tooltip.setAttribute('fill', '#191c51');
    tooltip.setAttribute('rx', 10);
    svg.append(tooltip);

    showData(tooltip, item, svg);
}

//Desenare ajustata a tooltip-ului in functie de ce desenam barChart sau lineChart - (in svg)
function showTooltip(listaRects, svg, W, H, mx, my) {
    if (svg == svg_barChart) {
        desenare_BarChart(selectedIndicator_barChart, selectedOption_barChart, svg_barChart, W_barChart, H_barChart);
        for (let item of listaRects) {
            if (mx >= item.xi && mx <= item.xi + item.wi && my >= item.yi && my <= item.yi + item.hi) {
                desenareTooltip(svg, mx, my, item, W, H);
            }
        }
    } else if (svg == svg_lineChart) {
        desenare_lineChart(selectedIndicator_lineChart, selectedOption_lineChart, svg_lineChart, W_lineChart, H_lineChart);
        for (let item of listaRects) {
            if (mx >= item.xi - 10 && mx <= item.xi + 10 && my >= item.yi - 10 && my <= item.yi + 10) {
                desenareTooltip(svg, mx, my, item, W, H);
            }
        }
    }
}

//Afla media pentru un indicator pentru toate tarile afisate - (tabel)
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

//Coloreaza celula din tabel de la rosu la verde in fct de distanta fata de media tarilor pentru indicatorul respectiv - (tabel)
//Astfel: cea mai mica distanta e rosu pur, iar cea mai mare e verde pur
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

//Construire + Inserare date tabel - (tabel)
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
    title.innerHTML = "TABLE - " + selectedOption;
    coloreaza();
}

//Deseneaza anul curent in coltul din dreapta sus pentru bubbleChart - (in canvas)
function desenare_an(selectedOption, context, W) {
    context.fillStyle = 'rgb(144, 146, 164, 0.3)';
    context.font = "bold 50px Arial";
    context.fillText(selectedOption, W - 120, 50);
}

function desenareAxe(context, W, H) {

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

//Deseneaza toate elementele bubbleChart-ului - (in canvas)
function desenare_bubbleChart(selectedOption, context, W, H) {
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

    desenareAxe(context, W, H);
    desenare_an(selectedOption, context, W);

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

//Deseneaza tooltip-ul pentru bubbleChart - (in canvas)
function showTooltip_bubbleChart(cercuri, context, selectedOption, W, H, mx, my) {
    desenare_bubbleChart(selectedOption, context, W, H);
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

//Functia ~ Main -> Aici se apeleaza functiile principale
async function aplicatie() {
    //Extragem datele de pe Eurostat
    //Am construit un stringuri pentru filtre astfel:
    //Un string pentru lista de tari cerute si un string pentru ultimii 15 ani disponibili (am luat anii care nu aveau date lipsa, adica de la 2006 -> 2020) 
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

    svg_barChart = document.querySelector('#svg_bc');
    W_barChart = svg_barChart.getAttribute('width');
    H_barChart = svg_barChart.getAttribute('height');
    //console.log("SVG's width: " + W, "SVH's height: " + H);
    selector_barChart = document.getElementById('select_bc');

    //const buttons = document.querySelectorAll("input[type='radio']");
    const buttons_bc = document.querySelectorAll("input[name='optiune_bc']");
    //console.log(buttons_bc.length, buttons_bc);

    selectedOption_barChart = selector_barChart.options[selector_barChart.selectedIndex].text;
    selectedIndicator_barChart = document.querySelector("input[name='optiune_bc']:checked").value;
    //console.log(selectedIndicator, selectedOption);
    desenare_BarChart(selectedIndicator_barChart, selectedOption_barChart, svg_barChart, W_barChart, H_barChart);

    buttons_bc.forEach(button => {
        selector_barChart.onclick = () => {
            selectedOption_barChart = selector_barChart.options[selector_barChart.selectedIndex].text;
            //console.log(selectedOption, typeof selectedOption);
            desenare_BarChart(selectedIndicator_barChart, selectedOption_barChart, svg_barChart, W_barChart, H_barChart);
        }

        button.onclick = () => {
            if (button.checked) {
                selectedOption_barChart = selector_barChart.options[selector_barChart.selectedIndex].text;
                selectedIndicator_barChart = button.value;
                //console.log(selectedOption);
                desenare_BarChart(selectedIndicator_barChart, selectedOption_barChart, svg_barChart, W_barChart, H_barChart);
            }
        }
    });

    svg_barChart.addEventListener('mouseover', e => {
        mx = e.x - svg_barChart.getBoundingClientRect().x;
        my = e.y - svg_barChart.getBoundingClientRect().y;
        showTooltip(listaRects_bc, svg_barChart, W_barChart, H_barChart, mx, my);
    });

    //----------------------------LINE CHART----------------------------------------------------

    svg_lineChart = document.querySelector('#svg_lc');
    W_lineChart = svg_lineChart.getAttribute('width');
    H_lineChart = svg_lineChart.getAttribute('height');
    //console.log("SVG's width: " + W, "SVH's height: " + H);
    selector_lineChart = document.getElementById('select_lc');

    const buttons_lc = document.querySelectorAll("input[name='optiune_lc']");
    //console.log(buttons.length);

    selectedOption_lineChart = selector_lineChart.options[selector_lineChart.selectedIndex].text;
    selectedIndicator_lineChart = document.querySelector("input[name='optiune_lc']:checked").value;
    //console.log(selectedIndicator, selectedOption);
    desenare_lineChart(selectedIndicator_lineChart, selectedOption_lineChart, svg_lineChart, W_lineChart, H_lineChart);

    buttons_lc.forEach(button => {
        selector_lineChart.onclick = () => {
            selectedOption_lineChart = selector_lineChart.options[selector_lineChart.selectedIndex].text;
            //console.log(selectedOption, typeof selectedOption);
            desenare_lineChart(selectedIndicator_lineChart, selectedOption_lineChart, svg_lineChart, W_lineChart, H_lineChart);
        }

        button.onclick = () => {
            if (button.checked) {
                selectedOption_lineChart = selector_lineChart.options[selector_lineChart.selectedIndex].text;
                selectedIndicator_lineChart = button.value;
                //console.log(selectedOption);
                desenare_lineChart(selectedIndicator_lineChart, selectedOption_lineChart, svg_lineChart, W_lineChart, H_lineChart);
            }
        }
    });

    svg_lineChart.addEventListener('mouseover', e => {
        mx = e.x - svg_lineChart.getBoundingClientRect().x;
        my = e.y - svg_lineChart.getBoundingClientRect().y;
        showTooltip(listaRects_lc, svg_lineChart, W_lineChart, H_lineChart, mx, my);
    });

    //-------------------------------------TABLE--------------------------------------------

    selector_tabel = document.getElementById('select_tabel');
    selectedOption_tabel = selector_tabel.options[selector_tabel.selectedIndex].text;
    //console.log(selectedIndicator, selectedOption);
    afisare(selectedOption_tabel);

    //console.log(selectedOption, typeof selectedOption);

    selector_tabel.onchange = () => {
        selectedOption_tabel = selector_tabel.options[selector_tabel.selectedIndex].text;
        //console.log(selectedOption);
        //console.log(selectedOption, typeof selectedOption);
        afisare(selectedOption_tabel);
    }

    //--------------------------------BUBBLE CHART----------------------------------------------

    canvas = document.querySelector('#canvas_graph');
    context = canvas.getContext('2d');
    W_canvas = canvas.width;
    H_canvas = canvas.height;
    let btn = document.getElementById('animatie');
    selector_bubbleChart = document.getElementById('select_bubble');
    selectedOption_bubbleChart = selector_bubbleChart.options[selector_bubbleChart.selectedIndex].text;

    //console.log(selectedOption, typeof selectedOption);
    desenare_bubbleChart(selectedOption_bubbleChart, context, W_canvas, H_canvas);

    selector_bubbleChart.onchange = () => {
        selectedOption_bubbleChart = selector_bubbleChart.options[selector_bubbleChart.selectedIndex].text;
        //console.log(selectedOption);
        //console.log(selectedOption, typeof selectedOption);
        desenare_bubbleChart(selectedOption_bubbleChart, context, W_canvas, H_canvas);
        //console.log("cercuri " + cercuri.length);
        //console.log(cercuri);
    }

    //console.log(selector);

    btn.onclick = () => {
        var nr = 2006;
        var x = 0;
        var intervalID = setInterval(function () {
            desenare_bubbleChart(nr++, context, W_canvas, H_canvas);

            if (++x === 15) {
                window.clearInterval(intervalID);
            }
        }, 1000);
    }

    canvas.addEventListener('mousemove', e => {
        mx = e.x - canvas.getBoundingClientRect().x;
        my = e.y - canvas.getBoundingClientRect().y;
        showTooltip_bubbleChart(cercuri, context, selectedOption_bubbleChart, W_canvas, H_canvas, mx, my);
    });
}
document.addEventListener('DOMContentLoaded', aplicatie);