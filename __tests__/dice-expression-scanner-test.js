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
jest.dontMock('../lib/constant')

describe([
  'DiceExpressionParser#nextToken'
].join(' '), function () {
  it([
    'should return each next',
    'token in the source'
  ].join(' '), function () {
    const Scanner = require(FILE)
    const source = 'd3 D% 1d6 + 7 - d%'
    const expected = ['d3', 'D%', '1d6', '+', 7, '-', 'd%']

    const scanner = new Scanner(source)

    let token = scanner.nextToken()
    let i = 0

    while (token !== null) {
      expect(token.value)
        .toBe(expected[i++])
      token = scanner.nextToken()
    }
  })
})
