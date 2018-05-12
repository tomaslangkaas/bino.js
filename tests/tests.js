test("bino().fromBinary()", function(done){
  var obj = bino().fromBinary('1011011101001');
  done(obj.bits === 13 && obj.data + '' === '-1220018176');
});

test("bino().toBinary()", function(done){
  done(bino(-1220018176, 13).toBinary() === '1011011101001');
});

test("bino().toBinary()", function(done){
  done(bino(-1220018176, 15).toBinary() === '101101110100100');
});

// tests

test("bino data", function(done) {
  done(bino().data.constructor === Array);
});

test("bino bits", function(done) {
  done(bino().bits === 0);
});

test("bino construct from value 1", function(done) {
  done(bino(0x12345678).data + "" === [0x12345678] + "");
});

test("bino construct from value 2", function(done) {
  done(bino(0x12345678).bits === 32);
});

test("bino construct from value 3", function(done) {
  done(bino(0xffffffff, 4).data + "" === [0 | 0xf0000000] + "");
});

test("bino construct from data", function(done) {
  var obj = bino([0x12345678, 0x23456789]);
  done(obj.bits === 64 && obj.data + "" === [0x12345678, 0x23456789] + "");
});

test("bino set bitlength", function(done) {
  var obj = bino(0xffffffff, 23);
  done(obj.bits === 23 && obj.data + "" === [-512] + "");
});

test("bino.fromHex()", function(done) {
  var obj = bino().fromHex("f5 df 45:f8 1 8 f53 ");
  done(
    obj.data + "" === [0 | 0xf5df45f8, 0 | 0x18f53000] + "" && obj.bits === 52
  );
});

test("bino.toHex()", function(done) {
  done(bino([0 | 0xf5df45f8, 0 | 0x18f53000], 52).toHex() === "f5df45f818f53");
});

test("bino.toText()", function(done) {
  done(
    bino([0 | 0x616263c3, 0 | 0xa6c3b8c3, 0 | 0xa5000000], 72).toText() ===
      "abcæøå"
  );
});

test("bino.fromText()", function(done) {
  var obj = bino().fromText("abcæøå");
  done(
    obj.data + "" === [0 | 0x616263c3, 0 | 0xa6c3b8c3, 0 | 0xa5000000] + "" &&
      obj.bits === 72
  );
});

test("bino.toBase64()", function(done) {
  done(bino([0 | 0x666f6f62]).toBase64() === "Zm9vYg==");
});

test("bino.fromBase64()", function(done) {
  var obj = bino().fromBase64("Zm 9 vYg==");
  done(obj.data + '' === '' + [0 | 0x666f6f62] && obj.bits === 32);
});

/* test functions */

function test(name, fn) {
  if (!window["tests"]) window["tests"] = [];
  tests.push([name, fn]);
}

setTimeout(function() {
  testrunner(tests, function(completed, total, passed, failures, pending) {
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
        (function(index) {
          return function(result) {
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
