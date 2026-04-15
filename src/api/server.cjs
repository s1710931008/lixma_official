// npm install express sqlite3 cors
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 建立 / 開啟 SQLite 資料庫檔案
const dbPath = path.join(__dirname, 'todo.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('資料庫連線失敗:', err.message);
    } else {
        console.log('已連線到 SQLite 資料庫');
    }
});

// 建立資料表
db.run(`
  CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`, (err) => {
    if (err) {
        console.error('建立資料表失敗:', err.message);
    } else {
        console.log('todo 資料表已準備完成');
    }
});

// 取得全部資料
app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todo ORDER BY id DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 新增資料
app.post('/todos', (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'text 不可為空' });
    }

    db.run(
        'INSERT INTO todo (text) VALUES (?)',
        [text.trim()],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: this.lastID,
                text: text.trim()
            });
        }
    );
});

// 修改資料
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ error: 'text 不可為空' });
    }

    db.run(
        'UPDATE todo SET text = ? WHERE id = ?',
        [text.trim(), id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: '更新成功',
                changes: this.changes
            });
        }
    );
});

// 刪除資料
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM todo WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: '刪除成功',
            changes: this.changes
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});