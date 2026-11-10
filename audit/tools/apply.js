// Применяет список точных замен к файлу и падает, если какая-то строка не найдена (или найдена не один раз).
// node apply.js <файл> <json со списком [[old,new],…] или [[old,new,'all']]>; строки в json — с \n, в файл пишутся с его переводами строк
const fs = require('fs');
const [file, spec] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
const eol = s.includes('\r\n') ? '\r\n' : '\n';
s = s.replace(/\r\n/g, '\n');
const list = JSON.parse(fs.readFileSync(spec, 'utf8'));
for (const [a, b, mode] of list) {
  const n = s.split(a).length - 1;
  if (n === 0) throw new Error('не найдено: ' + a.slice(0, 90));
  if (n > 1 && mode !== 'all') throw new Error('найдено ' + n + ' раз: ' + a.slice(0, 90));
  s = s.split(a).join(b);
}
fs.writeFileSync(file, s.replace(/\n/g, eol));
console.log(file + ': замен ' + list.length);
