import Database from "better-sqlite3";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mediaData, newsData } from "../data/newsData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.NEWS_DB_PATH || join(__dirname, "news.db");
const db = new Database(DB_PATH);

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
`);

function columnExists(table, column) {
    return db
        .prepare(`PRAGMA table_info(${table})`)
        .all()
        .some((item) => item.name === column);
}

function addColumnIfMissing(table, column, definition) {
    if (!columnExists(table, column)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
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
}

function replaceChildRows(newsId, item) {
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

    item.sections?.forEach((section, index) => {
        insertSection.run(
            newsId,
            section.title || "",
            section.content || "",
            index + 1
        );
    });

    item.stats?.forEach((stat, index) => {
        insertStat.run(newsId, stat.number || "", stat.label || "", index + 1);
    });

    item.features?.forEach((feature, index) => {
        const content =
            typeof feature === "string" ? feature : feature?.content || "";
        if (content) {
            insertFeature.run(newsId, content, index + 1);
        }
    });

    item.gallery?.forEach((image, index) => {
        if (image.image) {
            insertGallery.run(newsId, image.image, image.alt || "", index + 1);
        }
    });

    item.relatedIds?.forEach((relatedId) => {
        insertRelated.run(newsId, Number(relatedId));
    });
}

migrateSchema();

const upsertNews = db.prepare(`
    INSERT INTO news (
      id,
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      category = excluded.category,
      title = excluded.title,
      date = excluded.date,
      views = excluded.views,
      read_minutes = excluded.read_minutes,
      award = excluded.award,
      award_title = excluded.award_title,
      award_desc = excluded.award_desc,
      year = excluded.year,
      cover_image = excluded.cover_image,
      is_active = 1
`);

const upsertMedia = db.prepare(`
    INSERT INTO media_reports (
      id,
      title,
      date,
      year,
      url,
      source,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      date = excluded.date,
      year = excluded.year,
      url = excluded.url,
      source = excluded.source,
      is_active = 1
`);

const seed = db.transaction(() => {
    newsData.forEach((item) => {
        upsertNews.run(
            item.id,
            item.slug,
            item.category,
            item.title,
            item.date,
            Number(item.views || 0),
            Number(item.readMinutes || 3),
            item.award ? 1 : 0,
            item.awardTitle || "",
            item.awardDesc || "",
            item.year || "",
            item.coverImage || ""
        );

        replaceChildRows(item.id, item);
    });

    mediaData.forEach((item) => {
        upsertMedia.run(
            item.id,
            item.title,
            item.date,
            item.year || String(item.date || "").slice(0, 4),
            item.url || "",
            item.source || ""
        );
    });
});

seed();

console.log(
    `Seeded ${newsData.length} news items and ${mediaData.length} media reports into ${DB_PATH}`
);
