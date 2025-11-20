

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
            brigade: { 4: 0, 6: 0, 8: 0 },
            stay: { 4: 0, 6: 0, 8: 0 },
            depo_cross: { 4: 0, 6: 0, 8: 0 },
            depo_cross_stay: { 4: 0, 6: 0, 8: 0 },
            depo_21: { 4: 0, 6: 0, 8: 0 },
            depo_21_stay: { 4: 0, 6: 0, 8: 0 }
        },
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 26 },
            stay: { 4: 11, 6: 16, 8: 21, endAdd: 26 },
            depo_cross: { 4: 22, 6: 31, 8: 39, endAdd: 15 },
            depo_cross_stay: { 4: 15, 6: 20, 8: 25, endAdd: 15 },
            depo_21: { 4: 25, 6: 34, 8: 43, endAdd: 15 },
            depo_21_stay: { 4: 18, 6: 23, 8: 28, endAdd: 15 }
        },
        kp: { brigade: 0, stay: 0, depo_cross: 20, depo_cross_stay: 20, depo_21: 27, depo_21_stay: 27 }
    },

    nizhin: {
        yavka: {
            brigade: { 4: 0, 6: 0, 8: 0 },
            stay: { 4: 84, 6: 95, 8: 105 }
        },
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, endAdd: 4 },
            stay: { 4: 80, 6: 101, 8: 123, endAdd: 11 }
        },
        kp: { brigade: 0, stay: 0 }
    },

    konotop: {
        yavka: {
            brigade: { 4: 34, 6: 36, 8: 39, 10: 42 },
            stay: { 4: 0, 6: 0, 8: 0, 10: 0 }
        },
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 20 },
            stay: { 4: 11, 6: 16, 8: 21, 10: 26, endAdd: 20 }
        },
        kp: { brigade: 0, stay: 0 }
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

