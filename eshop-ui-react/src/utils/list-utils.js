export function sort(array, field) {
    if (!Array.isArray(array)) {
        return array;
    }
    array.sort((a, b) => {
        if (a[field] < b[field]) {
            return -1;
        } else if (a[field] > b[field]) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
}

export function containsAll(arr, filteringArr) {
    if (filteringArr.length === 0) return true;
    return filteringArr.every(v => arr.includes(v));
}

export function containsAny(arr, filteringArr) {
    if (filteringArr.length === 0) return true;
    return filteringArr.some(v => arr.includes(v));
}
