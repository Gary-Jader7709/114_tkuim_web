// 電腦隨機產生 1–100，提示再大一點/再小一點，猜中顯示次數
var answer = Math.floor(Math.random() * 100) + 1;
var times = 0;
var msg = '我想了一個 1–100 的數字，來猜猜看！';


while (true) {
var input = prompt(msg + '\n請輸入你的猜測（或按取消離開）：');
if (input === null) { // 取消
msg = '你離開了遊戲。';
break;
}
var n = parseInt(input, 10);
if (isNaN(n) || n < 1 || n > 100) {
msg = '請輸入 1–100 的整數！';
continue;
}
times++;
if (n === answer) {
msg = '恭喜猜中！答案是 ' + answer + '，共猜了 ' + times + ' 次。';
alert(msg);
break;
} else if (n < answer) {
msg = '再大一點！已猜次數：' + times;
} else {
msg = '再小一點！已猜次數：' + times;
}
}


document.getElementById('result').textContent = msg;