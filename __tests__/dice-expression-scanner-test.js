/* global
  describe
  expect
  jest
  it
*/

'use strict'

const FILE = '../'

jest.dontMock(FILE)
jest.dontMock('line-source')
jest.dontMock('dice-constants')

describe([
  'DiceExpressionParser#nextToken'
].join(' '), function () {
  it([
    'should return each next',
    'token in the source'
  ].join(' '), function () {
    const CONSTANT = require('dice-constants')
    const Scanner = require(FILE)
    const source = '2D4 d3 D% 1d6 + 7 - d%'
    const expected = [{
      type: CONSTANT.DIE,
      value: '2d4',
      position: 1,
      text: '2D4'
    }, {
      type: CONSTANT.DIE,
      value: 'd3',
      position: 5,
      text: 'd3'
    }, {
      type: CONSTANT.DIE,
      value: 'd%',
      position: 8,
      text: 'D%'
    }, {
      type: CONSTANT.DIE,
      value: '1d6',
      position: 11,
      text: '1d6'
    }, {
      type: CONSTANT.OPERATOR,
      value: '+',
      position: 15,
      text: '+'
    }, {
      type: CONSTANT.LITERAL,
      value: 7,
      position: 17,
      text: '7'
    }, {
      type: CONSTANT.OPERATOR,
      value: '-',
      position: 19,
      text: '-'
    }, {
      type: CONSTANT.DIE,
      value: 'd%',
      position: 21,
      text: 'd%'
    }]

    const scanner = new Scanner(source)

    let token = scanner.nextToken()
    let i = 0

    while (token !== null) {
      expect(token)
        .toEqual(expected[i++])
      token = scanner.nextToken()
    }
  })
})
