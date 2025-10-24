// 顯示提示窗
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息
console.log('Hello JavaScript from console');

// 在頁面指定區域輸出文字
var el = document.getElementById('result');
el.textContent = '這行文字是由外部 JS 檔案寫入的。';

// 增加一行你的姓名和學號
el.textContent += '\n姓名：郭秉逸（淡江大學 資管系4A），學號：412637935';
