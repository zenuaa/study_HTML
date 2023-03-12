'use strict'

const arr = ['Polina', 'Anna', 'Tanua', ];
const person = 'Daughter';

for (let i = 0; i < arr.length; i++) {
    console.log(person + '-\t' + arr[i]);
}

// for (let i = 1; i < 5; ++i) {
//     console.log(i + ' cycles');
//     for (let e = 0; e <= 5; e++) {
//         console.log(e);

//     }
// }

let ast = '';
const len = 15;

label: for (let i = 1; i < len; i++) {

    for (let j = 0; j < i; j++) {
        if (i % 2 != 1) {
            continue label;
        }
        ast += '*'

    }
    ast += '\n';
}
console.log(ast);