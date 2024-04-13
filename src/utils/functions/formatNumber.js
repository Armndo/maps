/**
 * Formats a number with digit group separation
 * @param  {Number} number  Any number
 * @return {String} The former number now formatted
 */
export function formatNumber(number) {
    let sign = number < 0;
  
    number = number.toString();
  
    if (sign) {
      number = number.substr(1);
    }
  
    let i = number.length - 1;
    let point = number.indexOf(".");
    let res = "";
  
    if (point > -1) {
      i = point;
      res = number.substr(point);
      i--;
    }
  
    let counter = 0;
    let flag = false;
  
    for (i; i >= 0; i--) {
      counter++;
  
      if (flag) {
        res = "," + res;
        flag = false;
      }
  
      res = number[i] + res;
  
      if (counter % 3 === 0) {
        flag = true;
      }
    }
  
    if (sign) {
      res = "-" + res;
    }
  
    return res;
  }
  