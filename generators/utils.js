function initialCapital(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

function includes(arr1, arr2) {
    return arr2.every(val => arr1.includes(val));
}

module.exports = {
    initialCapital,
    includes,
};
