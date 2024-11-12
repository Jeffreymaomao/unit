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

export function extractFirstBracesContent(str, brace='{}') {
    // extract "a{b{}c}d" -> "b{}d"
    const braceLeft = brace[0];
    const braceRight = brace[1];
    let depth = 0;
    let firstIndex = -1;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === braceLeft) {
            depth++;
            if(firstIndex<0) firstIndex = i;
        } else if (str[i] === braceRight) {
            depth--;
            if(depth===0) return str.slice(firstIndex+1, i);
        }
    }
    return null;
}

export function extractLatestBracesContent(str, brace='{}') {
    // extract "a{b{}c}d" -> "b{}d"
    const braceLeft = brace[0];
    const braceRight = brace[1];
    let depth = 0;
    let firstIndex = -1;
    for (let i = str.length-1; i >= 0; i--) {
        if (str[i] === braceRight) {
            depth++;
            if(firstIndex<0) firstIndex = i;
        } else if (str[i] === braceLeft) {
            depth--;
            if(depth===0) return str.slice(i + 1, firstIndex);
        }
    }
    return null;
}

// 需要修改，如果{}xxx{}不能回傳第二格
export function extractManyConnectedBracesContent(str, len = 1) {
    let depth = 0;
    let currentLen = 0;
    let firstIndex = null;
    const contentArr = [];
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '{') {
            depth++;
            if (depth === 1) {
                firstIndex = i; // 記錄第一個 '{' 的索引
            }
        } else if (str[i] === '}') {
            depth--;
            if (depth === 0 && firstIndex !== null) {
                contentArr.push(str.slice(firstIndex + 1, i));
                currentLen++;
                firstIndex = null; // 重置索引以開始尋找下一個 '{'
                // 如果提取到所需的數量，則退出
                if (currentLen >= len) {
                    break;
                }
            }
        }
    }
    return contentArr;
}