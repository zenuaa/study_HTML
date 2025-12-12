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
            from_stayDepoMedYes: { 4: 72, 6: 81, 8: 89, 10: 98, pr: 14 }, // Депо відстій з мед з виїздом на станцію //DONE
            from_stayDepoMedNoStNo: { 4: 44, 6: 53, 8: 61, 10: 70, pr: 14 }, // Депо відстій без мед без виїзду на станцію //DONE
            from_stayDepoMedNoStYes: { 4: 65, 6: 74, 8: 82, 10: 91, pr: 14 }, // Депо відстій без мед з виїздом на станцію //DONE


            from_go: { 4: 40, 6: 42, 8: 45, 10: 48 }, // На прохід DONE
            from_repairsDepoMedYes: { 4: 77, 6: 89, 8: 100, 10: 111, pr: 15 }, // Депо з ремонту з мед з виїздом на станцію //DONE
            from_repairsDepoMedNoStNo: { 4: 49, 6: 61, 8: 72, 10: 83, pr: 15 }, // Депо з ремонту  без мед без виїзду на станцію //DONE
            from_repairsDepoMedNoStYes: { 4: 70, 6: 82, 8: 93, 10: 104, pr: 15 }, // Депо з ремонту  без мед з виїздом на станцію //DONE
            zdacha: {
                to_staySt: { 4: 11, 6: 16, 8: 21, 10: 26, endAdd: 26 }, // На станції у відстій //DONE
                to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 26 },  //на станції на прохід  //DONE

                to_stayDepoMedNo: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 12, kp: 5 }, // У депо у відстій без мед коміссії без заїзду на станцію //DONE
                to_stayDepoMedYes: { 4: 15, 6: 20, 8: 25, 10: 30, endAdd: 15, kp: 20 }, // У депо у відстій з мед комоссією //DONE

                to_repairsDepoMedNo: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 12, kp: 5 }, //У депо у ремонт ТО без мед коміссії без заїзду на станцію //DONE
                to_repairsDepoMedYes: { 4: 22, 6: 31, 8: 39, 10: 48, endAdd: 15, kp: 20 }, //У депо у ремонт ТО з мед комоссією //DONE

                to_stayDepo21MedYes: { 4: 18, 6: 23, 8: 28, 10: 33, endAdd: 15, kp: 27 }, // у депо у відстій по 21 колії з мед//DONE
                to_stayDepo21MedNo: { 4: 18, 6: 23, 8: 28, 10: 33, endAdd: 8, kp: 27 }, // у депо у відстій по 21 колії без мед //DONE

                to_repairsDepo21MedYes: { 4: 25, 6: 34, 8: 42, 10: 51, endAdd: 15, kp: 27 },// у депо на ремонт по 21 колії з мед //DONE
                to_repairsDepo21MedNo: { 4: 25, 6: 34, 8: 42, 10: 51, endAdd: 8, kp: 27 },// у депо на ремонт по 21 колії без мед //DONE
            },
        },
        nizhin: {
            yavka: {
                from_stay31: { 4: 84, 6: 95, 8: 105, 10: 114, pr: 20 }, // ніжин-явка -на станції- з відстою 31-34 колія //DONE
                from_go345: { 4: 26, 6: 28, 8: 31, 10: 34, pr: 0 },// ніжин-явка -на станції- на прохід 345 колія //DONE
                from_go67: { 4: 27, 6: 29, 8: 32, 10: 35, pr: 0 },// ніжин-явка -на станції- на прохід 67 колія //DONE
            },
            zdacha: {
                to_stay31: { 4: 80, 6: 101, 8: 123, 10: 143, endAdd: 11 },//DONE
                to_go345: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 4 },//DONE
                to_go67: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 5 },//DONE
            },
        },
        konotop: {
            yavka: { 
                from_go: { 4: 36, 6: 38, 8: 41, 10: 44, pr: 0 }, // Явка на прохід //DONE
                from_stay812: { 4: 91, 6: 102, 8: 112, 10: 121, pr: 32 }, // явка -на станції- з відстою 8-12 колія 

            
            },
            zdacha: { 
                to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 22 }, // Здача на прохід //DONE
                to_stay812: { 4: 37, 6: 44, 8: 51, 10: 56, endAdd: 32}, // Здача на станції
        
        }, 
        }
    }
}

