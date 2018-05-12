# bino.js

`bino.js` &ndash; *binary data in JavaScript objects*

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

The `data` and `bits` arguments are optional. Provide `data` as an array of signed 32-bit integers or a single signed 32-bit integer. Unless explicitly set, `bits` defaults to the bit length of `data`.

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

In JavaScript, a common naming convention is to capitalize class constructor names. As `bino()` is a constructor (sort of), it is also aliased as `Bino()`. The `new` operator also works fine with `Bino()`, but makes no difference in practice. The following 3 examples are all equivalent:

```javascript
// the bit string '11111'
var binoInstance = bino([0 | 0xffffffff], 5);
var binoInstance = Bino([0 | 0xffffffff], 5);
var binoInstance = new Bino([0 | 0xffffffff], 5);
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

#### `binoInstance.copy()`

Returns a copy of the `bino` instance.

### Codecs

#### `binoInstance.fromHex(hexString)`

Reads binary data as hexadecimal representation from a string, and overwrites any existing data. Unknown characters are ignored.

```javascript
bino().fromHex('97f').toSource();
> "bino([-1745879040],12)"

bino().fromHex('67 8 9:a -- bc *d')
  .compare(bino(0x6789abcd))
> true
```

#### `binoInstance.toHex([chunkSize][, delimiter])`

Returns a hexadecimal representation of the current data. If `binoInstance.bits` is not a multiple of `4`, it returns `undefined`.

The optional `chunkSize` and `delimiter` arguments can be used to  format the output in groups.

```javascript
bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex();
> "deadbeefbabecafe"

bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(4);
> "dead beef babe cafe"

bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(2, ':');
> "de:ad:be:ef:ba:be:ca:fe"

bino(0x97f00000, 12).toHex();
> "97f"

bino(0x97f00000, 13).toHex();
> undefined
```

#### `binoInstance.fromBase64(base64String)`

Reads binary data as a base-64 representation from a string, and overwrites any existing data. Unknown characters are ignored. 

```javascript
bino()
  .fromBase64(
    'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbm' + 
    'x5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz \n' +
    'IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci' + 
    'BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg \n' +
    'dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcm' + 
    'FuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu \n' +
    'dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYX' + 
    'Rpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo \n' +
    'ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm' + 
    '5hbCBwbGVhc3VyZS4=')
  .toText();
> "Man is distinguished, not only by his reason, " + 
  "but by this singular passion from other animals," + 
  " which is a lust of the mind, that by a " + 
  "perseverance of delight in the continued and " + 
  "indefatigable generation of knowledge, exceeds " + 
  "the short vehemence of any carnal pleasure."
```

#### `binoInstance.toBase64([chunkSize][, delimiter])`

Returns a base-64 representation of the current data. If `binoInstance.bits` is not a multiple of `8`, returns `undefined`.

The optional `chunkSize` and `delimiter` arguments can be used to  format the output in groups.

```javascript
bino()
  .fromText(
    "Man is distinguished, not only by his reason, " + 
    "but by this singular passion from other animals," + 
    " which is a lust of the mind, that by a " + 
    "perseverance of delight in the continued and " + 
    "indefatigable generation of knowledge, exceeds " + 
    "the short vehemence of any carnal pleasure.")
  .toBase64(38, '\n');
> "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbm\n" +
  "x5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz\n" +
  "IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci\n" +
  "BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg\n" +
  "dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcm\n" +
  "FuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu\n" +
  "dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYX\n" +
  "Rpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo\n" +
  "ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm\n" +
  "5hbCBwbGVhc3VyZS4="

bino().fromBinary('101').toText();
> undefined
```

#### `binoInstance.fromBinary(bitString)`

Reads binary data as bit representation from a string, and overwrites any existing data. Unknown characters are ignored.

```javascript
bino().fromBinary('001011010').toSource();
> "bino([754974720],9)"

bino()
  .fromBinary(
    '00100100 00111111 01101010 10001000 ' +
    '10000101 10100011 00001000 11010011 ' +
    '00010011 00011001 10001010 00101110')
   .toHex();
> "243f6a8885a308d313198a2e"

bino().fromBinary('11 1 1:1 -- 11 *1')
  .compare(bino(0xff << 24, 8))
> true
```

#### `binoInstance.toBinary([chunkSize][, delimiter])`

Returns a bit representation of the current data. The optional `chunkSize` and `delimiter` arguments can be used to  format the output in groups.

```javascript
bino(1 << 23).toBinary(4);
> "0000 0000 1000 0000 0000 0000 0000 0000"

bino([754974720], 9).toBinary();
> "001011010"
```

#### `binoInstance.fromText(txtString)`

Reads binary data as text data, and overwrites any existing data. Text is encoded as UTF-8. 

```javascript
// π ≈ 3.14 (pi is almost equal to 3.14)
bino().fromText('\u03c0 \u2248 3.14').toHex(2);
> "cf 80 20 e2 89 88 20 33 2e 31 34"
```

#### `binoInstance.toText()`

Returns a string representation of the current data, decoded as UTF-8. If the data cannot be decoded as valid UTF-8, it returns `undefined`.

```javascript
bino()
  .fromHex('cf 80 20 e2 89 88 20 33 2e 31 34')
  .toText();
> "π ≈ 3.14"

bino(0xff).toText();
> undefined
```

#### `binoInstance.fromOctets(octetArray)`

Reads binary data from an array of octets (bytes), and overwrites any existing data.

```javascript
bino()
  .fromOctets([
    0xcf, 0x80, 0x20, 0xe2, 
    0x89, 0x88, 0x20, 0x33, 
    0x2e, 0x31, 0x34])
  .toHex(2);
> "cf 80 20 e2 89 88 20 33 2e 31 34"
```

#### `binoInstance.toOctets()`

Returns the current data as an array of octets. If `binoInstance.bits` is not a multiple of `8`, it returns `undefined`.

```javascript
bino()
  .fromHex('cf 80 20 e2 89 88 20 33 2e 31 34')
  .toOctets();
> [207, 128, 32, 226, 137, 136, 32, 51, 46, 49, 52]

bino().fromHex('97f').toOctets();
> undefined
```
### Customization

New functionality can be added to `bino.prototype`. As an example, let us demonstrate how to add a function to flip endianess of the current data. Flipping will only occur if the bit length is a multiple of 32.

```javascript
bino.prototype.flipEndian = function () {
  var data = this.data,
      bits = this.bits,
      len  = data.length,
      pos  = 0;
  if((bits & 31) === 0){
    while(pos < len){
      data[pos] = data[pos] >>> 24 ^
        ((data[pos] >> 8) & 0xff00) ^
        ((data[pos] << 8) & 0xff0000) ^
        data[pos] << 24;
      pos++;
    }
  }
  return this;
}
```

Testing that it works:

```javascript
bino()
  .fromHex('01 23 45 67 89 ab cd ef')
  .flipEndian()
  .toHex(2);
> "67 45 23 01 ef cd ab 89"
```
