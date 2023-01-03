import {containsAny} from './list-utils';

export function containsAllKeysAnyValues(map, filteringMap) {
    const filteringMapKeys = Array.from(filteringMap.keys());
    if (filteringMapKeys.length === 0) return true;
    const mapKeys = Array.from(map.keys());
    if(!filteringMapKeys.every(v => mapKeys.includes(v))) return false;
    for (let [filteringKey, filteringValues] of filteringMap) {
        const mapValues = map.get(filteringKey);
        if (!containsAny(mapValues, filteringValues)) return false;
    }
    return true;
}
