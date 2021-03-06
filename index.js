'use strict'

var LineSource = require('line-source')
var CONSTANT = require('dice-constants')

function OperatorToken (currentPosition, source) {
  return {
    type: CONSTANT.OPERATOR,
    value: source.currentChar,
    position: currentPosition,
    text: source.currentChar
  }
}

function isDiceExpressionOrValue (S) {
  return /^([1-9][0-9]*)?(((d|D)?[1-9][0-9]*)|(d\%|D\%|0))$/
    .test(S)
}

function isDiceExpression (S) {
  return S.indexOf('d') > -1 || S.indexOf('D') > -1
}

function DiceExpressionToken (currentPosition, S) {
  return {
    type: CONSTANT.DIE,
    value: S.toLowerCase(),
    position: currentPosition,
    text: S
  }
}

function ValueToken (currentPosition, S) {
  return {
    type: CONSTANT.LITERAL,
    value: parseInt(S, 10),
    position: currentPosition,
    text: S
  }
}

function DiceExpressionScanner (expression) {
  var source = new LineSource(expression)
  var nextToken = DiceExpressionScanner.prototype.nextToken
  this.nextToken = nextToken.bind(this, source)
}

DiceExpressionScanner.prototype.nextToken = function (source) {
  var S = ''

  while (/\s/.test(source.currentChar)) {
    source.nextChar()
  }

  var currentPosition = source.position

  if (/^(?:\+|\-)/.test(source.currentChar)) {
    return [new OperatorToken(currentPosition,
      source), source.nextChar()].shift()
  }

  var isOk = isDiceExpressionOrValue

  if (/(?:d|D)/.test(source.currentChar)) {
    S += source.currentChar
    source.nextChar()
  }

  while (isOk(S + source.currentChar)) {
    S += source.currentChar
    source.nextChar()
    if (/(?:d|D)/.test(source.currentChar)) {
      S += source.currentChar
      source.nextChar()
    }
  }
  if (isOk(S)) {
    var T = isDiceExpression(S)
      ? DiceExpressionToken
      : ValueToken
    return new T(currentPosition, S)
  } else if (source.currentChar === null) {
    return null
  } else {
    throw new Error()
  }
}

module.exports = DiceExpressionScanner