// -------- Блок 2: Розрахунок здачі/явки для попугая--------
const rules_parrot = {
    chernihiv: {
        yavka: {
            from_staySt: { 4: 0, 6: 64, 8: 72, 10: 0, pr: 0 }, // На станції після відстою
            from_stayDepoMedYes: { 4: 0, 6: 87, 8: 95, 10: 0, pr: 14 }, // Депо відстій з мед з виїздом на станцію 
            from_stayDepoMedNoStNo: { 4: 0, 6: 59, 8: 67, 10: 0, pr: 14 }, // Депо відстій без мед без виїзду на станцію 
            from_stayDepoMedNoStYes: { 4: 0, 6: 80, 8: 88, 10: 0, pr: 14 }, // Депо відстій без мед з виїздом на станцію 


            from_go: { 4: 0, 6: 38, 8: 41, 10: 0 }, // На прохід 
            from_repairsDepoMedYes: { 4: 0, 6: 95, 8: 106, 10: 0, pr: 15 }, // Депо з ремонту з мед з виїздом на станцію 
            from_repairsDepoMedNoStNo: { 4: 0, 6: 67, 8: 78, 10: 0, pr: 15 }, // Депо з ремонту  без мед без виїзду на станцію 
            from_repairsDepoMedNoStYes: { 4: 0, 6: 88, 8: 90, 10: 0, pr: 15 }, // Депо з ремонту  без мед з виїздом на станцію 
            zdacha: {
                to_staySt: { 4: 11, 6: 16, 8: 21, 10: 26, endAdd: 26 }, // На станції у відстій 
                to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 26 },  //на станції на прохід  

                to_stayDepoMedNo: { 4: 0, 6: 30, 8: 35, 10: 0, endAdd: 12, kp: 5 }, // У депо у відстій без мед коміссії без заїзду на станцію
                to_stayDepoMedYes: { 4: 0, 6: 30, 8: 35, 10: 0, endAdd: 15, kp: 20 }, // У депо у відстій з мед комоссією 

                to_repairsDepoMedNo: { 4: 0, 6: 41, 8: 49, 10: 0, endAdd: 12, kp: 5 }, //У депо у ремонт ТО без мед коміссії без заїзду на станцію
                to_repairsDepoMedYes: { 4: 0, 6: 41, 8: 49, 10: 0, endAdd: 15, kp: 20 }, //У депо у ремонт ТО з мед комоссією 

                to_stayDepo21MedYes: { 4: 0, 6: 33, 8: 38, 10: 0, endAdd: 15, kp: 27 }, // у депо у відстій по 21 колії з мед 
                to_stayDepo21MedNo: { 4: 0, 6: 26, 8: 31, 10: 0, endAdd: 8, kp: 27 }, // у депо у відстій по 21 колії без мед 

                to_repairsDepo21MedYes: { 4: 0, 6: 44, 8: 52, 10: 0, endAdd: 15, kp: 27 },// у депо на ремонт по 21 колії з мед 
                to_repairsDepo21MedNo: { 4: 0, 6: 37, 8: 45, 10: 0, endAdd: 8, kp: 27 },// у депо на ремонт по 21 колії без мед 
            },
        },
        nizhin: {
            yavka: {
                from_stay31: { 4: 0, 6: 93, 8: 101, 10: 0, pr: 20 }, // ніжин-явка -на станції- з відстою 31-34 колія 
                from_go345: { 4: 0, 6: 24, 8: 27, 10: 0, pr: 0 },// ніжин-явка -на станції- на прохід 345 колія 
                from_go67: { 4: 0, 6: 25, 8: 28, 10: 0, pr: 0 },// ніжин-явка -на станції- на прохід 67 колія 
            },
            zdacha: {
                to_stay31: { 4: 0, 6: 103, 8: 123, 10: 0, endAdd: 11 }, 
                to_go345: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 4 }, 
                to_go67: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 5 }, 
            },
        },
        konotop: {
            yavka: { 
                from_go: { 4: 0, 6: 34, 8: 37, 10: 0, pr: 0 }, // Явка на прохід 
                from_stay812: { 4: 0, 6: 100, 8: 108, 10: 0, pr: 32 }, // явка -на станції- з відстою 8-12 колія 

            
            },
            zdacha: { 
                to_go: { 4: 9, 6: 11, 8: 14, 10: 17, endAdd: 22 }, // Здача на прохід 
                to_stay812: { 4: 0, 6: 46, 8: 51, 10: 56, endAdd: 32}, // Здача на станції
        
        }, 
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
    // Чернігів → Здача → Депо (звичайне) → ОБИДВА мед варіанти
    if (medBlock) {
        medBlock.style.display = '';

        const medYes = document.querySelector('input[name="med"][value="yavka"]');
        const medNo  = document.querySelector('input[name="med"][value="zdacha"]');

        // показати обидва
        if (medYes) medYes.parentElement.style.display = '';
        if (medNo)  medNo.parentElement.style.display  = '';
    }

    showActions(['to_stay', 'to_repairsDepo']);
}
else if (operation === 'zdacha' && place === 'depo_21') {
    // Чернігів → Здача → Депо по 21 → ТІЛЬКИ "З мед комісією"
    if (medBlock) {
        medBlock.style.display = '';

        const medYes = document.querySelector('input[name="med"][value="yavka"]');
        const medNo  = document.querySelector('input[name="med"][value="zdacha"]');

        // ховаємо "Без мед комісії"
        if (medNo) {
            medNo.parentElement.style.display = 'none';
            if (medNo.checked) medNo.checked = false;
        }

        // показуємо "З мед комісією"
        if (medYes) {
            medYes.parentElement.style.display = '';
            medYes.checked = true;
        }
    }

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
        if (operation === 'yavka') showActions(['from_go','from_stay812']);
        else showActions(['to_go','to_stay812'])
        ;
    }

}











