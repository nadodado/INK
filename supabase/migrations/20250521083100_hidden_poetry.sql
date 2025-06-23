/*
  # Initial schema setup for INK Studio

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `phone` (text)
      - `contact_method` (text)
      - `contact_details` (text)
      - `booking_date` (date)
      - `booking_time` (text)
      - `description` (text)
      - `artist_id` (uuid, foreign key)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `gallery_items`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `style` (text)
      - `artist_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `artists`
      - `id` (uuid, primary key)
      - `name` (text)
      - `specialty` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  phone text,
  contact_method text NOT NULL,
  contact_details text,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  description text,
  artist_id uuid REFERENCES artists(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  style text NOT NULL,
  artist_id uuid REFERENCES artists(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to artists"
  ON artists
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage artists"
  ON artists
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to gallery items"
  ON gallery_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage gallery items"
  ON gallery_items
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public to create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage bookings"
  ON bookings
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to view their own bookings"
  ON bookings
  FOR SELECT
  TO public
  USING (
    auth.role() = 'authenticated' OR
    phone IS NOT NULL
  );