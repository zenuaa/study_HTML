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
        yavka: {
            from_staySt: { 4: 49, 6: 58, 8: 66, 10: 75, pr: 0 }, // На станції DONE
            from_stayDepoMedYes: { 4: 71, 6: 80, 8: 88, 10: 97, pr: 14 }, // Депо відстій з мед з виїздом на станцію //DONE
            from_stayDepoMedNoStNo: { 4: 44, 6: 53, 8: 61, 10: 70, pr: 14 }, // Депо відстій без мед без виїзду на станцію //DONE
            from_stayDepoMedNoStYes: { 4: 69, 6: 78, 8: 86, 10: 95, pr: 14 }, // Депо відстій без мед з виїздом на станцію //DONE


            from_go: { 4: 40, 6: 42, 8: 45, 10: 48 }, // На прохід DONE
            from_repairsDepoMedYes: { 4: 77, 6: 89, 8: 100, 10: 101, pr: 15 }, // Депо з ремонту з мед з виїздом на станцію //DONE
            from_repairsDepoMedNoStNo: { 4: 49, 6: 61, 8: 72, 10: 83, pr: 15 }, // Депо з ремонту  без мед без виїзду на станцію //DONE
            from_repairsDepoMedNoStYes: { 4: 74, 6: 86, 8: 97, 10: 108, pr: 15 }, // Депо з ремонту  без мед з виїздом на станцію //DONE
            zdacha: {
                to_staySt: { 4: 11, 6: 16, 8: 21, 10: 26, endAdd: 26 }, // На станції у відстій //DONE
                to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 26 },  //на станції на прохід  //DONE
                to_stayDepoMedNo: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 12, kp: 20 }, // У депо у відстій без мед коміссії //DONE
                to_stayDepoMedYes: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 15, kp: 20 }, // У депо у відстій з мед комоссією //DONE
                to_repairsDepoMedNo: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 15, kp: 20 }, //У депо у ремонт ТО без мед коміссії //DONE
                to_repairsDepoMedYes: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 12, kp: 20 }, //У депо у ремонт ТО з мед комоссією //DONE
                to_stayDepo21: { 4: 18, 6: 23, 8: 28, 10: 33, endAdd: 15, kp: 27 }, // у депо у відстій по 21 колії //DONE
                to_repairsDepo21: { 4: 25, 6: 34, 8: 42, 10: 51, endAdd: 15, kp: 27 },// у депо на ремонт по 21 колії //DONE
            },
        },
        nizhin: {
            yavka: {
                from_stay31: { 4: 84, 6: 95, 8: 105, 10: 116, pr: 20 }, // ніжин-явка -на станції- з відстою 31-34 колія //DONE
                from_go345: { 4: 26, 6: 28, 8: 31, 10: 34, pr: 0 },// ніжин-явка -на станції- на прохід 345 колія //DONE
                from_go67: { 4: 27, 6: 29, 8: 32, 10: 35, pr: 0 },// ніжин-явка -на станції- на прохід 67 колія //DONE
            },
            zdacha: {
                to_stay31: { 4: 80, 6: 101, 8: 123, 10: 123, endAdd: 11 },//DONE
                to_go345: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 4 },//DONE
                to_go67: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 5 },//DONE
            },
        },
        konotop: {
            yavka: { from_go: { 4: 34, 6: 36, 8: 39, 10: 42, pr: 0 }, },// Явка на прохід //DONE
            zdacha: { to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 20 }, }, // Здача на прохід //DONE
        }
    }
}
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
    const place = document.querySelector('input[name="place"]:checked')?.value;
    const medChecked = document.querySelector('input[name="med"]:checked')?.value === 'yavka';

    const placeRadios = document.querySelectorAll('input[name="place"]');
    const actionRadios = document.querySelectorAll('input[name="action"]');

    const stationBlock = document.getElementById('station_yesNo');
    const yesRadio = stationBlock?.querySelector('input[value="station_yes"]');
    const noRadio = stationBlock?.querySelector('input[value="station_no"]');

    const medBlock = Array.from(document.querySelectorAll('.radio-group'))
        .find(g => g.textContent.includes('Мед:'));

    // --- Ховаємо всі дії ---
    actionRadios.forEach(radio => radio.parentElement.style.display = 'none');

    // --- Місця ---
    placeRadios.forEach(radio => {
        if (radio.value === 'depo_21') {
            radio.parentElement.style.display = (city === 'chernihiv' && operation === 'zdacha') ? '' : 'none';
        } else if (city === 'nizhin' || city === 'konotop') {
            radio.parentElement.style.display = (radio.value === 'from_stay') ? '' : 'none';
        } else {
            radio.parentElement.style.display = '';
        }
    });

    // --- Мед блок ---
    if (medBlock) medBlock.style.display = 'none';

    // --- Блок "Подальша дія" ---
    if (stationBlock) {
        stationBlock.style.display = 'none';
        yesRadio.parentElement.style.display = 'none';
        noRadio.parentElement.style.display = 'none';
    }

    // --- Показуємо тільки для Чернігів → Явка → Депо ---
    if (city === 'chernihiv' && operation === 'yavka' && place === 'from_depo') {
        stationBlock.style.display = '';
        yesRadio.parentElement.style.display = '';
        noRadio.parentElement.style.display = '';

        if (medChecked) {
            // Ховаємо "Без виїзду"
            noRadio.parentElement.style.display = 'none';
            yesRadio.checked = true;
        }
    }

    // --- Дії ---
    if (city === 'chernihiv') {
        if (operation === 'yavka' && place === 'from_stay')
            showActions(['from_stay', 'from_go']);
        else if (operation === 'yavka' && place === 'from_depo') {
            if (medBlock) medBlock.style.display = '';
            showActions(['from_stay', 'from_repairsDepo']);
        }
        else if (operation === 'zdacha' && place === 'from_stay')
            showActions(['to_stay', 'to_go']);
        else if (operation === 'zdacha' && place === 'from_depo') {
            if (medBlock) medBlock.style.display = '';
            showActions(['to_stay', 'to_repairsDepo']);
        }
        else if (operation === 'zdacha' && place === 'depo_21') {
            if (medBlock) medBlock.style.display = '';
            showActions(['to_stay', 'to_repairsDepo']);
        }
    }
    else if (city === 'nizhin') {
        if (operation === 'yavka')
            showActions(['from_staySt31', 'from_go345', 'from_go67']);
        else if (operation === 'zdacha')
            showActions(['to_stay31', 'to_go345', 'to_go67', 'to_stay34', 'to_stay31_34']);
    }
    else if (city === 'konotop') {
        if (operation === 'yavka') showActions(['from_go']);
        else showActions(['to_go']);
    }
}









