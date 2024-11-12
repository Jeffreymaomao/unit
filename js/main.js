import { createAndAppendDOM } from './tool.js';
import { units } from './phys-data.js';
import {
    parseTexToNumber,
    number2LatexScientific
} from './tex-parse.js';

import { Symbolic } from './math-symbol.js';

class App {
    constructor(config={}) {
        this.dom = {};
        this.dimLessDom = {};
        const locationSearcharams = new URLSearchParams(window.location.search);
        this.units = units;
        this.showNumericValue = true;
        this.initDom(config.dom || document.body);
        this.bindEventListener();
    }

    initDom(domParrent) {
         this.dom.main = createAndAppendDOM(domParrent, 'main');
         this.dom.figure = createAndAppendDOM(this.dom.main, 'figure');
         this.dom.figureCaption = createAndAppendDOM(this.dom.figure, 'figcaption', {
            innerHTML: 'SI/Natural Unit Transformation Table'
         });
         this.dom.tableContainer = createAndAppendDOM(this.dom.figure, 'div', {
            class: 'table-container'
         })
         this.dom.table = createAndAppendDOM(this.dom.tableContainer, 'table', {
            class: 'unit-table'
         });
         const caption = createAndAppendDOM(this.dom.table, 'caption', {
            innerHTML: `All the fundamental physical constants are from 
            <a href="https://www.nist.gov/programs-projects/codata-values-fundamental-physical-constants" target="_blank">
            CODATA RECOMMENDED VALUES
            </a>`.replace('\n', '')
         });
         const thead = createAndAppendDOM(this.dom.table, 'thead');
         const thead_row = createAndAppendDOM(thead, 'tr'); 
         // ---
         createAndAppendDOM(thead_row, 'th', {
            class: 'unit-title',
            innerHTML: katex.renderToString('\\textbf{unit}', {throwOnError: false})
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
            this.dimLessDom[unitName] = dimLessValueDom;
            const convertedUnitDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-converted',
                innerHTML: katex.renderToString(`\\times{\\rm [${convertedUnitTex}]}`, {throwOnError: false})
            });
            const dimLessSymbDom = createAndAppendDOM(tbody_row, 'th', {
                class: 'unit-symb',
                innerHTML: katex.renderToString(`\\times ${dimLessSymbTex}`, {throwOnError: false})
            });
         });
    }

    bindEventListener() {
        window.addEventListener('keydown', this.keyDownEventListener.bind(this));
    }

    keyDownEventListener(e) {
        if(    e.key==='ArrowUp' 
            || e.key==='ArrowRight'
            || e.key==='ArrowDown'
            || e.key==='ArrowLeft'
            ) {
            this.showNumericValue = !this.showNumericValue;
            Object.keys(this.dimLessDom).forEach((unitName)=>{
                const dimLessValueTex  = this.units[unitName].dimLessValueTex;
                let dimLessValue = dimLessValueTex;
                if(this.showNumericValue){
                    const dimLessValueNumber = parseTexToNumber(dimLessValueTex);
                    dimLessValue = number2LatexScientific(dimLessValueNumber);
                }
                this.dimLessDom[unitName].innerHTML =  katex.renderToString(`= ${dimLessValue}`, {throwOnError: false})
            });
        } else if((e.metaKey||e.ctrlKey) && e.key==='p'){
            e.preventDefault();
            window.print();
        }
    }
}

window.app = new App();