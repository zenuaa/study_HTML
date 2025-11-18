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
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, endAdd: 26 },
            stay: { 4: 11, 6: 16, 8: 21, endAdd: 26 },
            depo_cross: { 4: 22, 6: 31, 8: 39, endAdd: 15 },
            depo_cross_stay: { 4: 15, 6: 20, 8: 25, endAdd: 15 },
            depo_21: { 4: 25, 6: 34, 8: 43, endAdd: 15 },
            depo_21_stay: { 4: 18, 6: 23, 8: 28, endAdd: 15 }
        },
        kp: { brigade: 0, stay: 0, depo_cross: 20, depo_cross_stay: 20, depo_21: 27, depo_21_stay: 27 }
    },
    nizhin: {
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, endAdd: 11 },  // <-- Нова логіка як у Чернігова
            stay: { 4: 91, 6: 112, 8: 134, endAdd: 11 }    // Можна аналогічно для відстою, якщо потрібно
        },
        kp: { brigade: 0, stay: 0 }
    }
};

// -------- Селектори --------
const cityRadios = document.querySelectorAll('input[name="city"]');
const operationRadios = document.querySelectorAll('input[name="operation"]');
const placeGroup = document.getElementById('placeGroup');
const nextGroup = document.getElementById('nextGroup');
const depoCrossLabel = document.getElementById('depoCrossLabel');
const depo21Label = document.getElementById('depo21Label');
const pryimannyaLabel = document.getElementById('pryimannyaLabel');

// -------- Оновлення видимості блоків --------
function updatePlaceVisibility() {
    const city = document.querySelector('input[name="city"]:checked')?.value;
    const operation = document.querySelector('input[name="operation"]:checked')?.value;

    // Приймання в Чернігові → ховаємо і повідомляємо
    if (city === 'chernihiv' && operation === 'pryimannya') {
        placeGroup.style.display = 'none';
        nextGroup.style.display = 'none';
        document.getElementById('results').innerHTML = "<p>Цей функціонал ще не дороблено</p>";
        return;
    }

    // Приймання в Ніжині → ховаємо блоки місце/дія і next, показуємо тільки результат
    if (city === 'nizhin' && operation === 'pryimannya') {
        placeGroup.style.display = 'none';
        nextGroup.style.display = 'none';
        document.getElementById('results').innerHTML = `
            <div id="result_kp" class="res-line kp">КП: 0</div>
            <div id="result_zd" class="res-line zd">Приймання: </div>
            <div id="result_end" class="res-line end">З відстою</div>
        `;
        return;
    }

    // Для всіх інших випадків
    placeGroup.style.display = 'block';

    // За замовчуванням показуємо заїзди в депо
    depoCrossLabel.style.display = 'inline';
    depo21Label.style.display = 'inline';

    // Якщо Ніжин + здача → ховаємо заїзди в депо
    if (city === 'nizhin' && operation === 'zdacha') {
        depoCrossLabel.style.display = 'none';
        depo21Label.style.display = 'none';
    }

    // Отримуємо значення місця
    let placeRadio = document.querySelector('input[name="place"]:checked');
    if (!placeRadio) {
        document.querySelector('input[name="place"][value="brigade"]').checked = true;
        placeRadio = document.querySelector('input[name="place"]:checked');
    }
    const placeVal = placeRadio.value;

    // Логіка показу nextGroup
    if (city === 'chernihiv' && operation === 'zdacha') {
        if (placeVal === 'brigade' || placeVal === 'stay') {
            nextGroup.style.display = 'none'; // ховаємо для станцій
        } else if (placeVal === 'depo_cross' || placeVal === 'depo_21') {
            nextGroup.style.display = 'block'; // показуємо для депо
        }
    } else if (placeVal === 'depo_cross' || placeVal === 'depo_21') {
        nextGroup.style.display = 'block'; // для всіх інших випадків депо
    } else {
        nextGroup.style.display = 'none';
    }

    // Показуємо блоки результатів, якщо він пустий
    if (!document.getElementById('result_kp')) {
        document.getElementById('results').innerHTML = `
            <div id="result_kp" class="res-line kp"></div>
            <div id="result_zd" class="res-line zd"></div>
            <div id="result_end" class="res-line end"></div>
        `;
    }
}