function showActions(list) {
    const actionRadios = document.querySelectorAll('input[name="action"]');
    actionRadios.forEach(radio => {
        radio.parentElement.style.display = list.includes(radio.value) ? '' : 'none';
    });
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


/// -------- Функція розрахунку явки для Конотопу --------
function calculateKonotop(timeMinutes, wagons) {
    let yavkaMinutes = null;
    let prMinutes = null;

    // Правильний шлях у rules
    const konotopRules = rules.chernihiv.konotop?.yavka?.from_go;
    if (konotopRules) {
        const offset = konotopRules[wagons];
        if (typeof offset === 'number') {
            yavkaMinutes = timeMinutes - offset;
            prMinutes = null; // приймання для Конотопу не показуємо
        }
    }

    return { yavkaMinutes, prMinutes };
}
// -------- Функція розрахунку здачі для Конотопу --------
function calculateKonotopZdacha(timeMinutes, wagons) {
    const ruleObj = rules.chernihiv.konotop?.zdacha?.to_go;
    const offset = ruleObj[wagons];
    const endAdd = ruleObj.endAdd || 0;
    if (typeof offset === 'number') {
        const zdachaTime = timeMinutes + offset;     // сам час здачі
        const endWorkTime = zdachaTime + endAdd;    // кінець роботи
        return { zdachaTime, endWorkTime };
    }
    return { zdachaTime: null, endWorkTime: null };
}

// -------- Функція розрахунку здачі для Ніжина --------
function calculateNizhinZdacha(timeMinutes, action, wagons) {
    let zdachaMinutes = null;
    let endWorkMinutes = null;

    const rulesObj = rules.chernihiv.nizhin.zdacha;

    let ruleObj = null;
    if (action === 'to_stay31' || action === 'to_stay31_34' || action === 'to_stay34') ruleObj = rulesObj.to_stay31;
    else if (action === 'to_go345') ruleObj = rulesObj.to_go345;
    else if (action === 'to_go67') ruleObj = rulesObj.to_go67;

    if (ruleObj) {
        const offset = ruleObj[wagons];
        const endAdd = ruleObj.endAdd || 0;
        if (typeof offset === 'number') {
            zdachaMinutes = timeMinutes + offset;
            endWorkMinutes = zdachaMinutes + endAdd;
        }
    }

    return { zdachaMinutes, endWorkMinutes };
}

// -------- Функція розрахунку явки для Ніжина --------
function calculateNizhin(timeMinutes, action, wagons) {
    let yavkaMinutes = null;
    let prMinutes = null;

    const nizhinRules = rules.chernihiv.nizhin.yavka; // тепер правильний шлях

    if (action === 'from_staySt31') {
        const ruleObj = nizhinRules.from_stay31;
        const offset = ruleObj[wagons];
        if (typeof offset === 'number') {
            yavkaMinutes = timeMinutes - offset;
            prMinutes = yavkaMinutes + (ruleObj.pr || 0);
        }
    }
    else if (action === 'from_go345') {
        const ruleObj = nizhinRules.from_go345;
        const offset = ruleObj[wagons];
        if (typeof offset === 'number') {
            yavkaMinutes = timeMinutes - offset;
            prMinutes = null; // приймання не показуємо для прохідних колій
        }
    }
    else if (action === 'from_go67') {
        const ruleObj = nizhinRules.from_go67;
        const offset = ruleObj[wagons];
        if (typeof offset === 'number') {
            yavkaMinutes = timeMinutes - offset;
            prMinutes = null; // приймання не показуємо для прохідних колій
        }
    }

    return { yavkaMinutes, prMinutes };
}


// -------- Основна функція calculate (інтеграція Konotop) --------
function calculate() {
    const timeInput = document.getElementById("timeInputCalc").value.trim();
    if (!validateTimeInputCalc()) {
        alert("Введено некоректний час.");
        return;
    }

    const [h, m] = timeInput.replace(/[:,\-]/g, '.').split('.').map(Number);
    const timeMinutes = h * 60 + m;

    const city = document.querySelector('input[name="city"]:checked')?.value;
    const operation = document.querySelector('input[name="operation"]:checked')?.value;
    const place = document.querySelector('input[name="place"]:checked')?.value;
    const med = document.querySelector('input[name="med"]:checked')?.value === 'yavka';
    const action = document.querySelector('input[name="action"]:checked')?.value;
    const nextAction = document.querySelector('input[name="next_action"]:checked')?.value;
    const wagons = parseInt(document.querySelector('input[name="wagons"]:checked')?.value);

    let yavkaMinutes = null;
    let prMinutes = null;
    let zdachaMinutes = null;
    let endWorkMinutes = null;
    let zdachaRule = null;

    function formatTime(totalMinutes) {
        totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours + '.' + minutes.toString().padStart(2, '0');
    }

    if (operation === 'yavka') {
        // -------- Явка --------
        if (city === 'konotop') {
            const result = calculateKonotop(timeMinutes, wagons);
            yavkaMinutes = result.yavkaMinutes;
            prMinutes = result.prMinutes;
        } else if (city === 'nizhin') {
            const result = calculateNizhin(timeMinutes, action, wagons);
            yavkaMinutes = result.yavkaMinutes;
            prMinutes = result.prMinutes;
        } else if (city === 'chernihiv') {
            let key = '';
            if (place === 'from_stay' && action === 'from_stay') key = 'from_staySt';
            else if (place === 'from_stay' && action === 'from_go') key = 'from_go';
            else if (place === 'from_depo' && med && action === 'from_stay') key = 'from_stayDepoMedYes';
            else if (place === 'from_depo' && med && action === 'from_repairsDepo') key = 'from_repairsDepoMedYes';
            else if (place === 'from_depo' && !med) {
                key = nextAction === 'station_yes' ?
                    (action === 'from_stay' ? 'from_stayDepoMedNoStYes' : 'from_repairsDepoMedNoStYes') :
                    (action === 'from_stay' ? 'from_stayDepoMedNoStNo' : 'from_repairsDepoMedNoStNo');
            }

            if (key && rules.chernihiv.yavka[key]) {
                const ruleObj = rules.chernihiv.yavka[key];
                const offset = ruleObj[wagons];
                if (typeof offset === 'number') {
                    yavkaMinutes = timeMinutes - offset;
                    if ((place === 'from_depo' && med) || (!med && ruleObj.pr)) {
                        prMinutes = yavkaMinutes + (ruleObj.pr || 0);
                    }
                }
            }
        }

        // Для явки КП завжди порожнє
        document.getElementById("result_kp").innerText = "";

    } else if (operation === 'zdacha') {
        // -------- Здача --------
        if (city === 'chernihiv') {
            if (place === 'from_stay' && action === 'to_stay') zdachaRule = rules.chernihiv.yavka.zdacha.to_staySt;
            else if (place === 'from_stay' && action === 'to_go') zdachaRule = rules.chernihiv.yavka.zdacha.to_go;
            else if (place === 'from_depo' && action === 'to_stay' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepoMedYes;
            else if (place === 'from_depo' && action === 'to_stay' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepoMedNo;
            else if (place === 'from_depo' && action === 'to_repairsDepo' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepoMedYes;
            else if (place === 'from_depo' && action === 'to_repairsDepo' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepoMedNo;
            else if (place === 'depo_21' && action === 'to_stay') zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepo21;
            else if (place === 'depo_21' && action === 'to_repairsDepo') zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepo21;

            if (zdachaRule) {
                const offset = zdachaRule[wagons];
                const endAdd = zdachaRule.endAdd || 0;
                if (typeof offset === 'number') {
                    zdachaMinutes = timeMinutes + offset;
                    endWorkMinutes = zdachaMinutes + endAdd;

                    // КП тільки для Чернігів
                    if (zdachaRule.kp) {
                        document.getElementById("result_kp").innerText = "КП: " + formatTime(timeMinutes + zdachaRule.kp);
                    } else {
                        document.getElementById("result_kp").innerText = "";
                    }
                }
            }
        } else if (city === 'konotop') {
            const result = calculateKonotopZdacha(timeMinutes, wagons);
            zdachaMinutes = result.zdachaTime;
            endWorkMinutes = result.endWorkTime;
            document.getElementById("result_kp").innerText = ""; // КП не показуємо
        } else if (city === 'nizhin') {
            const result = calculateNizhinZdacha(timeMinutes, action, wagons);
            zdachaMinutes = result.zdachaMinutes;
            endWorkMinutes = result.endWorkMinutes;
            document.getElementById("result_kp").innerText = ""; // КП не показуємо
        }
    }

    // --- Вивід результатів ---
    document.getElementById("result_yavka").innerText = operation === 'yavka'
        ? (yavkaMinutes !== null ? "Явка: " + formatTime(yavkaMinutes) : "Явка: -")
        : "";
    document.getElementById("result_pr").innerText = operation === 'yavka'
        ? (prMinutes !== null ? "Пр: " + formatTime(prMinutes) : "")
        : "";
    document.getElementById("result_zd").innerText = operation === 'zdacha'
        ? (zdachaMinutes !== null ? "Здача: " + formatTime(zdachaMinutes) : "")
        : "";
    document.getElementById("result_end").innerText = operation === 'zdacha'
        ? (endWorkMinutes !== null ? "Кінець роботи: " + formatTime(endWorkMinutes) : "")
        : "";
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
