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

The `data` and `bits` arguments are optional. Provide `data` as an array of signed 32-bit integers or a single signed 32-bit integer. By default, `bits` is set to the bit length of `data`.

```javascript
// zero bit length data
var binoInstance = bino();

// the bit string '00000'
var binoInstance = bino([], 5);
var binoInstance = bino([], 5);
var binoInstance = bino(0,  5);

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

#### `binoInstance.setup(int32Array[, bits])`

Core function used internally to set the `data` and `bits` properties of a `bino` instance.

```javascript
// 57 bits set to '1'
bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).data;
> [-1, -128]

bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).bits;
> 57
```
### Utility functions
#### `bino.group(someString, chunkSize[, delimiter])`

Utility function for grouping a string in chunks of size `chunkSize`. By default, `delimiter` is set to a blank space. Used internally in `binoInstance.toHex()`, `binoInstance.toBase64()`, and `binoInstance.toBinary()`.

```javascript
// group in digits of 3, separated by a dash
bino.group('1234567', 3, '-');
> "123-456-7"
```

#### `binoInstance.compare(binoInstance)`

Constant-time comparison of one `bino` instance to another. Returns `true` if they are equivalent, `false` otherwise.

```javascript
bino([0 | 0xffffffff], 5)
  .compare(bino([0 | 0xffffffff], 5));
> true

bino([0 | 0xffffffff], 4)
  .compare(bino([0 | 0xffffffff], 5));
> false
```
#### `binoInstance.toSource()`

Returns JavaScript source code representation of a `bino` instance.

```javascript
bino([0 | 0xffffffff, 0 | 0xffffffff], 57).toSource();
> "bino([-1,-128],57)"

bino([0 | 0xffffffff, 0 | 0xffffffff], 57)
  .compare(bino([-1,-128],57));
> true
```
### Codecs
#### `binoInstance.fromHex(hexString[, bits])`

Reads binary data as hexadecimal representation from a string. Unknown characters are ignored. The optional `bits` argument sets the bit length of the data.

```javascript
bino().fromHex('97f').toSource();
> "bino([-1745879040],12)"

bino().fromHex('ffff', 3).toBinary();
> "111"

bino().fromHex('67 8 9:a -- bc *d')
  .compare(bino(0x6789abcd))
> true
```
#### `binoInstance.toHex([chunkSize][, delimiter])`
If `binoInstance.bits` is not a multiple of `4`, returns `undefined`.
#### `binoInstance.fromBase64(base64String)`
#### `binoInstance.toBase64([chunkSize][, delimiter])`
If `binoInstance.bits` is not a multiple of `8`, returns `undefined`.
#### `binoInstance.fromBinary(bitString)`

Reads binary data as bit representation from a string. Unknown characters are ignored.

```javascript
bino().fromBinary('001011010').toSource();
> "bino([754974720],9)"

bino().fromBinary('11 1 1:1 -- 11 *1')
  .compare(bino(0xff << 24, 8))
> true
```

#### `binoInstance.toBinary([chunkSize][, delimiter])`
#### `binoInstance.fromText(txtString)`
#### `binoInstance.toText()`
If invalid UTF-8 sequence, returns `undefined`.
#### `binoInstance.fromOctets(octetArray)`
#### `binoInstance.toOctets()`
If `binoInstance.bits` is not a multiple of `8`, returns `undefined`.
### Customization
