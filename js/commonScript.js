'use strict'
const hiFun = ()=>{
    console.log('Hello my dear..');
    
}
let timerId,
    i = 0;
function say() {

    // console.log(i);
    i++;
    timerId = setTimeout(say, 1000);
}

say();
setTimeout(clearTimeout(timerId), 5000);
const wrap = document.querySelectorAll('.flex_container2');

function add() {
    console.dir(wrap.classList);
    const item = document.createElement('div');
    item.textContent = '<p>new element</p>'

    item.classList.add('item_flex2');
    // wrap.append(item);
    wrap[1].append(item); пуе
    return 'add item_flex2'
}

function rem() {
    const blockSets = wrap[1].children;
    blockSets[blockSets.length - 1].remove();

}


// function pow(a, b){
//     if(!isNaN(a) && !isNaN(b)){
//     let res = 1;
//     for(let i = 1; i<b; i++ ){
//         res = res * a;
//     }    
//     return res;
//     }
// }

// function pow(a, b) {
//     if (b === 0) {
//         return 1;
//     } else if (b < 0) {
//         return 1 / pow(a, -b);
//     } else {
//         return a * pow(a, b - 1);
//     }
// }

function factorial(x) {
    if (x <= 0) {
        return 1
    }
    else {
        if (!Number.isInteger(x)) {
            return 'error'
        }
        else {
            let res = x;
            for (x; x > 1; x--) {
                res *= x - 1;
            }
            return res;
        }
    }

}
console.log(factorial(1));
console.log(factorial(2));
console.log(factorial(3));
console.log(factorial(4));
console.log(factorial(5));