# LIXMA Official

LIXMA 官方網站前後台專案。前端使用 React + Vite，後端使用 Express + SQLite，後台可管理最新消息、媒體報導、工程實績與公司沿革。

## 快速啟動

安裝套件：

```bash
npm install
```

啟動前端：

```bash
npm run dev
```

預設前端網址：

```text
http://localhost:5173
```

啟動 API 後端：

```bash
npm run api
```

預設 API 網址：

```text
http://localhost:3000
```

## 常用頁面

```text
/                         首頁
/news                     最新消息
/news/:id                 最新消息詳細頁
/about                    關於我們
/projects                 工程實績
/contact                  聯絡我們
/solar-calculator         太陽能試算
/admin/login              後台登入
/admin/news               後台最新消息
/admin/projects           後台工程實績
/admin/projects/edit/:id  編輯工程實績
/admin/history            後台公司沿革
```

## 專案結構

```text
public/                  靜態資源
src/
  api/                   Express API、SQLite DB、seed script
  assets/                前端圖片資源
  components/            共用 React 元件
  data/                  前端預設資料
  lang/                  多語系文字
  pages/                 頁面與後台表單
  routes/                React Router 路由
  utils/                 工具函式，例如後台 token、圖片壓縮
index.html               Vite 入口 HTML
package.json             scripts 與 dependencies
vite.config.js           Vite 設定
```

## 後台登入

API 預設帳密在 `src/api/newserver.js`：

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

可用環境變數覆蓋：

```bash
ADMIN_USERNAME=your_user ADMIN_PASSWORD=your_password npm run api
```

登入成功後，token 會存到瀏覽器 `localStorage` 的 `lixma_admin_token`。

## 資料庫

SQLite 預設檔案：

```text
src/api/news.db
```

API 會從 `NEWS_DB_PATH` 讀取自訂 DB 路徑；沒有設定時使用上面的預設檔案。

```bash
NEWS_DB_PATH=./path/to/news.db npm run api
```

主要資料表：

```text
news              最新消息主資料
news_sections     最新消息段落
news_stats        最新消息統計數字
news_features     最新消息特色項目
news_gallery      最新消息圖片集
news_related      相關最新消息
media_reports     媒體報導
projects          工程實績主資料
project_gallery   工程實績照片集
company_history   公司沿革
```

## 工程實績照片資料

以後台頁面為例：

```text
http://localhost:5173/admin/projects/edit/8
```

這筆資料的 `id` 是 `8`，照片存放位置如下：

```text
彙整封面：
DB     src/api/news.db
table  projects
key    id = 8
field  image

照片集：
DB     src/api/news.db
table  project_gallery
key    project_id = 8
field  image
```

注意：目前上傳照片不是存成實體檔案，而是由前端轉成 `data:image/jpeg;base64,...` 字串後直接存進 SQLite 欄位。外部圖片 URL 也可能直接存在同一個 `image` 欄位。

## API

公開 API：

```text
GET /api/health
GET /api/news
GET /api/news/:idOrSlug
GET /api/media
GET /api/projects
GET /api/history
```

後台登入：

```text
POST /api/admin/login
```

後台 API 需帶 Bearer token：

```text
Authorization: Bearer <token>
```

後台最新消息：

```text
GET    /api/admin/news
GET    /api/admin/news/:id
POST   /api/admin/news
PUT    /api/admin/news/:id
DELETE /api/admin/news/:id
```

後台媒體報導：

```text
GET    /api/admin/media
GET    /api/admin/media/:id
POST   /api/admin/media
PUT    /api/admin/media/:id
DELETE /api/admin/media/:id
```

後台工程實績：

```text
GET    /api/admin/projects
GET    /api/admin/projects/:id
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
```

後台公司沿革：

```text
GET    /api/admin/history
GET    /api/admin/history/:id
POST   /api/admin/history
PUT    /api/admin/history/:id
DELETE /api/admin/history/:id
```

## 常用指令

```bash
npm run dev       # 啟動 Vite 前端
npm run api       # 啟動 Express API
npm run build     # 建置前端
npm run lint      # ESLint 檢查
npm run preview   # 預覽 build 結果
npm run seed:news # 匯入最新消息種子資料
```

## 查詢工程實績照片範例

查詢工程實績 `id = 8` 的彙整封面與照片集：

```bash
node --input-type=module -e "import Database from 'better-sqlite3'; const db = new Database('src/api/news.db', { readonly: true }); console.log(db.prepare('SELECT id, title, length(image) AS imageLength, substr(image, 1, 40) AS imagePrefix FROM projects WHERE id = ?').get(8)); console.log(db.prepare('SELECT id, project_id, sort_order, alt, length(image) AS imageLength, substr(image, 1, 40) AS imagePrefix FROM project_gallery WHERE project_id = ? ORDER BY sort_order, id').all(8));"
```

## GigHub
---
```bash
echo "# lixma_official" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/s1710931008/lixma_official.git
git push -u origin main
```
---