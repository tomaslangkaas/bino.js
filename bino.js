(function (prot) {
  function construct(dwords, bitlength) {
    this.setup(dwords, bitlength);
  }
  (this.bino = function (dwords, bitlength) {
    return new construct(
      dwords === void 0 ? [] : [].concat(dwords), 
      bitlength);
  }).prototype = construct.prototype = prot;
  this.bino.chunk = function (str, width, delimiter) {
    return ('' + str).replace(
      new RegExp('([^]{' + width + '})(?!$)', 'g'), 
      "$1" + delimiter);
  };
})({
  //bino prototype
  setup: function (data, bits) {
    this.data = data;
    bits = this.bits = bits || data.length << 5;
    data.length = (bits + 31) >>> 5;
    data[data.length - 1] &= -1 << (32 - (bits & 31));
    return this;
  },
  fromHex: function (hex, bits) {
    var bin = this.data,
      pos = 0,
      c,
      len = hex.length,
      parsedBits = 0;
    while (pos < len) {
      c = hex.charCodeAt(pos++);
      if ((c > 47 && c < 58) || 
          (c > 64 && c < 71) || 
          (c > 96 && c < 103)) {
        bin[parsedBits >>> 5] ^=
          ((c > 64 ? c + 9 : c) & 15) << 
          (28 - (parsedBits & 31));
        parsedBits += 4;
      }
    }
    return this.setup(bin, bits || parsedBits);
  },
  toHex: function (chunkSize, delimiter) {
    var bits = this.bits;
    if ((bits & 3) === 0) {
      var hex = "",
        pos = 0,
        data = this.data,
        len = data.length;
      while (pos < len) {
        hex += (data[pos++] + 0xf00000000)
          .toString(16).slice(1)
      }
      hex = hex.slice(0, bits / 4);
      return chunkSize ?
        bino.chunk(hex, chunkSize, delimiter || ' ') :
        hex;
    }
  },
  fromText: function (txt) {
    var bin = this.data,
      bits = 0,
      pos = 0,
      len;
    txt = unescape(encodeURIComponent(txt));
    for (len = txt.length; 
         pos < len; pos++ , 
         bits += 8) {
      bin[bits >>> 5] ^= 
        (txt.charCodeAt(pos) & 0xff) << 
        (24 - (bits & 31));
    }
    return this.setup(bin, bits);
  },
  toText: function () {
    var data = this.data,
      bits = this.bits,
      txt = "",
      pos = 0,
      toChar = String.fromCharCode;
    while (pos < bits) {
      txt += toChar((data[pos >>> 5] >>> 
        (24 - (pos & 31))) & 0xff);
      pos += 8;
    }
    try {
      return decodeURIComponent(escape(txt));
    } catch (e) { }
  },
  toBase64: function (chunkSize, delimiter) {
    var data = this.data,
      bits = this.bits,
      charlen = (bits >>> 1) / 3,
      charpos,
      base64 = "",
      value,
      buffer,
      bitpos,
      toChar = String.fromCharCode;
    if ((bits & 7) === 0) {
      for (
        charpos = bitpos = buffer = 0;
        charpos < charlen;
        value = (buffer >> (2 * (++charpos & 3))) & 63,
        base64 += toChar(
          value + 71 - (
            value < 26 ? 6 :
              value < 52 ? 0 :
                value < 62 ? 75 :
                  value ^ 63 ? 90 : 87
          )
        )
      ) {
        if ((charpos & 3) ^ 3) {
          buffer = (buffer << 8) ^ 
            ((data[bitpos >>> 5] >>> 
             (24 - (bitpos & 31))) & 0xff);
          bitpos += 8;
        }
      }
      while (charpos++ & 3) base64 += "=";
      return chunkSize ?
        bino.chunk(base64, chunkSize, delimiter || ' ') :
        base64;
    }
  },
  fromBase64: function (b64) {
    var bin = this.data,
      bits,
      count,
      buffer,
      charpos,
      value,
      len = b64.length;
    bits = count = buffer = charpos = 0;
    while (charpos < len) {
      value = b64.charCodeAt(charpos++) - 43;
      value += (53 < value) && (80 > value) ? -28 :
               (21 < value) && (48 > value) ? -22 :
               (4 < value) && (15 > value)  ?  47 :
               value ^ 4 ? (value ^ 0 ? 1e3 : 62) : 59;
      if (value < 64) {
        buffer = (buffer << 6) ^ value;
        if ((++count & 3) ^ 1) {
          bin[bits >>> 5] ^=
            ((buffer >> (4 - 2 * ((count - 2) & 3))) & 255) << 
             (24 - (bits & 31));
          bits += 8;
        }
      }
    }
    return this.setup(bin, bits);
  },
  toSource: function () {
    return 'bino([' + this.data + '],' + this.bits + ')';
  }
});
