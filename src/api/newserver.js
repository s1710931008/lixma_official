import cors from "cors";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projectData as defaultProjectData } from "../data/projectData.js";
import { historyData as defaultHistoryData } from "../data/historyData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const DB_PATH = process.env.NEWS_DB_PATH || join(__dirname, "news.db");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || crypto.randomUUID();

const app = express();
const db = new Database(DB_PATH);

app.use(cors());
app.use(express.json({ limit: "8mb" }));

db.exec(`
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  date TEXT,
  views INTEGER DEFAULT 0,
  read_minutes INTEGER DEFAULT 3,
  award INTEGER DEFAULT 0,
  award_title TEXT,
  award_desc TEXT,
  year TEXT,
  cover_image TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER,
  title TEXT,
  content TEXT,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS news_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER,
  number TEXT,
  label TEXT,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS news_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER,
  content TEXT,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS news_gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER,
  image TEXT,
  alt TEXT,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS news_related (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER,
  related_id INTEGER
);

CREATE TABLE IF NOT EXISTS media_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT,
  year TEXT,
  url TEXT,
  source TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  desc TEXT,
  category TEXT,
  image TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER,
  image TEXT,
  alt TEXT,
  sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS company_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT NOT NULL,
  text TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

function columnExists(table, column) {
    return db
        .prepare(`PRAGMA table_info(${table})`)
        .all()
        .some((item) => item.name === column);
}

function addColumnIfMissing(table, column, definition) {
    if (columnExists(table, column)) return;
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function stripHtml(value) {
    return String(value || "")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function extractLegacySections(content) {
    const html = String(content || "");
    const sections = [];
    const pattern = /<h2[^>]*>(.*?)<\/h2>\s*<p[^>]*>(.*?)<\/p>/gis;
    let match = pattern.exec(html);

    while (match) {
        sections.push({
            title: stripHtml(match[1]),
            content: stripHtml(match[2])
        });
        match = pattern.exec(html);
    }

    if (sections.length === 0 && stripHtml(html)) {
        sections.push({
            title: "\u5167\u5bb9",
            content: stripHtml(html)
        });
    }

    return sections;
}

function migrateSchema() {
    addColumnIfMissing("news", "date", "TEXT");
    addColumnIfMissing("news", "award", "INTEGER DEFAULT 0");
    addColumnIfMissing("news", "award_title", "TEXT");
    addColumnIfMissing("news", "award_desc", "TEXT");
    addColumnIfMissing("news", "year", "TEXT");
    addColumnIfMissing("news_stats", "number", "TEXT");
    addColumnIfMissing("media_reports", "year", "TEXT");
    addColumnIfMissing("media_reports", "url", "TEXT");
    addColumnIfMissing("media_reports", "source", "TEXT");
    addColumnIfMissing("media_reports", "is_active", "INTEGER DEFAULT 1");
    addColumnIfMissing("projects", "desc", "TEXT");
    addColumnIfMissing("projects", "category", "TEXT");
    addColumnIfMissing("projects", "image", "TEXT");
    addColumnIfMissing("projects", "is_active", "INTEGER DEFAULT 1");
    addColumnIfMissing("company_history", "is_active", "INTEGER DEFAULT 1");

    if (columnExists("news", "published_date")) {
        db.exec(`
            UPDATE news
            SET date = COALESCE(NULLIF(date, ''), published_date)
            WHERE published_date IS NOT NULL
        `);
    }

    if (columnExists("news_stats", "value")) {
        db.exec(`
            UPDATE news_stats
            SET number = COALESCE(NULLIF(number, ''), value)
            WHERE value IS NOT NULL
        `);
    }

    db.exec(`
        UPDATE news
        SET year = COALESCE(NULLIF(year, ''), substr(date, 1, 4))
        WHERE date IS NOT NULL
    `);

    if (columnExists("news", "content")) {
        const legacyRows = db
            .prepare(`
                SELECT id, content
                FROM news
                WHERE content IS NOT NULL
                  AND NOT EXISTS (
                    SELECT 1
                    FROM news_sections
                    WHERE news_sections.news_id = news.id
                  )
            `)
            .all();

        const insertSection = db.prepare(`
            INSERT INTO news_sections (news_id, title, content, sort_order)
            VALUES (?, ?, ?, ?)
        `);

        legacyRows.forEach((row) => {
            extractLegacySections(row.content).forEach((section, index) => {
                insertSection.run(
                    row.id,
                    section.title,
                    section.content,
                    index + 1
                );
            });
        });
    }

    db.exec(`
        UPDATE media_reports
        SET year = COALESCE(NULLIF(year, ''), substr(date, 1, 4))
        WHERE date IS NOT NULL
    `);

    const projectCount = db.prepare("SELECT COUNT(*) AS count FROM projects").get();

    if (projectCount.count === 0) {
        const insertProject = db.prepare(`
            INSERT INTO projects (title, desc, category, image, is_active)
            VALUES (?, ?, ?, ?, 1)
        `);

        defaultProjectData.forEach((item) => {
            insertProject.run(
                item.title,
                item.desc,
                item.category,
                item.image
            );
        });
    }

    const projectsWithoutGallery = db
        .prepare(`
            SELECT id, title, image
            FROM projects
            WHERE image IS NOT NULL
              AND image != ''
              AND NOT EXISTS (
                SELECT 1
                FROM project_gallery
                WHERE project_gallery.project_id = projects.id
              )
        `)
        .all();
    const insertProjectImage = db.prepare(`
        INSERT INTO project_gallery (project_id, image, alt, sort_order)
        VALUES (?, ?, ?, 1)
    `);

    projectsWithoutGallery.forEach((item) => {
        insertProjectImage.run(item.id, item.image, item.title);
    });

    const historyCount = db
        .prepare("SELECT COUNT(*) AS count FROM company_history")
        .get();

    if (historyCount.count === 0) {
        const insertHistory = db.prepare(`
            INSERT INTO company_history (year, text, is_active)
            VALUES (?, ?, 1)
        `);

        defaultHistoryData.forEach((item) => {
            insertHistory.run(item.year, item.text);
        });
    }
}

migrateSchema();

function toBoolean(value) {
    return value === true || value === 1 || value === "1";
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeNewsPayload(body) {
    const date = body.date || "";

    return {
        slug: String(body.slug || "").trim(),
        category: body.category || "",
        title: String(body.title || "").trim(),
        date,
        views: Number(body.views || 0),
        readMinutes: Number(body.readMinutes || 3),
        award: toBoolean(body.award),
        awardTitle: body.awardTitle || "",
        awardDesc: body.awardDesc || "",
        year: body.year || String(date).slice(0, 4),
        coverImage: body.coverImage || "",
        sections: asArray(body.sections),
        stats: asArray(body.stats),
        features: asArray(body.features),
        gallery: asArray(body.gallery),
        relatedIds: asArray(body.relatedIds)
    };
}

function normalizeMediaPayload(body) {
    return {
        title: String(body.title || "").trim(),
        date: body.date || "",
        year: body.year || (body.date ? String(body.date).slice(0, 4) : ""),
        url: body.url || "",
        source: body.source || ""
    };
}

function normalizeProjectPayload(body) {
    return {
        title: String(body.title || "").trim(),
        desc: body.desc || "",
        category: body.category || "",
        image: body.image || "",
        gallery: asArray(body.gallery)
    };
}

function normalizeHistoryPayload(body) {
    return {
        year: String(body.year || "").trim(),
        text: String(body.text || "").trim()
    };
}

function requireAdminAuth(req, res, next) {
    const authHeader = req.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : "";

    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ message: "請先登入後台" });
    }

    next();
}

function getNewsBase(idOrSlug, includeInactive = false) {
    const isNumericId = /^\d+$/.test(String(idOrSlug));
    const where = [
        isNumericId ? "id = ?" : "slug = ?",
        includeInactive ? null : "is_active = 1"
    ]
        .filter(Boolean)
        .join(" AND ");

    return db
        .prepare(`
            SELECT
              id,
              slug,
              category,
              title,
              date,
              views,
              read_minutes AS readMinutes,
              award,
              award_title AS awardTitle,
              award_desc AS awardDesc,
              year,
              cover_image AS coverImage,
              is_active AS isActive
            FROM news
            WHERE ${where}
        `)
        .get(idOrSlug);
}

function getFullNews(idOrSlug, includeInactive = false) {
    const news = getNewsBase(idOrSlug, includeInactive);

    if (!news) return null;

    news.award = Boolean(news.award);
    news.isActive = Boolean(news.isActive);

    news.sections = db
        .prepare(`
            SELECT title, content
            FROM news_sections
            WHERE news_id = ?
            ORDER BY sort_order, id
        `)
        .all(news.id);

    news.stats = db
        .prepare(`
            SELECT number, label
            FROM news_stats
            WHERE news_id = ?
            ORDER BY sort_order, id
        `)
        .all(news.id);

    news.features = db
        .prepare(`
            SELECT content
            FROM news_features
            WHERE news_id = ?
            ORDER BY sort_order, id
        `)
        .all(news.id)
        .map((item) => item.content);

    news.gallery = db
        .prepare(`
            SELECT image, alt
            FROM news_gallery
            WHERE news_id = ?
            ORDER BY sort_order, id
        `)
        .all(news.id);

    news.relatedIds = db
        .prepare(`
            SELECT related_id
            FROM news_related
            WHERE news_id = ?
            ORDER BY id
        `)
        .all(news.id)
        .map((item) => item.related_id);

    return news;
}

function replaceChildRows(newsId, payload) {
    db.prepare("DELETE FROM news_sections WHERE news_id = ?").run(newsId);
    db.prepare("DELETE FROM news_stats WHERE news_id = ?").run(newsId);
    db.prepare("DELETE FROM news_features WHERE news_id = ?").run(newsId);
    db.prepare("DELETE FROM news_gallery WHERE news_id = ?").run(newsId);
    db.prepare("DELETE FROM news_related WHERE news_id = ?").run(newsId);

    const insertSection = db.prepare(`
        INSERT INTO news_sections (news_id, title, content, sort_order)
        VALUES (?, ?, ?, ?)
    `);
    const insertStat = db.prepare(`
        INSERT INTO news_stats (news_id, number, label, sort_order)
        VALUES (?, ?, ?, ?)
    `);
    const insertFeature = db.prepare(`
        INSERT INTO news_features (news_id, content, sort_order)
        VALUES (?, ?, ?)
    `);
    const insertGallery = db.prepare(`
        INSERT INTO news_gallery (news_id, image, alt, sort_order)
        VALUES (?, ?, ?, ?)
    `);
    const insertRelated = db.prepare(`
        INSERT INTO news_related (news_id, related_id)
        VALUES (?, ?)
    `);

    payload.sections.forEach((item, index) => {
        if (!item?.title && !item?.content) return;
        insertSection.run(newsId, item.title || "", item.content || "", index + 1);
    });

    payload.stats.forEach((item, index) => {
        if (!item?.number && !item?.label) return;
        insertStat.run(newsId, item.number || "", item.label || "", index + 1);
    });

    payload.features.forEach((item, index) => {
        const content = typeof item === "string" ? item : item?.content;
        if (!content) return;
        insertFeature.run(newsId, content, index + 1);
    });

    payload.gallery.forEach((item, index) => {
        if (!item?.image) return;
        insertGallery.run(newsId, item.image, item.alt || "", index + 1);
    });

    payload.relatedIds.forEach((relatedId) => {
        const id = Number(relatedId);
        if (!Number.isFinite(id) || id <= 0) return;
        insertRelated.run(newsId, id);
    });
}

function listNews(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";

    return db
        .prepare(`
            SELECT
              id,
              slug,
              category,
              title,
              date,
              COALESCE(NULLIF(year, ''), substr(date, 1, 4)) AS year,
              award,
              cover_image AS coverImage,
              is_active AS isActive
            FROM news
            ${where}
            ORDER BY date DESC, id DESC
        `)
        .all()
        .map((item) => ({
            ...item,
            award: Boolean(item.award),
            isActive: Boolean(item.isActive)
        }));
}

function listMedia(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";

    return db
        .prepare(`
            SELECT
              id,
              title,
              date,
              COALESCE(NULLIF(year, ''), substr(date, 1, 4)) AS year,
              url,
              source,
              is_active AS isActive
            FROM media_reports
            ${where}
            ORDER BY date DESC, id DESC
        `)
        .all()
        .map((item) => ({
            ...item,
            isActive: Boolean(item.isActive)
        }));
}

function getMedia(id, includeInactive = false) {
    const where = includeInactive ? "id = ?" : "id = ? AND is_active = 1";

    const item = db
        .prepare(`
            SELECT
              id,
              title,
              date,
              year,
              url,
              source,
              is_active AS isActive
            FROM media_reports
            WHERE ${where}
        `)
        .get(id);

    return item ? { ...item, isActive: Boolean(item.isActive) } : null;
}

function listProjects(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";

    const projects = db
        .prepare(`
            SELECT
              id,
              title,
              desc,
              category,
              image,
              is_active AS isActive
            FROM projects
            ${where}
            ORDER BY id DESC
        `)
        .all()
        .map((item) => ({
            ...item,
            isActive: Boolean(item.isActive)
        }));

    return projects.map((item) => ({
        ...item,
        gallery: getProjectGallery(item.id)
    }));
}

function getProject(id, includeInactive = false) {
    const where = includeInactive ? "id = ?" : "id = ? AND is_active = 1";
    const item = db
        .prepare(`
            SELECT
              id,
              title,
              desc,
              category,
              image,
              is_active AS isActive
            FROM projects
            WHERE ${where}
        `)
        .get(id);

    return item
        ? {
            ...item,
            isActive: Boolean(item.isActive),
            gallery: getProjectGallery(item.id)
        }
        : null;
}

function getProjectGallery(projectId) {
    return db
        .prepare(`
            SELECT image, alt
            FROM project_gallery
            WHERE project_id = ?
            ORDER BY sort_order, id
        `)
        .all(projectId);
}

function replaceProjectGallery(projectId, gallery) {
    db.prepare("DELETE FROM project_gallery WHERE project_id = ?").run(projectId);

    const insertGallery = db.prepare(`
        INSERT INTO project_gallery (project_id, image, alt, sort_order)
        VALUES (?, ?, ?, ?)
    `);

    gallery.forEach((item, index) => {
        if (!item?.image) return;
        insertGallery.run(projectId, item.image, item.alt || "", index + 1);
    });
}

function listHistory(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";

    return db
        .prepare(`
            SELECT
              id,
              year,
              text,
              is_active AS isActive
            FROM company_history
            ${where}
            ORDER BY CAST(year AS INTEGER) DESC, id DESC
        `)
        .all()
        .map((item) => ({
            ...item,
            isActive: Boolean(item.isActive)
        }));
}

function getHistoryItem(id, includeInactive = false) {
    const where = includeInactive ? "id = ?" : "id = ? AND is_active = 1";
    const item = db
        .prepare(`
            SELECT
              id,
              year,
              text,
              is_active AS isActive
            FROM company_history
            WHERE ${where}
        `)
        .get(id);

    return item ? { ...item, isActive: Boolean(item.isActive) } : null;
}

app.get("/api/health", (req, res) => {
    res.json({ ok: true, dbPath: DB_PATH });
});

app.get("/api/news", (req, res) => {
    res.json(listNews(false));
});

app.get("/api/news/:idOrSlug", (req, res) => {
    const news = getFullNews(req.params.idOrSlug, false);

    if (!news) {
        return res.status(404).json({ message: "News not found" });
    }

    db.prepare("UPDATE news SET views = views + 1 WHERE id = ?").run(news.id);
    res.json({ ...news, views: Number(news.views || 0) + 1 });
});

app.get("/api/media", (req, res) => {
    res.json(listMedia(false));
});

app.get("/api/projects", (req, res) => {
    res.json(listProjects(false));
});

app.get("/api/history", (req, res) => {
    res.json(listHistory(false));
});

app.post("/api/admin/login", (req, res) => {
    const username = String(req.body.username || "");
    const password = String(req.body.password || "");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "帳號或密碼錯誤" });
    }

    res.json({ token: ADMIN_TOKEN });
});

app.use("/api/admin", requireAdminAuth);

app.get("/api/admin/news", (req, res) => {
    res.json(listNews(true));
});

app.get("/api/admin/news/:id", (req, res) => {
    const news = getFullNews(req.params.id, true);

    if (!news) {
        return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
});

app.get("/api/admin/media", (req, res) => {
    res.json(listMedia(true));
});

app.get("/api/admin/media/:id", (req, res) => {
    const media = getMedia(req.params.id, true);

    if (!media) {
        return res.status(404).json({ message: "Media report not found" });
    }

    res.json(media);
});

app.get("/api/admin/projects", (req, res) => {
    res.json(listProjects(true));
});

app.get("/api/admin/projects/:id", (req, res) => {
    const project = getProject(req.params.id, true);

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
});

app.post("/api/admin/projects", (req, res) => {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const createProject = db.transaction(() => {
            const result = db
                .prepare(`
                    INSERT INTO projects (
                      title,
                      desc,
                      category,
                      image,
                      is_active
                    )
                    VALUES (?, ?, ?, ?, 1)
                `)
                .run(
                    payload.title,
                    payload.desc,
                    payload.category,
                    payload.image
                );

            replaceProjectGallery(result.lastInsertRowid, payload.gallery);
            return result.lastInsertRowid;
        });

        const id = createProject();

        res.status(201).json({
            message: "Project created",
            id
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Create failed" });
    }
});

app.put("/api/admin/projects/:id", (req, res) => {
    const payload = normalizeProjectPayload(req.body);

    if (!payload.title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const updateProject = db.transaction(() => {
            const result = db
                .prepare(`
                    UPDATE projects SET
                      title = ?,
                      desc = ?,
                      category = ?,
                      image = ?
                    WHERE id = ?
                `)
                .run(
                    payload.title,
                    payload.desc,
                    payload.category,
                    payload.image,
                    req.params.id
                );

            if (result.changes === 0) {
                return false;
            }

            replaceProjectGallery(Number(req.params.id), payload.gallery);
            return true;
        });

        if (!updateProject()) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project updated" });
    } catch (err) {
        res.status(400).json({ message: err.message || "Update failed" });
    }
});

app.delete("/api/admin/projects/:id", (req, res) => {
    const result = db
        .prepare("UPDATE projects SET is_active = 0 WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
});

app.get("/api/admin/history", (req, res) => {
    res.json(listHistory(true));
});

app.get("/api/admin/history/:id", (req, res) => {
    const item = getHistoryItem(req.params.id, true);

    if (!item) {
        return res.status(404).json({ message: "History item not found" });
    }

    res.json(item);
});

app.post("/api/admin/history", (req, res) => {
    const payload = normalizeHistoryPayload(req.body);

    if (!payload.year || !payload.text) {
        return res.status(400).json({ message: "Year and text are required" });
    }

    try {
        const result = db
            .prepare(`
                INSERT INTO company_history (year, text, is_active)
                VALUES (?, ?, 1)
            `)
            .run(payload.year, payload.text);

        res.status(201).json({
            message: "History item created",
            id: result.lastInsertRowid
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Create failed" });
    }
});

app.put("/api/admin/history/:id", (req, res) => {
    const payload = normalizeHistoryPayload(req.body);

    if (!payload.year || !payload.text) {
        return res.status(400).json({ message: "Year and text are required" });
    }

    try {
        const result = db
            .prepare(`
                UPDATE company_history SET
                  year = ?,
                  text = ?
                WHERE id = ?
            `)
            .run(payload.year, payload.text, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ message: "History item not found" });
        }

        res.json({ message: "History item updated" });
    } catch (err) {
        res.status(400).json({ message: err.message || "Update failed" });
    }
});

app.delete("/api/admin/history/:id", (req, res) => {
    const result = db
        .prepare("UPDATE company_history SET is_active = 0 WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ message: "History item not found" });
    }

    res.json({ message: "History item deleted" });
});

app.post("/api/admin/media", (req, res) => {
    const payload = normalizeMediaPayload(req.body);

    if (!payload.title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const result = db
            .prepare(`
                INSERT INTO media_reports (
                  title,
                  date,
                  year,
                  url,
                  source,
                  is_active
                )
                VALUES (?, ?, ?, ?, ?, 1)
            `)
            .run(
                payload.title,
                payload.date,
                payload.year,
                payload.url,
                payload.source
            );

        res.status(201).json({
            message: "Media report created",
            id: result.lastInsertRowid
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Create failed" });
    }
});

app.put("/api/admin/media/:id", (req, res) => {
    const payload = normalizeMediaPayload(req.body);

    if (!payload.title) {
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const result = db
            .prepare(`
                UPDATE media_reports SET
                  title = ?,
                  date = ?,
                  year = ?,
                  url = ?,
                  source = ?
                WHERE id = ?
            `)
            .run(
                payload.title,
                payload.date,
                payload.year,
                payload.url,
                payload.source,
                req.params.id
            );

        if (result.changes === 0) {
            return res.status(404).json({ message: "Media report not found" });
        }

        res.json({ message: "Media report updated" });
    } catch (err) {
        res.status(400).json({ message: err.message || "Update failed" });
    }
});

app.delete("/api/admin/media/:id", (req, res) => {
    const result = db
        .prepare("UPDATE media_reports SET is_active = 0 WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ message: "Media report not found" });
    }

    res.json({ message: "Media report deleted" });
});

app.post("/api/admin/news", (req, res) => {
    const payload = normalizeNewsPayload(req.body);

    if (!payload.slug || !payload.title) {
        return res.status(400).json({ message: "Slug and title are required" });
    }

    try {
        const createNews = db.transaction(() => {
            const result = db
                .prepare(`
                    INSERT INTO news (
                      slug,
                      category,
                      title,
                      date,
                      views,
                      read_minutes,
                      award,
                      award_title,
                      award_desc,
                      year,
                      cover_image,
                      is_active
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                `)
                .run(
                    payload.slug,
                    payload.category,
                    payload.title,
                    payload.date,
                    payload.views,
                    payload.readMinutes,
                    payload.award ? 1 : 0,
                    payload.awardTitle,
                    payload.awardDesc,
                    payload.year,
                    payload.coverImage
                );

            replaceChildRows(result.lastInsertRowid, payload);
            return result.lastInsertRowid;
        });

        const id = createNews();
        res.status(201).json({ message: "News created", id });
    } catch (err) {
        res.status(400).json({ message: err.message || "Create failed" });
    }
});

app.put("/api/admin/news/:id", (req, res) => {
    const payload = normalizeNewsPayload(req.body);

    if (!payload.slug || !payload.title) {
        return res.status(400).json({ message: "Slug and title are required" });
    }

    try {
        const updateNews = db.transaction(() => {
            const result = db
                .prepare(`
                    UPDATE news SET
                      slug = ?,
                      category = ?,
                      title = ?,
                      date = ?,
                      views = ?,
                      read_minutes = ?,
                      award = ?,
                      award_title = ?,
                      award_desc = ?,
                      year = ?,
                      cover_image = ?
                    WHERE id = ?
                `)
                .run(
                    payload.slug,
                    payload.category,
                    payload.title,
                    payload.date,
                    payload.views,
                    payload.readMinutes,
                    payload.award ? 1 : 0,
                    payload.awardTitle,
                    payload.awardDesc,
                    payload.year,
                    payload.coverImage,
                    req.params.id
                );

            if (result.changes === 0) {
                return false;
            }

            replaceChildRows(Number(req.params.id), payload);
            return true;
        });

        if (!updateNews()) {
            return res.status(404).json({ message: "News not found" });
        }

        res.json({ message: "News updated" });
    } catch (err) {
        res.status(400).json({ message: err.message || "Update failed" });
    }
});

app.delete("/api/admin/news/:id", (req, res) => {
    const result = db
        .prepare("UPDATE news SET is_active = 0 WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ message: "News not found" });
    }

    res.json({ message: "News deleted" });
});

app.listen(PORT, () => {
    console.log(`News API running: http://localhost:${PORT}`);
    console.log(`Database: ${DB_PATH}`);
});
