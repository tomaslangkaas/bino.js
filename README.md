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
> "bino([1651076719,778728418,-2137757325,544696417,1950285824],144)"

bino([1651076719,778728418,-2137757325,544696417,1950285824],144)
  .toText();
> "bino.js—is what?"
```

## Reference
### Core
#### `bino([data][, bits])`
Constructs and returns a new `bino` instance. Does not require the `new` operator.

The `data` and `bits` arguments are optional. Provide `data` as an array of signed 32-bit integers or a single 32-bit integer. By default, `bits` is set to the bit length of `data`.

```javascript
var binoInstance = bino();      // zero bit length
var binoInstance = bino([], 0); // zero bit length
var binoInstance = bino(0, 0);  // zero bit length

// the bit string '00000'
var binoInstance = bino([], 5);

// the bit string '11111'
var binoInstance = bino([0 | 0xffffffff], 5);

// the hex representation 'a1a2a3a4a5a6a7a8'
var binoInstance = bino([0 | 0xa1a2a3a4,
                         0 | 0xa5a6a7a8]);
```
#### `binoInstance.data`

Array of signed 32-bit integers representing the binary data of the `bino` instance. Do not modify this without using `binoInstance.setup`.

```javascript
bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).data;
> [-559038737, -1161901314]
```

#### `binoInstance.bits`

The bit length of the `bino` instance.

```javascript
bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).bits;
> 64

bino().fromBinary('01011').bits;
> 5
```

#### `binoInstance.setup(int32Array[,bits])`

Core function used internally to set the `data` and `bits` properties of a `bino` instance.

```javascript
// 57 bits set to '1'
bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).data;
> [-1, -128]

bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).bits;
> 57
```
### Utility functions
#### `bino.group(chunkSize[,delimiter])`
#### `binoInstance.compare(binoInstance)`
#### `binoInstance.toSource()`

```javascript
bino([0 | 0xffffffff, 0 | 0xffffffff], 57).toSource();
> "bino([-1,-128],57)"
```
### Codecs
#### `binoInstance.fromHex(hexString[,bits])`
#### `binoInstance.toHex([chunkSize][,delimiter])`
If `binoInstance.bits` is not a multiple of `4`, returns `undefined`.
#### `binoInstance.fromBase64(base64String)`
#### `binoInstance.toBase64([chunkSize][,delimiter])`
If `binoInstance.bits` is not a multiple of `8`, returns `undefined`.
#### `binoInstance.fromBinary(bitString)`
#### `binoInstance.toBinary([chunkSize][,delimiter])`
#### `binoInstance.fromText(txtString)`
#### `binoInstance.toText()`
If invalid UTF-8 sequence, returns `undefined`.
#### `binoInstance.fromOctets(octetArray)`
#### `binoInstance.toOctets()`
If `binoInstance.bits` is not a multiple of `8`, returns `undefined`.
### Customization