// -------- Слухачі --------
const allRadios = document.querySelectorAll(
    'input[name="wagons"], input[name="city"], input[name="operation"], input[name="place"], input[name="next"]'
);
allRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        updatePlaceVisibility();
        calculate();
    });
});

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

// -------- Розрахунок --------
function calculate() {
    const city = document.querySelector('input[name="city"]:checked').value;
    const operation = document.querySelector('input[name="operation"]:checked').value;
    const wagons = parseInt(document.querySelector('input[name="wagons"]:checked').value);
    let place = document.querySelector('input[name="place"]:checked')?.value || 'brigade';
    let next = document.querySelector('input[name="next"]:checked')?.value || 'to';
    const inputTime = document.getElementById('timeInputCalc').value.trim();
    if (inputTime === "") return;

    const baseTime = parseTimeCalc(inputTime);
    if (baseTime === null) { alert('Неправильний формат часу'); return; }

    let kp = 0, zdTime = 0, endTime = 0;

    // ---------------- Чернігів ----------------
    if (city === 'chernihiv') {
        if (operation === 'zdacha') {
            // Станції: brigade / stay → КП = 0
            if (place === 'brigade' || place === 'stay') {
                kp = 0;
                zdTime = rules.chernihiv.zdacha[place][wagons] || 0;
                endTime = baseTime + zdTime + rules.chernihiv.zdacha[place].endAdd;
                document.getElementById('result_kp').innerText = `КП: 0`;
                document.getElementById('result_zd').innerText = `Здача: ${formatTimeCalc(baseTime + zdTime)}`;
                document.getElementById('result_end').innerText = `Кінець роботи: ${formatTimeCalc(endTime)}`;
            }
            // Депо
            else {
                if ((place === 'depo_cross' || place === 'depo_21') && next === 'stay') place = place + '_stay';
                kp = rules.chernihiv.kp[place] || 0;
                zdTime = rules.chernihiv.zdacha[place][wagons] || 0;
                endTime = baseTime + kp + zdTime + rules.chernihiv.zdacha[place].endAdd;
                document.getElementById('result_kp').innerText = `КП: ${formatTimeCalc(kp + baseTime)}`;
                document.getElementById('result_zd').innerText = `Здача: ${formatTimeCalc(baseTime + kp + zdTime)}`;
                document.getElementById('result_end').innerText = `Кінець роботи: ${formatTimeCalc(endTime)}`;
            }
        }
    }

    // ---------------- Ніжин ----------------
    else if (city === 'nizhin') {
        if (operation === 'zdacha') {
            kp = 0; // КП завжди 0
            zdTime = rules.nizhin.zdacha[place]?.[wagons] || 0;
            let endAdd = rules.nizhin.zdacha[place]?.endAdd || 20;
            endTime = baseTime + zdTime + endAdd;

            document.getElementById('result_kp').innerText = `КП: 0`;
            document.getElementById('result_zd').innerText = `Здача: ${formatTimeCalc(baseTime + zdTime)}`;
            document.getElementById('result_end').style.display = 'block';
            document.getElementById('result_end').innerText = `Кінець роботи: ${formatTimeCalc(endTime)}`;
        }
        else if (operation === 'pryimannya') {
            const pryimTime = { 4: 84, 6: 95, 8: 105 }[wagons] || 0;
            const yavka = baseTime - pryimTime;
            const pryimannya = yavka + 20;

            document.getElementById('result_kp').innerText = `КП: 0`;
            document.getElementById('result_zd').innerText = `Явка: ${formatTimeCalc(yavka)}`;
            document.getElementById('result_end').style.display = 'block';
            document.getElementById('result_end').innerText = `Приймання: ${formatTimeCalc(pryimannya)}`;

        }
    }
}
// -------- Ініціалізація --------
updatePlaceVisibility();
calculate();
