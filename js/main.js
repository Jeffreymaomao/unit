import { createAndAppendDOM } from './tool.js'

const units = {
    meter    : {unitTex:  'm', dimLessValueTex: String.raw`1/(\hat{c}\hat{\hbar})`                               , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: String.raw`(c\hbar)`                    , },
    second   : {unitTex:  's', dimLessValueTex: String.raw`1/(\hat{\hbar})`                                      , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: String.raw`(\hbar)`                     , },
    kilogram : {unitTex: 'kg', dimLessValueTex: String.raw`(\hat{c}^{2})`                                        , convertedUnitTex: 'eV'     , dimLessSymbTex: String.raw`(c^{-2})`                    , },
    kelvin   : {unitTex:  'K', dimLessValueTex: String.raw`(\hat{k}_B)`                                          , convertedUnitTex: 'eV'     , dimLessSymbTex: String.raw`(k_B^{-1})`                  , },
    coulomb  : {unitTex:  'C', dimLessValueTex: String.raw`1/\sqrt{\hat{\epsilon}_0\hat{\hbar}\hat{c}}`          , convertedUnitTex: '1'      , dimLessSymbTex: String.raw`\sqrt{\epsilon_0\hbar c}`    , },
    ampere   : {unitTex:  'A', dimLessValueTex: String.raw`\sqrt{\hat{\hbar}/\hat{\epsilon}_0\hat{c}}`           , convertedUnitTex: 'eV'     , dimLessSymbTex: String.raw`\sqrt{\epsilon_0 c/\hbar}`   , },
    Farad    : {unitTex:  'F', dimLessValueTex: String.raw`1/(\hat{\epsilon}_0\hat{\hbar}\hat{c})`               , convertedUnitTex: 'eV^{-1}', dimLessSymbTex: String.raw`(\epsilon_0\hbar c)`         , },
    Tesla    : {unitTex:  'T', dimLessValueTex: String.raw`1/\sqrt{\hat{\epsilon}_0\hat{\hbar}^3\hat{c}^5}`      , convertedUnitTex: 'eV^{2}' , dimLessSymbTex: String.raw`\sqrt{\epsilon_0\hbar^3 c^5}`, },
    Gauss    : {unitTex:  'G', dimLessValueTex: String.raw`10^{-4}/\sqrt{\hat{\epsilon}_0\hat{\hbar}^3\hat{c}^5}`, convertedUnitTex: 'eV^{2}' , dimLessSymbTex: String.raw`\sqrt{\epsilon_0\hbar^3 c^5}`, },
}

class App {
    constructor(config={}) {
        this.dom = {};
        const locationSearcharams = new URLSearchParams(window.location.search);
        this.units = units;
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
                innerHTML: katex.renderToString(`= ${dimLessValueTex}`, {throwOnError: false})
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