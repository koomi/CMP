-- Cloudflare D1 Database Schema for Credit Management Platform

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    customerIds TEXT,
    customerNames TEXT,
    customerType TEXT,
    amount REAL,
    term INTEGER,
    rate TEXT,
    guaranteeType TEXT,
    status TEXT DEFAULT 'pending',
    stage TEXT DEFAULT 'pre',
    urgency TEXT DEFAULT 'normal',
    stageProgress TEXT DEFAULT '{"pre":0,"mid":0,"post":0}',
    remark TEXT,
    createdAt TEXT,
    endDate TEXT,
    drawDate TEXT,
    postLoanTaskDates TEXT,
    tasks TEXT,
    customerNo TEXT
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customerNo TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    accounts TEXT,
    type TEXT,
    contact TEXT,
    phone TEXT,
    address TEXT
);

-- Deposits table
CREATE TABLE IF NOT EXISTS deposits (
    id TEXT PRIMARY KEY,
    customerId TEXT,
    customerName TEXT,
    productName TEXT,
    type TEXT,
    amount REAL,
    rate REAL,
    ftpRate REAL,
    date TEXT,
    maturityDate TEXT
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    customerNo TEXT,
    dueDate TEXT,
    completed INTEGER DEFAULT 0
);

-- Options table (stores JSON for stages, statuses, terms, etc.)
CREATE TABLE IF NOT EXISTS options (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Auth table (simple password storage)
CREATE TABLE IF NOT EXISTS auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL,
    createdAt TEXT
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON projects(stage);
CREATE INDEX IF NOT EXISTS idx_projects_customerNo ON projects(customerNo);
CREATE INDEX IF NOT EXISTS idx_deposits_customerId ON deposits(customerId);
CREATE INDEX IF NOT EXISTS idx_tasks_customerNo ON tasks(customerNo);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
