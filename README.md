# dice-expression-scanner

```javascript
const Scanner = require('dice-expression-scanner')
const scanner = new Scanner('1d6 + 7 - d%')
scanner.nextToken()
// { type: 'DIE', value: '1d6', position: 1, text: '1d6' }
scanner.nextToken()
// { type: 'OPERATOR', value: '+', position: 5, text: '+' }
scanner.nextToken()
// { type: 'LITERAL', value: 7, position: 7, text: '7' }
scanner.nextToken()
// { type: 'OPERATOR', value: '-', position: 9, text: '-' }
scanner.nextToken()
// { type: 'DIE', value: 'd%', position: 11, text: 'd%' }
scanner.nextToken()
// null
```
