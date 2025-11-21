// -------- Валідація введення часу --------
function validateTimeInputCalc() {
    const input = document.getElementById("timeInputCalc").value.trim();
    const errorDiv = document.getElementById("timeInputCalcError");
    if (!input) {
        errorDiv.textContent = "Поле не може бути порожнім.";
        return false;
    }
    const norm = input.replace(/[:,\-]/g, '.');
    if (!/^\d{1,2}[.,:\-]\d{1,2}$/.test(input)) {
        errorDiv.textContent = "Невірний формат. Введіть у форматі год.хв (наприклад 5.45)";
        return false;
    }
    let [h, m] = norm.split('.').map(Number);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        errorDiv.textContent = "Години мають бути 0-23, хвилини 0-59.";
        return false;
    }
    errorDiv.textContent = "";
    return true;
}

function validateTimeInputSimple() {
    const input = document.getElementById("timeInputSimple").value.trim();
    const errorDiv = document.getElementById("timeInputSimpleError");
    if (!input) {
        errorDiv.textContent = "Поле не може бути порожнім.";
        return false;
    }
    const norm = input.replace(/[:,\-]/g, '.');
    if (!/^\d{1,2}[.,:\-]\d{1,2}$/.test(input)) {
        errorDiv.textContent = "Невірний формат. Введіть у форматі год.хв (наприклад 5.45)";
        return false;
    }
    let [h, m] = norm.split('.').map(Number);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
        errorDiv.textContent = "Години мають бути 0-23, хвилини 0-59.";
        return false;
    }
    errorDiv.textContent = "";
    return true;
}

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
        yavka: { /* твої дані */ },
        zdacha: { /* твої дані */ },
        kp: { brigade: 0, to_stay: 0, to_stayDepo: 20, to_repairsDepo: 20, to_stayDepo21: 27, to_repairsDepo21: 27 }
    },
    nizhin: {
        yavka: { /* твої дані */ },
        zdacha: { /* твої дані */ },
        kp: { to_stay31: 0, to_go345: 0, to_go67: 0 }
    },
    konotop: {
        yavka: { /* твої дані */ },
        zdacha: { /* твої дані */ },
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

// -------- Функція оновлення видимості радіо --------
function updateVisability() {
    const city = document.querySelector('input[name="city"]:checked')?.value;
    const operation = document.querySelector('input[name="operation"]:checked')?.value;
    const placeRadios = document.querySelectorAll('input[name="place"]');
    const place = document.querySelector('input[name="place"]:checked')?.value;
    const actionRadios = document.querySelectorAll('input[name="action"]');
    const medBlock = Array.from(document.querySelectorAll('.radio-group'))
        .find(group => group.textContent.includes('Мед:'));

    // Ховаємо всі дії
    actionRadios.forEach(radio => radio.parentElement.style.display = 'none');

    // Управління видимістю місць
    placeRadios.forEach(radio => {
        if (radio.value === 'depo_21') {
            radio.parentElement.style.display = (city === 'chernihiv' && operation === 'zdacha') ? '' : 'none';
        } else if (city === 'nizhin') {
            radio.parentElement.style.display = (radio.value === 'from_stay') ? '' : 'none';
        } else if (city === 'konotop') {
            radio.parentElement.style.display = (radio.value === 'from_stay') ? '' : 'none';
        } else {
            radio.parentElement.style.display = '';
        }
    });

    // Управління блоком Мед і діями
    if (medBlock) medBlock.style.display = 'none';

    if (city === 'chernihiv') {
        if (operation === 'yavka' && place === 'from_stay') showActions(['from_stay', 'from_go']);
        else if (operation === 'yavka' && place === 'from_depo') { if (medBlock) medBlock.style.display = ''; showActions(['from_stay', 'from_repairsDepo']); }
        else if (operation === 'zdacha' && place === 'from_stay') showActions(['to_stay', 'to_go']);
        else if (operation === 'zdacha' && place === 'from_depo') { if (medBlock) medBlock.style.display = ''; showActions(['to_stay', 'to_repairsDepo']); }
        else if (operation === 'zdacha' && place === 'depo_21') { if (medBlock) medBlock.style.display = ''; showActions(['to_stay', 'to_repairsDepo']); }
    } else if (city === 'nizhin') {
        if (operation === 'yavka' && place === 'from_stay')
            showActions(['from_staySt31', 'from_go345', 'from_go67']);
        else if (operation === 'zdacha' && place === 'from_stay')
            showActions(['to_stay31', 'to_go345', 'to_go67', 'to_stay34', 'to_stay31_34']);
    }
    else if (city === 'konotop') {
        if (operation === 'yavka') showActions(['from_go']);
        else if (operation === 'zdacha') showActions(['to_go']);
    } else {
        // Для всіх інших комбінацій показати всі дії
        actionRadios.forEach(radio => radio.parentElement.style.display = '');
    }
}

function showActions(list) {
    const actionRadios = document.querySelectorAll('input[name="action"]');
    actionRadios.forEach(radio => {
        radio.parentElement.style.display = list.includes(radio.value) ? '' : 'none';
    });
}

// -------- Додаємо обробники --------
['city', 'operation', 'place', 'med'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(el => el.addEventListener('change', updateVisability));
});

document.querySelectorAll('input[name="wagons"]').forEach(el => {
    el.addEventListener('change', updateVisability);
});

// -------- Кнопка автоматичного вибору Ніжин --------
const btn = document.getElementById('selectNizhinBtn');
if (btn) {
    btn.addEventListener('click', () => {
        const cityRadio = document.querySelector('input[name="city"][value="nizhin"]');
        const operationRadio = document.querySelector('input[name="operation"][value="yavka"]');
        const placeRadio = document.querySelector('input[name="place"][value="from_stay"]');

        if (cityRadio) cityRadio.checked = true;
        if (operationRadio) operationRadio.checked = true;
        if (placeRadio) placeRadio.checked = true;

        updateVisability();
    });
}

// -------- Початковий стан при завантаженні сторінки --------
window.addEventListener('DOMContentLoaded', () => {
    const chernihivRadio = document.querySelector('input[name="city"][value="chernihiv"]');
    const yavkaRadio = document.querySelector('input[name="operation"][value="yavka"]');
    const fromStayRadio = document.querySelector('input[name="place"][value="from_stay"]');

    if (chernihivRadio) chernihivRadio.checked = true;
    if (yavkaRadio) yavkaRadio.checked = true;
    if (fromStayRadio) fromStayRadio.checked = true;

    updateVisability();
});
