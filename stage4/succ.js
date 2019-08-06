/*
 * An implementation of Ruby's string.succ method.
 * By Devon Govett
 *
 * Returns the successor to str. The successor is calculated by incrementing characters starting
 * from the rightmost alphanumeric (or the rightmost character if there are no alphanumerics) in the
 * string. Incrementing a digit always results in another digit, and incrementing a letter results in
 * another letter of the same case.
 *
 * If the increment generates a carry, the character to the left of it is incremented. This
 * process repeats until there is no carry, adding an additional character if necessary.
 *
 * succ("abcd")      == "abce"
 * succ("THX1138")   == "THX1139"
 * succ("<<koala>>") == "<<koalb>>"
 * succ("1999zzz")   == "2000aaa"
 * succ("ZZZ9999")   == "AAAA0000"
 */

function succ(input) {
  var alphabet = "abcdefghijklmnopqrstuvwxyz",
    length = alphabet.length,
    result = input,
    i = input.length;

  while (i >= 0) {
    var last = input.charAt(--i),
      next = "",
      carry = false;

    if (isNaN(last)) {
      index = alphabet.indexOf(last.toLowerCase());

      if (index === -1) {
        next = last;
        carry = true;
      } else {
        var isUpperCase = last === last.toUpperCase();
        next = alphabet.charAt((index + 1) % length);
        if (isUpperCase) {
          next = next.toUpperCase();
        }

        carry = index + 1 >= length;
        if (carry && i === 0) {
          var added = isUpperCase ? "A" : "a";
          result = added + next + result.slice(1);
          break;
        }
      }
    } else {
      next = +last + 1;
      if (next > 9) {
        next = 0;
        carry = true;
      }

      if (carry && i === 0) {
        result = "1" + next + result.slice(1);
        break;
      }
    }

    result = result.slice(0, i) + next + result.slice(i + 1);
    if (!carry) {
      break;
    }
  }
  return result;
}

module.exports = succ;
