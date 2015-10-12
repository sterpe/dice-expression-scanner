"use strict";
// re =/^([1-9][0-9]*)?(((d|D)?[1-9][0-9]*)|(d\%|D\%|0))$/;
const LineSource = require('line-source');
module.exports = function DiceExpressionScanner(expression) {
	const source = new LineSource(expression);
	return {
		nextToken: function () {
			let type = "operator";
			let S = "";
			let currentPosition;
			while (/\s/.test(source.currentChar)) {
				source.nextChar();
			}
			currentPosition = source.position;
			if (/^(?:\+|\-)/.test(source.currentChar)) {
				return [{
					type: type,
					value: source.currentChar === "+" ? "addition" : "subtraction",
					position: currentPosition,
					text: source.currentChar
				}, source.nextChar()].shift();
			}
			while(/^([1-9][0-9]*)?(((d|D)?[1-9][0-9]*)|(d\%|D\%|0))$/.test(S + source.currentChar)) {
				S += source.currentChar;
				source.nextChar();
				if (/(?:d|D)/.test(source.currentChar)) {
					S += source.currentChar;
					source.nextChar();
				}
			}
			if (/^([1-9][0-9]*)?(((d|D)?[1-9][0-9]*)|(d\%|D\%|0))$/.test(S)) {
				type = S.indexOf('d') > -1 || S.indexOf('D') > -1 ? "roll" : "value";
				return {
					type: type,
					value: type === "number" ? parseInt(S, 10) : S,
					position: currentPosition,
					text: S
				}
			} else if (source.currentChar === null) {
				return source.currentChar;
			} else {
				throw new Error();
			}
		}
	}
};
