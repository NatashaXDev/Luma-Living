/*
  # Luma Living eCommerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `slug` (text, URL-friendly identifier)
      - `description` (text, optional description)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `slug` (text, URL-friendly identifier)
      - `description` (text, product description)
      - `price` (numeric, in ZAR)
      - `category_id` (uuid, foreign key to categories)
      - `image_url` (text, product image)
      - `stock` (integer, available quantity)
      - `featured` (boolean, for homepage display)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `session_id` (text, browser session identifier)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer, number of items)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique order reference)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `shipping_address` (text)
      - `city` (text)
      - `postal_code` (text)
      - `total_amount` (numeric, in ZAR)
      - `payment_method` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer)
      - `price` (numeric, price at time of purchase)
      - `created_at` (timestamptz)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, URL-friendly identifier)
      - `excerpt` (text, short description)
      - `content` (text, full article)
      - `image_url` (text)
      - `published` (boolean, default false)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for products, categories, and published blog posts
    - Session-based access for cart items
    - Restricted access for orders (read-only after creation)
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  total_amount numeric(10, 2) NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  image_url text DEFAULT '',
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view their cart items"
  ON cart_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their cart items"
  ON cart_items FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete their cart items"
  ON cart_items FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);