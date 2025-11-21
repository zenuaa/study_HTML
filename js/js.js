

// -------- Блок : Операції з часом --------
function parseTimeSimple() {
    let t = document.getElementById("timeInputSimple").value.replace(/[:,\-]/g, '.').trim();
    if (!t.includes('.')) return null;
    let [h, m] = t.split('.').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
}

function formatTimeSimple(total) {
    total = ((total % 1440) + 1440) % 1440;
    let h = Math.floor(total / 60);
    let m = total % 60;
    return h + '.' + m.toString().padStart(2, '0');
}

function addTimeSimple() {
    let minutes = parseTimeSimple();
    if (minutes === null) { alert('Невірний формат'); return; }
    let add = parseInt(document.getElementById("minutesInputSimple").value);
    document.getElementById("resultSimple").innerText = formatTimeSimple(minutes + add);
}

function subtractTimeSimple() {
    let minutes = parseTimeSimple();
    if (minutes === null) { alert('Невірний формат'); return; }
    let sub = parseInt(document.getElementById("minutesInputSimple").value);
    document.getElementById("resultSimple").innerText = formatTimeSimple(minutes - sub);
}

// -------- Блок 2: Розрахунок здачі/явки --------
const rules = {
    chernihiv: {
        yavka: {
            from_staySt: { 4: 49, 6: 58, 8: 66, 10: 75 },       

            from_stayDepoMedYes: { 4: 71, 6: 80, 8: 88, 10: 97 },   // з коміссією з виїздом на станцію

            from_stayDepoMedNoStNo: { 4: 44, 6: 53, 8: 61, 10: 70 },    // без виїзду на станцію 
            from_stayDepoMedNoStYes: { 4: 69, 6: 78, 8: 86, 10: 95 },   // з виїздом на станцію

            from_go: { 4: 40, 6: 42, 8: 45, 10: 48 },
            from_repairsDepoMedYes: { 4: 77, 6: 89, 8: 100, 10: 101 },  // з коміссією з виїздом на станцію

            from_repairsDepoMedNoStNo: { 4: 49, 6: 61, 8: 72, 10: 83 },     // без виїзду на станцію 
            from_repairsDepoMedNoStYes: { 4: 74, 6: 86, 8: 97, 10: 108 },   // з виїздом на станцію
            
        },
        zdacha: {
            to_staySt: { 4: 11, 6: 16, 8: 21, 10: 26, endAdd: 26 },
            to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 26 },

            to_stayDepoMedNo: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 12 },       // без мед коміссії
            to_stayDepoMedYes: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 15 },      // з мед комоссією
            
            to_repairsDepoMedNo: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 15 },     // ТО без мед коміссії
            to_repairsDepoMedYes: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 12 },    // ТО з мед комоссією

            to_stayDepo21: { 4: 18, 6: 23, 8: 28, 10: 33, endAdd: 15 },
            to_repairsDepo21: { 4: 25, 6: 34, 8: 42, 10: 51, endAdd: 15 },
        },
        kp: { brigade: 0, to_stay: 0, to_stayDepo: 20, to_repairsDepo: 20, to_stayDepo21: 27, to_repairsDepo21: 27 }
    },

    nizhin: {
        yavka: {
            from_stay31: { 4: 84, 6: 95, 8: 105, 10: 116 },
            from_go345: { 4: 26, 6: 28, 8: 31, 10: 34 },
            from_go67: { 4: 27, 6: 29, 8: 32, 10: 35 },
            
        
        },
        zdacha: {
            to_stay31: { 4: 80, 6: 101, 8: 123, 10: 123, endAdd: 11 },
            to_go345: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 4 },
            to_go67: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 5 },
        },
        kp: { to_stay31: 0, to_go345: 0, to_go67:0,}
    },

    konotop: {
        yavka: {
            from_go: { 4: 34, 6: 36, 8: 39, 10: 42 },
        },
        zdacha: {
            to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 20 },
        },
        kp: { from_go: 0, to_go: 0 }
    }
};


// -------- Парсер і формат часу --------
function parseTimeCalc(input) {
    input = input.replace(/[:,\-]/g, '.').trim();
    if (!input.includes('.')) return null;
    let [h, m] = input.split('.').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
}

function formatTimeCalc(total) {
    total = ((total % 1440) + 1440) % 1440;
    let h = Math.floor(total / 60);
    let m = total % 60;
    return h + '.' + m.toString().padStart(2, '0');
}

