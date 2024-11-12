function extractFirstBracesContent(str, brace='{}') {
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

function extractLatestBracesContent(str, brace='{}') {
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

export class Symbolic {
	constructor(expression, config={}) {
		if(expression===undefined) throw new Error('InputError: expression is not defined');
		this.expression = expression;
		this.latex = config.latex||config.tex||expression;
	}
	toString() {return this.expression;}
	//////////////////////////////////////////
	#_toTex(config={}) {
		const product = config.product || '\\times';
		const LBracket = config.leftBracket || '\\left(';
		const RBracket = config.rightBracket || '\\right)';
		const notUsingFrac = (!config.frac) || (config.divide === '/' || config.over === '/');
		// ---
		let parseTex = this.latex;
		// ---
		parseTex = parseTex.replaceAll('\\left(','(').replaceAll('\\right)',')');
		if(!notUsingFrac) {
			// using frac
			let max_iteration = (parseTex.match(/\\frac/g)||[]).length; // only accept this much `frac` in any input
			for(let i=0;i < max_iteration; i++){
				let match = parseTex.match(/\//);
				if(!match) break;
				const overIndex = match.index;
				const denominator = extractLatestBracesContent(parseTex.slice(0,overIndex), '()');
				const numerator   = extractFirstBracesContent(parseTex.slice(overIndex+1), '()');
				if(!denominator || !numerator) throw Error(`ParseError: parsing frac error`)
				parseTex = parseTex.slice(0, denominator.length-1) 
							+ `\\frac{${denominator}}{${numerator}}`
							+ parseTex.slice(overIndex+numerator.length+2);
			}
		}
		// if(true) {
		// 	let max_iteration = (parseTex.match(/\(/g)||[]).length; // only accept this much `bracket` in any input
		// 	for(let i=0;i < max_iteration; i++){
		// 		let match = parseTex.match(/\(/);
		// 		const leftBracketIndex = match.index;
		// 		let j=leftBracketIndex;
		// 		let depth = 
		// 		while(j<parseTex.length){
		// 			// run for every character

		// 			j++;
		// 		}
		// 	}
		// }
		parseTex = parseTex.replaceAll('(', '\\left(').replaceAll(')', '\\right)');
		// ---
		return parseTex
				.replaceAll('\\times',product)
				.replaceAll('\\left(',LBracket)
				.replaceAll('\\right)',RBracket);
	}

	toLaTeX(c) {return this.#_toTex(c);}
	toLatex(c) {return this.#_toTex(c);}
	tolatex(c) {return this.#_toTex(c);}
	toTeX(c)   {return this.#_toTex(c);}
	toTex(c)   {return this.#_toTex(c);}
	totex(c)   {return this.#_toTex(c);}

	//////////////////////////////////////////
	#_parseInput2Symbolic(other) {
		if (other instanceof Symbolic) {
			return other;
		} else if (typeof other === 'number') {
			return new Symbolic(other.toString());
		} else if (typeof other === 'string') {
			return new Symbolic(other);
		} else {
			throw new TypeError(`TypeError: Parameters must be "Symbolic","number" or "string"`);
		}
	}
	// ---
	#_eval() {
		try {
			return eval(this.expression);
		} catch (err) {
			throw new EvalError(`Symbolic EvalError: ${err}`); 
		}
	}
	eval()     {return this.#_eval();}
	evaluate() {return this.#_eval();}
	toFloat()  {return this.#_eval();}
	tofloat()  {return this.#_eval();}
	// ---
	#_subs(other, value) {
		const _other = this.#_parseInput2Symbolic(other);
		const _value = this.#_parseInput2Symbolic(value);
		return new Symbolic(
			this.expression.replace(_other.expression, _value.expression), {
			latex: this.latex.replace(_other.latex, _value.latex)
		});
	}
	subs(x,v)       {return this.#_subs(x,v);}
	substitute(x,v) {return this.#_subs(x,v);}
	replace(x,v)    {return this.#_subs(x,v);}
	//////////////////////////////////////////
	#_add(other) {
		const _other = this.#_parseInput2Symbolic(other);
		return new Symbolic(
			`${this.expression}+${_other.expressionr}`, {
			latex: `${this.latex}+${_other.latex}`
		});
	}
	#_sub(other) {
		const _other = this.#_parseInput2Symbolic(other);
		return new Symbolic(
			`${this.expression}-${_other.expressionr}`, {
			latex: `${this.latex}-${_other.latex}`
		});
	}
	#_times(other) {
		const _other = this.#_parseInput2Symbolic(other);
		return new Symbolic(
			`(${this.expression})*(${_other.expression})`, {
			latex: `\\left(${this.latex}\\right)\\times\\left(${_other.latex}\\right)`
		});
	}
	#_divide(other) {
		const _other = this.#_parseInput2Symbolic(other);
		return new Symbolic(
			`(${this.expression})/(${_other.expression})`, {
			latex: `\\left(${this.latex}\\right)/\\left(${_other.latex}\\right)`
			// latex: `\\frac{${this.latex}}{${_other.latex}}`
		});
	}
	// ---
	#_power(order) {
		const _order = this.#_parseInput2Symbolic(order);
		return new Symbolic(
			`Math.pow(${this.expression},${_order.expression})`, {
			latex: `\\left(${this.latex}\\right)^{${_order.latex}}`
		});
	}
	#_atan2(other) {
		const _other = this.#_parseInput2Symbolic(other);
		return new Symbolic(`Math.atan2(${this.expression},${_other})`, {
			latex: `\\operatorname{atan2}\\left(${this.expression},${_other}\\right)`
		});
	}
	// ---
	#_exp() {return new Symbolic(`Math.exp(${this.expression})`,     {latex: `\\exp\\left(${this.latex}\\right)`});}
	// ---
	#_sin()   {return new Symbolic(`Math.sin(${this.expression})`,   {latex: `\\sin\\left(${this.latex}\\right)`});}
	#_asin()  {return new Symbolic(`Math.asin(${this.expression})`,  {latex: `\\sin\\left(${this.latex}\\right)`});}
	#_sinh()  {return new Symbolic(`Math.sinh(${this.expression})`,  {latex: `\\asin\\left(${this.latex}\\right)`});}
	#_asinh() {return new Symbolic(`Math.asinh(${this.expression})`, {latex: `\\asinh\\left(${this.latex}\\right)`});}
	// ---
	#_cos()   {return new Symbolic(`Math.cos(${this.expression})`,   {latex: `\\cos\\left(${this.latex}\\right)`});}
	#_acos()  {return new Symbolic(`Math.acos(${this.expression})`,  {latex: `\\acos\\left(${this.latex}\\right)`});}
	#_cosh()  {return new Symbolic(`Math.cosh(${this.expression})`,  {latex: `\\cosh\\left(${this.latex}\\right)`});}
	#_acosh() {return new Symbolic(`Math.acosh(${this.expression})`, {latex: `\\acosh\\left(${this.latex}\\right)`});}
	// ---
	#_tan()   {return new Symbolic(`Math.tan(${this.expression})`,   {latex: `\\tan\\left(${this.latex}\\right)`});}
	#_atan()  {return new Symbolic(`Math.atan(${this.expression})`,  {latex: `\\atan\\left(${this.latex}\\right)`});}
	#_tanh()  {return new Symbolic(`Math.tanh(${this.expression})`,  {latex: `\\tanh\\left(${this.latex}\\right)`});}
	#_atanh() {return new Symbolic(`Math.atanh(${this.expression})`, {latex: `\\atanh\\left(${this.latex}\\right)`});}
	// ---
	#_log()   {return new Symbolic(`Math.log(${this.expression})`,   {latex: `\\ln\\left(${this.latex}\\right)`});}
	#_log2()  {return new Symbolic(`Math.log2(${this.expression})`,  {latex: `\\log_{2}\\left(${this.latex}\\right)`});}
	#_log10() {return new Symbolic(`Math.log10(${this.expression})`, {latex: `\\log_{10}\\left(${this.latex}\\right)`});}
	#_sign()  {return new Symbolic(`Math.sign(${this.expression})`,  {latex: `\\operatorname{sign}\\left(${this.latex}\\right)`});}
	#_sqrt()  {return new Symbolic(`Math.sqrt(${this.expression})`,  {latex: `\\sqrt{${this.latex}}`});}
	#_abs()   {return new Symbolic(`Math.abs(${this.expression})`,   {latex: `\\left|${this.latex}\\right|`});}
	////////////////////////////////////////////////
	add(x)  {return this.#_add(x);}
	plus(x) {return this.#_add(x);}
	// ---
	sub(x)      {return this.#_sub(x);}
	minus(x)    {return this.#_sub(x);}
	subtract(x) {return this.#_sub(x);}
	// ---
	times(x)      {return this.#_times(x);}
	multiply(x)   {return this.#_times(x);}
	multiplied(x) {return this.#_times(x);}
	// ---
	divide(x) {return this.#_divide(x);}
	over(x) {return this.#_divide(x);}
	// ---
	exp()   {return this.#_exp();}
	pow(x)   {return this.#_power(x);}
	power(x) {return this.#_power(x);}
	sin()   {return this.#_sin();}
	asin()  {return this.#_asin();}
	sinh()  {return this.#_sinh();}
	asinh() {return this.#_asinh();}
	cos()   {return this.#_cos();}
	acos()  {return this.#_acos();}
	cosh()  {return this.#_cosh();}
	acosh() {return this.#_acosh();}
	tan() 	 {return this.#_tan();}
	atan()  {return this.#_atan();}
	tanh()  {return this.#_tanh();}
	atanh() {return this.#_atanh();}
	log()   {return this.#_log();}
	log2()  {return this.#_log2();}
	log10() {return this.#_log10();}
	sign()  {return this.#_sign();}
	sqrt()  {return this.#_sqrt();}
	abs()   {return this.#_abs();}
	atan2(x) {return this.#_atan2(x);}
	////////////////////////////////////////////////
}