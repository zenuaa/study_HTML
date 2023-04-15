'use strict'
const verge = void 0;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// function caclVolume(x) {
//     if (Number.isFinite(x) && !isNaN(+ x) && x > 0) {
//         function calcSquare() {
//             return 6 * Math.pow(x, 2);
//         }
//         console.log(`Объем куба: ${x * x * x}, площадь всей поверхности: ${calcSquare()}`)
//     return;
//     }

//     throw new Error('При вычислении произошла ошибка');
// }

// caclVolume(-7);


const mob = {
    class: 'mage',
    whoami: function () {
    const str = this.name;
    return capitalizeFirstLetter(str);
    }
}

let rasta = Object.create(mob, {
    name: {
        value: 'rasta'
    },
    lvl: {
        value: 1
    },
    health: {
        value: 500
    },
    mana: {
        value: 600
    }
});

console.log(rasta.whoami());
