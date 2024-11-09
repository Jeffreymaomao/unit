import { constants } from './phys-data.js';
import {
    extractFirstBracesContent,
    extractLatestBracesContent
} from './tool.js';


export function parseTexToNumber(tex) {
    tex = tex.trim()
    for (let [key, value] of Object.entries(constants)) {
        key = key.replace(/([{}\\])/g, '\\$1');
        tex = tex.replace(new RegExp(key, 'g'), `(${value})`);
    }
    tex = tex.replace(/\,/g, ' ');
    tex = tex.replace(/\\left/g, '');
    tex = tex.replace(/\\right/g, '');
    tex = tex.replace(/\\times/g, '*');
    tex = tex.replace(/\\cdot/g, '*');
    tex = tex.replace(/\\div/g, '/');
    // ---
    // a^b -> Math.pow(a, b)
    let max_iteration = 1000; // only accept this much `pow` in any input
    for(let i=0;i < max_iteration; i++){
        let match = tex.match(/\^/);
        if(!match) break;
        const powerIndex = match.index;
        const contentBefore = tex.slice(0, powerIndex);
        const base = extractLatestBracesContent(contentBefore, '()')
                    || extractLatestBracesContent(contentBefore, '{}')
                    || '';
        if(!base) break
        const contentAfter = tex.slice(powerIndex+1);
        const power = extractFirstBracesContent(contentAfter, '{}')
                    || extractFirstBracesContent(contentAfter, '()')
                    || (contentAfter.match(/^\d+/) || '')[0];
        if(!power) break
        tex = tex.slice(0, powerIndex-base.length-2) 
                + `(Math.pow(${base}, ${power}))`
                + tex.slice(powerIndex+power.length+3)
    }

    tex = tex.replace(/(\([^)]+\)|\d+)\^{([^}]+)}/g, '(Math.pow($1, $2))');
    // console.log(tex)
    // ---
    max_iteration = 1000; // only accept this much `sqrt` in any input
    for(let i=0;i < max_iteration; i++){
        let match = tex.match(/\\sqrt/);
        if(!match) break;
        const sqrtIndex = match.index;
        const content = extractFirstBracesContent(tex.slice(sqrtIndex), '{}') 
                        || extractFirstBracesContent(tex.slice(sqrtIndex), '()') 
                        || '';
        tex = tex.slice(0, sqrtIndex) 
                + `(Math.sqrt(${content}))` 
                + tex.slice(sqrtIndex+7+content.length)
    }
    // ---
    // n() -> n*()
    tex = tex.replace(/(\d|\))(\()/g, '$1*$2'); // 在數字或右括號與左括號之間加乘號
    // ()() -> ()*()
    tex = tex.replace(/(\))(\d|\()/g, '$1*$2'); // 在右括號後面接數字或左括號的情況加乘號
    tex = tex.replace(/([{}])/g, '')
    try {
        return eval(tex);
    } catch (error) {
        console.error('Error parsing the expression:', error);
        return null;
    }
}

export function number2LatexScientific(x){
    const baseAndOrder = Number.parseFloat(x).toExponential(6).split('e');
    return `${baseAndOrder[0]} \\times 10^{${Number.parseInt(baseAndOrder[1])}}`
}