function showActions(list) {
    const actionRadios = document.querySelectorAll('input[name="action"]');
    let firstVisible = null;

    actionRadios.forEach(radio => {
        if (list.includes(radio.value)) {
            radio.parentElement.style.display = '';
            if (!firstVisible) firstVisible = radio;
        } else {
            radio.parentElement.style.display = 'none';
            radio.checked = false;
        }
    });

    // Встановлюємо checked для першого видимого, якщо ще нічого не вибрано
    if (firstVisible && !document.querySelector('input[name="action"]:checked')) {
        firstVisible.checked = true;
    }
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
// -------- Основна функція calculate (оновлена під твою логіку kp->zdacha->end) --------
// -------- Основна функція calculate (оновлена під твою логіку kp->zdacha->end) --------
function calculate() {
    clearLog(); // очищаємо лог перед новим підрахунком

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
    let kpMinutes = null; // Зберігаємо КП для логів, якщо він обчислений

    function formatTime(totalMinutes) {
        totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours + '.' + minutes.toString().padStart(2, '0');
    }

    if (operation === 'yavka') {
        // -------- Явка -------- (без змін)
        if (city === 'konotop') {

    // --- ЯВКА з відстою 8–12 колія ---
    if (place === 'from_stay' && action === 'from_stay812') {
        const ruleObj = rules.chernihiv.konotop.yavka.from_stay812;
        const offset = ruleObj[wagons];
        const pr = ruleObj.pr || 0;

        if (typeof offset === 'number') {
            yavkaMinutes = timeMinutes - offset;
            prMinutes = yavkaMinutes + pr; // приймання показуємо
        }

    // --- ЯВКА звичайна (як було раніше) ---
    } else {
        const result = calculateKonotop(timeMinutes, wagons);
        yavkaMinutes = result.yavkaMinutes;
        prMinutes = result.prMinutes;
    }
}
 else if (city === 'nizhin') {
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

        // Для явки КП не показуємо
        document.getElementById("result_kp").innerText = "";

    } else if (operation === 'zdacha') {
        // -------- Здача --------
        if (city === 'chernihiv') {
            // Визначаємо конкретне правило
            if (place === 'from_stay' && action === 'to_stay') zdachaRule = rules.chernihiv.yavka.zdacha.to_staySt;
            else if (place === 'from_stay' && action === 'to_go') zdachaRule = rules.chernihiv.yavka.zdacha.to_go;
            else if (place === 'from_depo' && action === 'to_stay' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepoMedYes;
            else if (place === 'from_depo' && action === 'to_stay' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepoMedNo;
            else if (place === 'from_depo' && action === 'to_repairsDepo' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepoMedYes;
            else if (place === 'from_depo' && action === 'to_repairsDepo' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepoMedNo;

            else if (place === 'depo_21' && action === 'to_stay' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepo21MedYes;
            else if (place === 'depo_21' && action === 'to_stay' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_stayDepo21MedNo;

            else if (place === 'depo_21' && action === 'to_repairsDepo' && med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepo21MedYes;
            else if (place === 'depo_21' && action === 'to_repairsDepo' && !med) zdachaRule = rules.chernihiv.yavka.zdacha.to_repairsDepo21MedNo;

            if (zdachaRule) {
                const offset = zdachaRule[wagons];
                const endAdd = zdachaRule.endAdd || 0;
                const kpOffset = zdachaRule.kp; // може бути undefined

                if (typeof offset === 'number') {
                    // Якщо правило має kp (тобто це випадок "депо" або "депо по 21"), 
                    // тоді робимо: kp = time + kpOffset; zdacha = kp + offset; end = zdacha + endAdd
                    if (typeof kpOffset === 'number') {
                        const kpM = timeMinutes + kpOffset;
                        kpMinutes = kpM; // зберігаємо для логу
                        // показуємо КП
                        document.getElementById("result_kp").innerText = "КП: " + formatTime(kpMinutes);

                        // здача = КП + offset
                        zdachaMinutes = kpMinutes + offset;
                    } else {
                        // випадок без kp (наприклад на станції) — як раніше: zdacha = time + offset
                        document.getElementById("result_kp").innerText = "";
                        zdachaMinutes = timeMinutes + offset;
                    }

                    // кінець роботи = здача + endAdd
                    endWorkMinutes = zdachaMinutes + endAdd;
                } else {
                    // якщо offset не число — очищаємо kp
                    document.getElementById("result_kp").innerText = "";
                }
            } else {
                // немає правила — очищаємо kp
                document.getElementById("result_kp").innerText = "";
            }

       } else if (city === 'konotop') {

    // --- ЗДАЧА у відстій 8–12 колія ---
    if (place === 'from_stay' && action === 'to_stay812') {

        const ruleObj = rules.chernihiv.konotop.zdacha.to_stay812;
        const offset = ruleObj[wagons];
        const endAdd = ruleObj.endAdd || 0;

        if (typeof offset === 'number') {
            zdachaMinutes = timeMinutes + offset;
            endWorkMinutes = zdachaMinutes + endAdd;
        }

        document.getElementById("result_kp").innerText = ""; // КП не показуємо

    // --- звичайний режим Конотопа ---
    } else {
        const result = calculateKonotopZdacha(timeMinutes, wagons);
        zdachaMinutes = result.zdachaTime;
        endWorkMinutes = result.endWorkTime;
        document.getElementById("result_kp").innerText = "";// КП не показуємо для Конотопа
    }
}
 else if (city === 'nizhin') {
            const result = calculateNizhinZdacha(timeMinutes, action, wagons);
            zdachaMinutes = result.zdachaMinutes;
            endWorkMinutes = result.endWorkMinutes;
            document.getElementById("result_kp").innerText = ""; // КП не показуємо для Ніжина
        }
    }

    // --- Вивід результатів ---
    document.getElementById("result_yavka").innerText = operation === 'yavka'
        ? (yavkaMinutes !== null ? "Явка: " + formatTime(yavkaMinutes) : "Явка: -")
        : "";
    document.getElementById("result_pr").innerText = operation === 'yavka'
        ? (prMinutes !== null ? "Приймання: " + formatTime(prMinutes) : "")
        : "";
    document.getElementById("result_zd").innerText = operation === 'zdacha'
        ? (zdachaMinutes !== null ? "Здача: " + formatTime(zdachaMinutes) : "")
        : "";
    document.getElementById("result_end").innerText = operation === 'zdacha'
        ? (endWorkMinutes !== null ? "Кінець роботи: " + formatTime(endWorkMinutes) : "")
        : "";

    // --- ДОБАВЛЯЄМО ЛОГИ (тільки те, що реально виводиться) ---
    // Всі часи логуються без позначки часу; формули будуються по реальних значеннях

    // Явка
    if (operation === 'yavka' && yavkaMinutes !== null) {
        const offset = timeMinutes - yavkaMinutes;
        addLog(`Явка = ${formatTime(timeMinutes)} - ${offset} &#9658; ${formatTime(yavkaMinutes)}`);
    }

    // Приймання (якщо є)
    if (operation === 'yavka' && prMinutes !== null) {
        if (yavkaMinutes !== null) {
            const prOffset = prMinutes - yavkaMinutes;
            addLog(`Приймання = ${formatTime(yavkaMinutes)} + ${prOffset} &#9658; ${formatTime(prMinutes)}`);
        } else {
            // якщо явки немає, прив'язуємо до вхідного часу
            const prOffset = prMinutes - timeMinutes;
            addLog(`Приймання = ${formatTime(timeMinutes)} + ${prOffset} &#9658; ${formatTime(prMinutes)}`);
        }
    }

    // КП (якщо показано)
    if (kpMinutes !== null) {
        addLog(`КП = ${formatTime(timeMinutes)} + ${kpMinutes - timeMinutes} &#9658; ${formatTime(kpMinutes)}`);
    }

    // Здача
    if (operation === 'zdacha' && zdachaMinutes !== null) {
        if (kpMinutes !== null) {
            const zdOffset = zdachaMinutes - kpMinutes;
            addLog(`Здача = ${formatTime(kpMinutes)} + ${zdOffset} &#9658; ${formatTime(zdachaMinutes)}`);
        } else {
            const zdOffset = zdachaMinutes - timeMinutes;
            addLog(`Здача = ${formatTime(timeMinutes)} + ${zdOffset} &#9658; ${formatTime(zdachaMinutes)}`);
        }
    }

    // Кінець роботи
    if (operation === 'zdacha' && endWorkMinutes !== null && zdachaMinutes !== null) {
        const endOffset = endWorkMinutes - zdachaMinutes;
        addLog(`Кінець роб. = ${formatTime(zdachaMinutes)} + ${endOffset} &#9658; ${formatTime(endWorkMinutes)}`);
    }
}



















// -------- Початковий стан при завантаженні сторінки --------
window.addEventListener('DOMContentLoaded', () => {
    // --- Початкові радіо ---
    const chernihivRadio = document.querySelector('input[name="city"][value="chernihiv"]');
    const yavkaRadio = document.querySelector('input[name="operation"][value="yavka"]');
    const fromStayRadio = document.querySelector('input[name="place"][value="from_stay"]');

    if (chernihivRadio) chernihivRadio.checked = true;
    if (yavkaRadio) yavkaRadio.checked = true;
    if (fromStayRadio) fromStayRadio.checked = true;

    // --- Показати блок iOS ---
    function isIos() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    if (isIos()) {
        const iosInstallBlock = document.getElementById("ios-install");
        if (iosInstallBlock) iosInstallBlock.style.display = "block";
    }

    // --- Оновити видимість радіо ---
    updateVisability();
});


//Функція для очищення логів перед новим розрахунком
function clearLog() {
    document.getElementById("logContent").innerHTML = "";
}
//Функція для додавання запису в лог
function addLog(text) {
    const log = document.getElementById("logContent");
    log.innerHTML += `<div>${text}</div>`;
}


// -------- PWA Логіка --------
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User choice:", outcome);
        deferredPrompt = null;
        installBtn.style.display = "none";
    }
});

// фіксувати момент, коли користувач підтвердив інсталяцію додатку:
// Reports → Engagement → Events → pwa_install_button_click
let deferredPromptt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPromptt = e;
});


document.getElementById('installBtn').addEventListener('click', async () => {
    if (typeof gtag === 'function') {
        gtag('event', 'pwa_install_button_click', {
            event_category: 'pwa',
            event_label: 'Install prompt shown'
        });
    }

    if (!deferredPromptt) return;
    deferredPromptt.prompt();

    const result = await deferredPromptt.userChoice;
    if (result.outcome === 'accepted') {
        gtag('event', 'pwa_installed', {
            event_category: 'pwa',
            event_label: 'User accepted installation'
        });
    } else {
        gtag('event', 'pwa_install_rejected', {
            event_category: 'pwa',
            event_label: 'User dismissed installation'
        });
    }
    deferredPromptt = null;
});



if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/study_HTML/service-worker.js').then(reg => {

        // Слухаємо новий SW
        reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            newSW.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                    // Показати банер оновлення
                    const banner = document.getElementById('updateBanner');
                    banner.style.display = 'block';

                    document.getElementById('reloadBtn').addEventListener('click', () => {
                        newSW.postMessage('skipWaiting'); // активуємо новий SW
                    });
                }
            });
        });
    });

    // Перезавантаження після skipWaiting
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}


// -------- Функція відтворення звуку і виклику розрахунку --------
function playAndCalculate() {
    // Виконуємо розрахунок
    calculate();

    // Перевіряємо, чи є хоч якийсь текст у блоці Info
    const infoBlock = document.getElementById("logContent").innerText.trim() +
                      document.getElementById("result_yavka").innerText.trim() +
                      document.getElementById("result_pr").innerText.trim() +
                      document.getElementById("result_zd").innerText.trim() +
                      document.getElementById("result_end").innerText.trim();

    if (infoBlock) {
        const audio = document.getElementById("sound");
        audio.currentTime = 0;
        audio.play().catch(e => console.log(e));
    }
}

// слухаємо повідомлення від SW для показу блоку офлайн
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const offlineBlock = document.querySelector("#offline p");
    if (!offlineBlock) return;

    if (event.data && typeof event.data.offline === "boolean") {
      offlineBlock.style.display = event.data.offline ? "block" : "none";
    }
  });
}

