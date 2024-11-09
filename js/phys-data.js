export const constants = {
    '\\hat{\\hbar}'        : 1.054571817e-34,
    '\\hat{\\epsilon}_{0}' : 8.8541878188e-12,
    '\\hat{c}'             : 2.99792458e8,
    '\\hat{k}_{B}'         : 1.380649e-23,
    '\\hat{e}'             : 1.602176634e-19
};

export const units = {
    meter: {
        unitTex         : 'm',
        dimLessValueTex : '\\hat{e}/(\\hat{c}\\hat{\\hbar})',
        convertedUnitTex: 'eV^{-1}',
        dimLessSymbTex  : '(c\\hbar)',
    },

    second: {
        unitTex         : 's',
        dimLessValueTex : '\\hat{e}/(\\hat{\\hbar})',
        convertedUnitTex: 'eV^{-1}',
        dimLessSymbTex  : '(\\hbar)',
    },

    kilogram: {
        unitTex         : 'kg',
        dimLessValueTex : '\\hat{e}^{-1}(\\hat{c}^{2})',
        convertedUnitTex: 'eV',
        dimLessSymbTex  : '(c^{-2})',
    },

    kelvin: {
        unitTex         : 'K',
        dimLessValueTex : '\\hat{e}^{-1}(\\hat{k}_{B})',
        convertedUnitTex: 'eV',
        dimLessSymbTex  : '(k_{B}^{-1})',
    },

    coulomb: {
        unitTex         : 'C',
        dimLessValueTex : '1/\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}\\hat{c}}',
        convertedUnitTex: '1',
        dimLessSymbTex  : '\\sqrt{\\epsilon_{0}\\hbar c}',
    },

    ampere: {
        unitTex         : 'A',
        dimLessValueTex : '\\hat{e}^{-1}\\sqrt{\\hat{\\hbar}/(\\hat{\\epsilon}_{0}\\hat{c})}',
        convertedUnitTex: 'eV',
        dimLessSymbTex  : '\\sqrt{\\epsilon_{0} c/\\hbar}',
    },

    Farad: {
        unitTex         : 'F',
        dimLessValueTex : '\\hat{e}/(\\hat{\\epsilon}_{0}\\hat{\\hbar}\\hat{c})',
        convertedUnitTex: 'eV^{-1}',
        dimLessSymbTex  : '(\\epsilon_{0}\\hbar c)',
    },

    Tesla: {
        unitTex         : 'T',
        dimLessValueTex : '\\hat{e}^{-2}\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}^{3}\\hat{c}^{5}}',
        convertedUnitTex: 'eV^{2}',
        dimLessSymbTex  : '\\sqrt{1/\\epsilon_{0}\\hbar^{3} c^{5}}',
    },

    Gauss: {
        unitTex         : 'G',
        dimLessValueTex : '10^{-4}\\hat{e}^{-2}\\sqrt{\\hat{\\epsilon}_{0}\\hat{\\hbar}^{3}\\hat{c}^{5}}',
        convertedUnitTex: 'eV^{2}',
        dimLessSymbTex  : '\\sqrt{1/\\epsilon_{0}\\hbar^{3} c^{5}}',
    },
}