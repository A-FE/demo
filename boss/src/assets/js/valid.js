/* ==========工具类样式=============== */
/* 常用表单验证 */
exports.isChineseName = function(str) {
  var reg = /^([\u4e00-\u9fa5]+)$/;
  return reg.test(str);
};

exports.isNumber = function(str) {
  var reg = /^\d+$/;
  return reg.test(str);
};

exports.isPhone = function(str) {
  var reg = /^1(3|4|5|7|8)[0-9]{9}$/;
  return reg.test(str);
};

exports.isIdcard = function(str) {
  var str = str || '';
  var reg = /(^[0-9]{17}[0-9Xx]{1}$)|(^[0-9]{15}$)/;
  var state = false;
  str += '';
  str = str.toUpperCase();
  var strArr = str.split('');
  if (15 === strArr.length && /^[0-9]*$/.test(str)) {
    state = true;
  } else if (18 === strArr.length) {
    var coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var count = 0;
    for (var i = 0; i < 17; ++i) {
      count += strArr[i] * coefficient[i]
    }
    var remainder = count % 11;
    var code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    if (strArr[17] === code[remainder]) {
      state = true;
    }
  }
  return state;
};

exports.isPassport = function(str) {
  var reg = /^(P\d{7}|G\d{8}|S\d{7,8}|D\d+|1[4,5]\d{7})$/;
  return  reg.test(str);
};

exports.isBankcard = function(str) {
  var reg = /^[0-9]*$/;
  return reg.test(str);
};

exports.isMoney = function(str) {
  var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
  return reg.test(str) && str - 0 > 0;
};

exports.isEmail = function(str) {
  var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return str.length < 100 && email.test(str);
};
