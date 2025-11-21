# Week09 Lab — 報名 API 串接實作

本專案將 Week07 的前端註冊表單，串接到 Node.js + Express 後端 API，完成：

- 前端表單欄位驗證、密碼強度條、草稿暫存
- 後端 RESTful API：`POST /api/signup`、`GET /api/signup`
- 使用 VS Code REST Client / Postman 進行 API 測試
- 基礎錯誤處理與 CORS 設定

---

## 專案結構

```text
week09/
  client/
    signup_form.html     # 前端表單頁面
    signup_form.js       # 表單驗證 + 串接後端 API
    styles.css           # 密碼強度條、tag 樣式、按鈕 loading、toast 等
  server/
    app.js               # Express 伺服器主程式（掛載路由、CORS、錯誤處理）
    routes/
      signup.js          # /api/signup 路由（POST 建立、GET 查詢）
    package.json         # 後端套件與 scripts
    package-lock.json
    .env                 # 環境變數（PORT, ALLOWED_ORIGIN）
  tests/
    api.http             # VS Code REST Client 測試腳本
  README.md              # 本說明文件
