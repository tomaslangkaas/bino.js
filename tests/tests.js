test("bino.version", function (done) {
  done(typeof bino.version === 'string');
});

test("bino()", function (done) {
  done(typeof bino() === 'object');
});

test("bino().data is array", function (done) {
  done(bino().data.constructor === Array);
});

test("bino().bits is number", function (done) {
  done(typeof bino().bits === 'number');
});

test("bino([,,], 1) setup", function (done) {
  done(bino([,,], 1).data.join('-') === '0');
});

test("bino([,,], 0) setup", function (done) {
  done(bino([,,], 0).data.join('-') === '');
});

test("bino([0 | 0xffffffff], 5)", function (done) {
  done(
    (bino([0 | 0xffffffff], 5).data >>> 0).toString(2) ===
    "11111000000000000000000000000000"
  );
});

test("bino(3 << 2, 29)", function (done) {
  done((bino(3 << 2, 29).data >>> 0).toString(2) === "1000");
});

test("bino([0 | 0xa1a2a3a4, 0 | 0xa5a6a7a8])", function (done) {
  done(
    bino([0 | 0xa1a2a3a4, 0 | 0xa5a6a7a8]).data.join() ===
    "-1583176796,-1515804760"
  );
});

test("bino([0 | 0xa1a2a3a4, 0 | 0xa5a6a7a8]).bits", function (done) {
  done(bino([0 | 0xa1a2a3a4, 0 | 0xa5a6a7a8]).bits === 64);
});

test("bino === Bino", function (done) {
  done(bino === Bino);
});

test("bino().setup() bits", function (done) {
  done(
    bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).bits === 57
  );
});

test("bino().setup() data", function (done) {
  done(
    bino().setup([0 | 0xffffffff, 0 | 0xffffffff], 57).data.join() ===
    '-1,-128'
  );
});

test("bino.group('1234567', 3, '-')", function (done) {
  done(bino.group('1234567', 3, '-') === "123-456-7");
});

test("bino().compare() true", function (done) {
  done(bino([0 | 0xffffffff], 5)
    .compare(bino([0 | 0xffffffff], 5)) === true);
});

test("bino().compare() false", function (done) {
  done(bino([0 | 0xffffffff], 4)
    .compare(bino([0 | 0xffffffff], 5)) === false);
});

test("bino().toSource()", function (done) {
  done(bino([0 | 0xffffffff, 0 | 0xffffffff], 57)
    .toSource() === "bino([-1,-128],57)");
});

test("bino().copy()", function (done) {
  var obj = bino([-1,-128],57),
      copy = obj.copy();
  copy.setup(copy.data, 56);
  done(
    obj.toSource()  === 'bino([-1,-128],57)' &&
    copy.toSource() === 'bino([-1,-256],56)'
  );
});

test("bino().fromHex('97f')", function (done) {
  done(
    bino().fromHex('97f').toSource() === "bino([-1745879040],12)"
  );
});

test("bino().fromHex('67 8 9:a -- bc *d')", function (done) {
  done(
    bino().fromHex('67 8 9:a -- bc *d')
      .compare(bino(0x6789abcd)) === true
  );
});

test("bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex()", function (done) {
  done(
    bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex() ===
    "deadbeefbabecafe"
  );
});

test("bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(4)", function (done) {
  done(
    bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(4) ===
    "dead beef babe cafe"
  );
});

test("bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(2, ':')", function (done) {
  done(
    bino([0 | 0xdeadbeef, 0 | 0xbabecafe]).toHex(2, ':') ===
    "de:ad:be:ef:ba:be:ca:fe"
  );
});

test("bino(0x97f00000, 12).toHex()", function (done) {
  done(
    bino(0x97f00000, 12).toHex() === "97f"
  );
});

test("bino(0x97f00000, 13).toHex()", function (done) {
  done(
    bino(0x97f00000, 13).toHex() === void 0
  );
});

test("bino().fromBase64()", function (done) {
  done(
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
    .toText() ===
    "Man is distinguished, not only by his reason, " + 
    "but by this singular passion from other animals," + 
    " which is a lust of the mind, that by a " + 
    "perseverance of delight in the continued and " + 
    "indefatigable generation of knowledge, exceeds " + 
    "the short vehemence of any carnal pleasure."
  );
});

test("bino().toBase64()", function (done) {
  done(
    bino()
    .fromText(
      "Man is distinguished, not only by his reason, " + 
      "but by this singular passion from other animals," + 
      " which is a lust of the mind, that by a " + 
      "perseverance of delight in the continued and " + 
      "indefatigable generation of knowledge, exceeds " + 
      "the short vehemence of any carnal pleasure.")
    .toBase64(38, '\n') ===
    "TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbm\n" +
    "x5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlz\n" +
    "IHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci\n" +
    "BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2Yg\n" +
    "dGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcm\n" +
    "FuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu\n" +
    "dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYX\n" +
    "Rpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo\n" +
    "ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm\n" +
    "5hbCBwbGVhc3VyZS4="
  );
});

