# bino.js

```javascript
bino()
  .fromText('bino.js\u2014is what?')
  .toHex(2);
> "62 69 6e 6f 2e 6a 73 e2 80 94 69 73 20 77 68 61 74 3f"

bino()
  .fromHex('62 69 6e 6f 2e 6a 73 e2 80 94 69 73 20 77 68 61 74 3f')
  .toBase64();
> "Ymluby5qc+KAlGlzIHdoYXQ/"

bino()
  .fromBase64('Ymluby5qc+KAlGlzIHdoYXQ/')
  .toText();
> "bino.js—is what?"

bino([0 | 0x62696e6f, 
      0 | 0x2e6a73e2, 
      0 | 0x80946973, 
      0 | 0x20776861, 
      0 | 0x743f0000], 144)
  .toSource();
"bino([1651076719,778728418,-2137757325,544696417,1950285824],144)"

bino([1651076719,778728418,-2137757325,544696417,1950285824],144)
  .toText();
> "bino.js—is what?"
```