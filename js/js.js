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
        pryimannya: {
            brigade: { 4: 0, 6: 0, 8: 0 },  
            stay: { 4: 0, 6: 0, 8: 0 },  
            depo_cross: { 4: 0, 6: 0, 8: 0 },
            depo_cross_stay: { 4: 0, 6: 0, 8: 0 },
            depo_21: { 4: 0, 6: 0, 8: 0 },
            depo_21_stay: { 4: 0, 6: 0, 8: 0 }
        },
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
        pryimannya: {
            brigade: { 4: 0, 6: 0, 8: 0 },
            stay: { 4: 84, 6: 95, 8: 105 }
        },
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, endAdd: 4},
            stay: { 4: 80, 6: 101, 8: 123, endAdd: 11 }
        },
        kp: { brigade: 0, stay: 0 }
    },

    konotop: {
        pryimannya: {
            brigade: { 4: 34, 6: 36, 8: 39 },
            stay: { 4: 0, 6: 0, 8: 0 }
        },
        zdacha: {
            brigade: { 4: 9, 6: 11, 8: 14, endAdd: 20 },
            stay: { 4: 11, 6: 16, 8: 21, endAdd: 20 }
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
const stVidstii = document.getElementById('st_vidstii');

// -------- Оновлення видимості блоків --------
function updatePlaceVisibility() {
    // --- Глобальний reset ---
    // Станційні місця
    document.querySelector('input[value="brigade"]').parentElement.style.display = 'block';
    document.querySelector('input[value="stay"]').parentElement.style.display = 'block';

    // Депо
    depoCrossLabel.style.display = 'inline';
    depo21Label.style.display = 'inline';

    // Блок подальшої дії
    nextGroup.style.display = 'block';
    const city = document.querySelector('input[name="city"]:checked')?.value;
    const operation = document.querySelector('input[name="operation"]:checked')?.value;

    // Приймання в Чернігові → ховаємо і повідомляємо
    if (city === 'chernihiv' && operation === 'pryimannya') {
        placeGroup.style.display = 'none';
        nextGroup.style.display = 'none';
         
       
         document.getElementById('results').innerHTML = "<p>Цей функціонал ще не дороблено</p>";
        return;
    }
     if (city === 'chernihiv' && operation === 'pryimannya') {
        placeGroup.style.display = 'none';
        nextGroup.style.display = 'none';
       
         document.getElementById('results').innerHTML = "<p>Цей функціонал ще не дороблено</p>";
        return;
    }



    // Приймання в Ніжині → ховаємо блоки місце/дія і показуємо тільки результат
    // ---------------- НІЖИН ----------------
if (city === 'nizhin') {
    placeGroup.style.display = 'block';

    // Показуємо тільки станцію (бригаду/відстій)
    document.querySelector('input[value="brigade"]').parentElement.style.display = 'block';
    document.querySelector('input[value="stay"]').parentElement.style.display = 'block';

    // Ховаємо депо як у Конотопі
    depoCrossLabel.style.display = 'none';
    depo21Label.style.display = 'none';

    // Ховаємо наступну дію
    nextGroup.style.display = 'none';

    // Якщо вибрано депо → автоматично перемикаємо на "brigade"
    let place = document.querySelector('input[name="place"]:checked')?.value;
    if (place === 'depo_cross' || place === 'depo_21') {
        document.querySelector('input[value="brigade"]').checked = true;
    }

    // Якщо вибрано приймання → взагалі ховаємо group-и
    if (operation === 'pryimannya') {
        placeGroup.style.display = 'none';
        nextGroup.style.display = 'none';

        document.getElementById('results').innerHTML = `
            <div id="result_kp" class="res-line kp">КП: 0</div>
            <div id="result_zd" class="res-line zd">Явка:</div>
            <div id="result_end" class="res-line end">Приймання:</div>
        `;
        return;
    }

    return; // дуже важливо!
}

   if (city === 'konotop') {

    placeGroup.style.display = 'block';

    // Показати станційні варіанти
    document.querySelector('input[value="brigade"]').parentElement.style.display = 'block';
    document.querySelector('input[value="stay"]').parentElement.style.display = 'block';

    // ❌ Ховаємо "у відстій" (бо для Конотопа нема правил)
    stVidstii.style.display = 'none';

    // ❌ Ховаємо депо
    depoCrossLabel.style.display = 'none';
    depo21Label.style.display = 'none';

    // ❌ Ховаємо подальшу дію (в депо не їдуть)
    nextGroup.style.display = 'none';

    // Якщо зараз вибрано депо — перемикаємо на "brigade"
    let place = document.querySelector('input[name="place"]:checked')?.value;
    if (place === 'depo_cross' || place === 'depo_21') {
        document.querySelector('input[value="brigade"]').checked = true;
    }

    return; // важливо — не запускаємо логіку інших станцій
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
            let endAdd = rules.nizhin.zdacha[place]?.endAdd || 11;
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
// ---------------- КОНОТОП ----------------
else if (city === 'konotop') {
    if (operation === 'zdacha') {
        // КП = 0 на станції
        kp = rules.konotop.kp[place] || 0;
        zdTime = rules.konotop.zdacha[place][wagons] || 0;
        let endAdd = rules.konotop.zdacha[place].endAdd || 20;

        let zd = baseTime + zdTime;
        endTime = zd + endAdd;

        document.getElementById('result_kp').innerText = `КП: 0`;
        document.getElementById('result_zd').innerText = `Здача: ${formatTimeCalc(zd)}`;
        document.getElementById('result_end').innerText = `Кінець роботи: ${formatTimeCalc(endTime)}`;
    } 
    else if (operation === 'pryimannya') {
        // Приймання для Конотопа
        const pryimTime = rules.konotop.pryimannya[place][wagons] || 0;
        const yavka = baseTime - pryimTime;
        const pryimannya = yavka + 20; // додаємо час на приймання (як у Ніжині)

        document.getElementById('result_kp').innerText = `КП: 0`;
        document.getElementById('result_zd').innerText = `Явка: ${formatTimeCalc(yavka)}`;
        document.getElementById('result_end').innerText = `Приймання: ${formatTimeCalc(pryimannya)}`;
    }
}

}
// -------- Ініціалізація --------
updatePlaceVisibility();
calculate();
