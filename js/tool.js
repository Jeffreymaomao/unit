export function createAndAppendDOM(parent, name, attributes = {}) {
    const parts = name.split(/(?=[#.])/);
    const tag = parts[0]||'div';
    const element = document.createElement(tag);

    parts.forEach(part => {
        if (part.startsWith('.')) {
            element.classList.add(part.slice(1));
        } else if (part.startsWith('#')) {
            element.id = part.slice(1);
        }
    });

    // class 
    if (attributes.class) {
        attributes.class.split(" ").forEach(className => element.classList.add(className));
        delete attributes.class; // delete class in attributes
    }
    // dataset
    if (attributes.dataset) {
        Object.keys(attributes.dataset).forEach(key => element.dataset[key] = attributes.dataset[key]);
        delete attributes.dataset; // delete dataset in attributes
    }
    // other attributes
    Object.keys(attributes).forEach(key => {
        element[key] = attributes[key];
        if (!element[key]) element.setAttribute(key, attributes[key]);
    });

    Object.keys(attributes).forEach(key => { element[key] = attributes[key] });

    if (parent) parent.appendChild(element);
    return element;
}

export function default_hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //  + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
    const n = chars.length;
    let result = '';
    while (hash > 0) {
        const shift = Math.floor(Math.random() * 1000);
        result = chars[(hash + shift) % n] + result;
        hash = Math.floor(hash / n * 10);
    }
    return result;
}

export function uuid_hash(str) {
    let d = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        d = (d << 5) - d + char;
        d |= 0; // Convert to 32-bit integer
    }
    d = Math.abs(d);
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}