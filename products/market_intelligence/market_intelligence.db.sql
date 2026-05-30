-- Market Intelligence Database Schema
-- Run: sqlite3 market_intelligence.db < market_intelligence.db.sql

CREATE TABLE IF NOT EXISTS daily_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_date TEXT UNIQUE,
    top_trend TEXT,
    top_score INTEGER,
    all_trends TEXT,
    generated_at TEXT
);

CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    tier TEXT DEFAULT 'free',
    subscribed_at TEXT,
    last_sent TEXT
);

CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    trend TEXT,
    score INTEGER,
    reasoning TEXT
);