test("bino(0x12345678, 32).toBase64()", function (done) {
  done(
    bino(0x12345678, 32).toBase64() === "EjRWeA=="
  );
});

test("bino(0x12345678, 24).toBase64()", function (done) {
  done(
    bino(0x12345678, 24).toBase64() === "EjRW"
  );
});

test("bino(0x12345678, 16).toBase64()", function (done) {
  done(
    bino(0x12345678, 16).toBase64() === "EjQ="
  );
});

test("bino(0x12345678, 31).toBase64()", function (done) {
  done(
    bino(0x12345678, 31).toBase64() === void 0
  );
});

test("bino().fromBinary('001011010')", function (done) {
  done(
    bino().fromBinary('001011010').toSource() ===
    "bino([754974720],9)"
  );
});

test("bino().fromBinary(...)", function (done) {
  done(
    bino()
    .fromBinary(
      '00100100 00111111 01101010 10001000 ' +
      '10000101 10100011 00001000 11010011 ' +
      '00010011 00011001 10001010 00101110')
     .toHex(2) ===
    "24 3f 6a 88 85 a3 08 d3 13 19 8a 2e"
  );
});

test("bino().fromBinary('11 1 1:1 -- 11 *1')", function (done) {
  done(
    bino().fromBinary('11 1 1:1 -- 11 *1')
      .compare(bino(0xff << 24, 8)) === true
  );
});

test("bino(1 << 23).toBinary(4)", function (done) {
  done(
    bino(1 << 23).toBinary(4) ===
    "0000 0000 1000 0000 0000 0000 0000 0000"
  );
});

test("bino([754974720], 9).toBinary()", function (done) {
  done(
    bino([754974720], 9).toBinary() ===
    "001011010"
  );
});

test("bino().fromText('\u03c0 \u2248 3.14')", function (done) {
  done(
    bino().fromText('\u03c0 \u2248 3.14').toHex(2) ===
    "cf 80 20 e2 89 88 20 33 2e 31 34"
  );
});

test("bino().toText()", function (done) {
  done(
    bino()
    .fromHex('cf 80 20 e2 89 88 20 33 2e 31 34')
    .toText() ===
    "π ≈ 3.14"
  );
});

test("bino(0xff).toText()", function (done) {
  done(
    bino(0xff).toText() === void 0
  );
});

test("bino().fromOctets()", function (done) {
  done(
    bino()
    .fromOctets([
      0xcf, 0x80, 0x20, 0xe2, 
      0x89, 0x88, 0x20, 0x33, 
      0x2e, 0x31, 0x34])
    .toHex(2) ===
    "cf 80 20 e2 89 88 20 33 2e 31 34"
  );
});

test("bino().toOctets()", function (done) {
  done(
    bino()
    .fromHex('cf 80 20 e2 89 88 20 33 2e 31 34')
    .toOctets().join(', ') ===
  "207, 128, 32, 226, 137, 136, 32, 51, 46, 49, 52"
  );
});

test("bino().fromHex('97f').toOctets()", function (done) {
  done(
    bino().fromHex('97f').toOctets() === void 0
  );
});

test("extend bino.prototype", function (done) {
  var result;
  bino.prototype._flipEndian = function () {
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
  try{
    result = bino()
      .fromHex('01 23 45 67 89 ab cd ef')
      ._flipEndian()
      .toHex(2);
    delete bino.prototype._flipEndian;
  }catch(err){}
  done(
    result === "67 45 23 01 ef cd ab 89" &&
    bino()._flipEndian === void 0
  );
});

/* test functions */

function test(name, fn) {
  if (!window["tests"]) window["tests"] = [];
  tests.push([name, fn]);
}

setTimeout(function () {
  testrunner(tests, function (completed, total, passed, failures, pending) {
    document.getElementById("results").innerHTML =
      "<p>Passed " +
      passed +
      " of " +
      completed +
      ", " +
      (total - completed) +
      " pending.</p>" +
      failures.join("<br>");
  });
});

function testrunner(tests, onprogress) {
  //onprogress(completed, total, successes, failureReport)
  //test = [name, function]
  //test[1](done) => done(TrueOrFailureString)
  var i,
    total = tests.length,
    completed = 0,
    passed = 0,
    failures = [],
    pending = [];
  for (i = 0; i < total; i++) {
    pending[i] = "" + i;
    try {
      tests[i][1](
        (function (index) {
          return function (result) {
            if (result === true || result === void 0) {
              passed++;
            } else {
              failures.push(
                "[" +
                index +
                "] " +
                tests[index][0] +
                ": " +
                (result || "Failed")
              );
            }
            pending[index] = "";
            completed++;
            onprogress(completed, total, passed, failures, pending);
          };
        })(i)
      );
    } catch (err) {
      failures.push("[" + i + "] " + tests[i][0] + ": Error");
      pending[i] = "";
      completed++;
      onprogress(completed, total, passed, failures, pending);
    }
  }
}
