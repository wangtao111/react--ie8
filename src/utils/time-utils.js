/**
 * Created by wuhao on 2017/3/23.
 */

const formatDate = (n) => {
  let txt = '';
  const year = parseInt(n / 360, 10);
  const day2 = n % 360;
  const month = parseInt(day2 / 30, 10);
  const day = Math.round(day2 % 30);

  if (year) {
    txt += `${year}年`;
  }
  if (month) {
    txt += `${month}个月`;
  }
  if (day) {
    txt += `${day}天`;
  }
  return txt;
};
module.exports.formatDate = formatDate;
