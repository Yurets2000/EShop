export function getParameterByName(name) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export function buildUrl(path, queryParameters) {
    let result = path;
    if (!queryParameters || queryParameters.size === 0) return result;
    let i = 0;
    for (let [paramName, paramValue] of queryParameters) {
        if ((!!paramValue && paramValue !== '') || paramValue === 0) {
            if (i > 0) {
                result += '&';
            } else {
                result += '?';
            }
            result += `${paramName}=${encodeURIComponent(paramValue)}`;
            i++;
        }
    }
    return result;
}