// 获取/设置Cookie的简单实现
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let setCookie = function (name, value, days = 30) {
  let exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURI(value)};domain=${IS_PRODUCTION ? '.vote.ybusad.com' : '.vote.me'};path=/;expires=${exp.toGMTString()}`;
}

let getCookie = function (name, _default = null) {
  var nameValue = _default;
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
      nameValue = decodeURI(arr[2]);
  }
  return nameValue;
}

let delCookie = function (name) {
  let exp = new Date(Date.now() - 1);
  document.cookie = `${name}=;path=/;expires=${exp.toGMTString()}`;
}

export {setCookie, getCookie, delCookie};