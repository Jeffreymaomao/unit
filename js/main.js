import { createAndAppendDOM } from './tool.js'

const constants = {
    '\\hat{\\hbar}'        : 1.054571817e-34,
    '\\hat{\\epsilon}_{0}' : 8.8541878188e-12,
    '\\hat{c}'             : 2.99792458e8,
    '\\hat{k}_{B}'         : 1.380649e-23,
    '\\hat{e}'             : 1.602176634e-19
};

const units = {
    meter    : {unitTex:  'm', dimLessValueTex: '\\hat{e}/(\\hat{c}\\hat{\\hbar})'                                  , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: '(c\\hbar)'                                  , },
    second   : {unitTex:  's', dimLessValueTex: '\\hat{e}/(\\hat{\\hbar})'                                          , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: '(\\hbar)'                                   , },
    kilogram : {unitTex: 'kg', dimLessValueTex: '\\hat{e}^{-1}(\\hat{c}^{2})'                                             , convertedUnitTex: 'eV'     , dimLessSymbTex: '(c^{-2})'                                   , },
    kelvin   : {unitTex:  'K', dimLessValueTex: '\\hat{e}^{-1}(\\hat{k}_{B})'                                             , convertedUnitTex: 'eV'     , dimLessSymbTex: '(k_{B}^{-1})'                               , },
    coulomb  : {unitTex:  'C', dimLessValueTex: '1/\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}\\hat{c}}'          , convertedUnitTex: '1'      , dimLessSymbTex: '\\sqrt{\\epsilon_{0}\\hbar c}'            , },
    ampere   : {unitTex:  'A', dimLessValueTex: '\\hat{e}^{-1}\\sqrt{\\hat{\\hbar}/(\\hat{\\epsilon}_{0}\\hat{c})}'           , convertedUnitTex: 'eV'     , dimLessSymbTex: '\\sqrt{\\epsilon_{0} c/\\hbar}'           , },
    Farad    : {unitTex:  'F', dimLessValueTex: '\\hat{e}/(\\hat{\\epsilon}_{0}\\hat{\\hbar}\\hat{c})'                , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: '(\\epsilon_{0}\\hbar c)'                  , },
    Tesla    : {unitTex:  'T', dimLessValueTex: '\\hat{e}^{-2}\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}^{3}\\hat{c}^{5}}'      , convertedUnitTex: 'eV^{2}' , dimLessSymbTex: '\\sqrt{1/\\epsilon_{0}\\hbar^{3} c^{5}}', },
    Gauss    : {unitTex:  'G', dimLessValueTex: '10^{-4}\\hat{e}^{-2}\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}^{3}\\hat{c}^{5}}', convertedUnitTex: 'eV^{2}' , dimLessSymbTex: '\\sqrt{1/\\epsilon_{0}\\hbar^{3} c^{5}}', },
}

function extractFirstBracesContent(str, brace='{}') {
    // extract "a{b{}c}d" -> "b{}d"
    const braceLeft = brace[0];
    const braceRight = brace[1];
    let depth = 0;
    let firstIndex = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === braceLeft) {
            depth++;
            if(!firstIndex) firstIndex = i;
        } else if (str[i] === braceRight) {
            depth--;
            if(depth===0) return str.slice(firstIndex+1, i);
        }
    }
    return null;
}

function extractLatestBracesContent(str, brace='{}') {
    // extract "a{b{}c}d" -> "b{}d"
    const braceLeft = brace[0];
    const braceRight = brace[1];
    let depth = 0;
    let firstIndex = false;
    for (let i = str.length-1; i >= 0; i--) {
        if (str[i] === braceRight) {
            depth++;
            if(!firstIndex) firstIndex = i;
        } else if (str[i] === braceLeft) {
            depth--;
            if(depth===0) return str.slice(i + 1, firstIndex);
        }
    }
    return null;
}

// 需要修改，如果{}xxx{}不能回傳第二格
function extractManyConnectedBracesContent(str, len = 1) {
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

function parseTexToNumber(tex) {
    tex = tex.trim()
    for (let [key, value] of Object.entries(constants)) {
        key = key.replace(/([{}\\])/g, '\\$1');
        tex = tex.replace(new RegExp(key, 'g'), `(${value})`);
    }
    tex = tex.replace(/\,/g, ' ');
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
        console.log(tex, eval(tex))
        return eval(tex);
    } catch (error) {
        console.error('Error parsing the expression:', error);
        return null;
    }
}

function number2LatexScientific(x){
    const baseAndOrder = Number.parseFloat(x).toExponential(6).split('e');
    return `${baseAndOrder[0]} \\times 10^{${Number.parseInt(baseAndOrder[1])}}`
}

class App {
    constructor(config={}) {
        this.dom = {};
        const locationSearcharams = new URLSearchParams(window.location.search);
        this.units = units;
        this.showNumericValue = true;
        this.initDom(config.dom || document.body);
    }

    initDom(domParrent) {
         this.dom.main = createAndAppendDOM(domParrent, 'main');
         this.dom.tableContainer = createAndAppendDOM(this.dom.main, 'div', {
            class: 'table-container'
         })
         this.dom.table = createAndAppendDOM(this.dom.tableContainer, 'table', {
            class: 'unit-table'
         });
         const thead = createAndAppendDOM(this.dom.table, 'thead');
         const thead_row = createAndAppendDOM(thead, 'tr'); 
         // ---
         createAndAppendDOM(thead_row, 'th', {
            class: 'quantities',
            innerHTML: katex.renderToString('\\text{quantity}', {throwOnError: false})
        }); 
         createAndAppendDOM(thead_row, 'th');
         createAndAppendDOM(thead_row, 'th');
         createAndAppendDOM(thead_row, 'th');
         createAndAppendDOM(thead_row, 'th');
         // ---

         const tbody = createAndAppendDOM(this.dom.table, 'tbody');
         Object.keys(this.units).forEach((unitName)=>{
            const unitConfig = this.units[unitName];
            const unitTex          = unitConfig.unitTex;
            const dimLessValueTex  = unitConfig.dimLessValueTex;
            const convertedUnitTex = unitConfig.convertedUnitTex;
            const dimLessSymbTex   = unitConfig.dimLessSymbTex;

            let dimLessValue = dimLessValueTex;
            if(this.showNumericValue){
                const dimLessValueNumber = parseTexToNumber(dimLessValueTex);
                dimLessValue = number2LatexScientific(dimLessValueNumber);
            }
            // ---
            const tbody_row = createAndAppendDOM(tbody, 'tr');
            const unitNameDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-name',
                innerHTML: katex.renderToString(`\\text{${unitName}}`, {throwOnError: false})
            });
            const unitDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-tex',
                innerHTML: katex.renderToString(`{\\rm [${unitTex}]}`, {throwOnError: false})
            });
            const dimLessValueDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-value',
                innerHTML: katex.renderToString(`= ${dimLessValue}`, {throwOnError: false})
            });
            const convertedUnitDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-converted',
                innerHTML: katex.renderToString(`\\times{\\rm [${convertedUnitTex}]}`, {throwOnError: false})
            });
            const dimLessSymbDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-symb',
                innerHTML: katex.renderToString(`\\times ${dimLessSymbTex}`, {throwOnError: false})
            });
         });
         // const caption = createAndAppendDOM(this.dom.table, 'caption', {
         //    innerText: 'Transformation Table'
         // });
    }
}

window.app = new App();