newserver
----
GET     /api/news
GET     /api/news/:slug

POST    /api/admin/news
PUT     /api/admin/news/:id
DELETE  /api/admin/news/:id

PUT     /api/admin/news/:id/stats
PUT     /api/admin/news/:id/gallery
PUT     /api/admin/news/:id/related
----
npm i express better-sqlite3 cors
node .\newserver.js
----
POST /api/admin/news
{
  "slug": "20240621",
  "category": "最新消息",
  "title": "台南金城國中風雨球場榮獲光鐸獎",
  "summary": "力瑪科技建置的台南金城國中風雨球場太陽能系統，榮獲台灣太陽光電產業最高榮譽光鐸獎肯定。",
  "content": "詳細內容...",
  "coverImage": "https://www.lixma.com.tw/image.jpg",
  "publishedDate": "2024-06-21",
  "readMinutes": 3,
  "isActive": 1
}
----
