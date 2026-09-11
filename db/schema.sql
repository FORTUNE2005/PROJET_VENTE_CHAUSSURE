-- Lucia Chaussures - PostgreSQL Migration
-- Run this against your Neon database

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL DEFAULT 0,
  originalprice NUMERIC,
  category TEXT NOT NULL DEFAULT 'baskets',
  colors TEXT NOT NULL DEFAULT '[]',
  sizes TEXT NOT NULL DEFAULT '[]',
  images TEXT NOT NULL DEFAULT '[]',
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 0,
  reviewcount INTEGER NOT NULL DEFAULT 0,
  isnew BOOLEAN NOT NULL DEFAULT false,
  isbestseller BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL DEFAULT '',
  material TEXT NOT NULL DEFAULT '',
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL,
  joindate DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  clientid TEXT NOT NULL DEFAULT '',
  customer TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'En attente',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  items TEXT NOT NULL DEFAULT '[]',
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  clientid TEXT NOT NULL,
  productid TEXT NOT NULL,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adresses (
  id TEXT PRIMARY KEY,
  clientid TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT 'Abidjan',
  isdefault BOOLEAN NOT NULL DEFAULT false,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  productid TEXT NOT NULL,
  clientid TEXT NOT NULL,
  clientname TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL DEFAULT 'Conseils',
  author TEXT NOT NULL DEFAULT 'Lucia',
  published BOOLEAN NOT NULL DEFAULT true,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_isnew ON products(isnew);
CREATE INDEX IF NOT EXISTS idx_products_isbestseller ON products(isbestseller);
CREATE INDEX IF NOT EXISTS idx_products_originalprice ON products(originalprice);
CREATE INDEX IF NOT EXISTS idx_orders_clientid ON orders(clientid);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_clientid ON favorites(clientid);
CREATE INDEX IF NOT EXISTS idx_favorites_productid ON favorites(productid);
CREATE INDEX IF NOT EXISTS idx_adresses_clientid ON adresses(clientid);
CREATE INDEX IF NOT EXISTS idx_reviews_productid ON reviews(productid);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
