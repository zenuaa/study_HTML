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

const dedLine = new Date('2024-02-17');
console.log(dedLine.getMonth());

const now = new Date();
console.log(now.toLocaleString());

let x = dedLine.getTime() -  now.getTime();
function convertMilliseconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;
  
    return {
      days: days,
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds
    };
  }
  console.log( convertMilliseconds(x));


