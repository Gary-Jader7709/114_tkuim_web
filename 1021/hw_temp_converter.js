// 使用 prompt() 讀入溫度與單位（C 或 F），並進行轉換
var unit = prompt('請輸入單位（C 或 F）：');
var valueStr = prompt('請輸入溫度數值：');
var value = parseFloat(valueStr);


var text = '';
if (!unit || isNaN(value)) {
text = '輸入不正確';
} else {
unit = unit.toUpperCase();
if (unit === 'C') {
var f = value * 9 / 5 + 32;
text = value + ' °C = ' + f.toFixed(2) + ' °F';
alert(text);
} else if (unit === 'F') {
var c = (value - 32) * 5 / 9;
text = value + ' °F = ' + c.toFixed(2) + ' °C';
alert(text);
} else {
text = '單位需為 C 或 F';
}
}


document.getElementById('result').textContent = text;