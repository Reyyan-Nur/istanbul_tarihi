CREATE EXTENSION IF NOT EXISTS postgis; -- postgis etkinse hata vermeden devam

CREATE TABLE IF NOT EXISTS places (
    osm_id VARCHAR(70) PRIMARY KEY,
    places_name VARCHAR(100) NOT NULL,
    district VARCHAR(50),
    website VARCHAR(155),
    opening_hours VARCHAR(150),
    phone VARCHAR(40),
    religion VARCHAR(50),
    extra_tags JSONB,
    geom GEOGRAPHY(Point, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS places_category (
    osm_id VARCHAR(70) NOT NULL,
    category_id INTEGER NOT NULL, 
    PRIMARY KEY (osm_id, category_id),

    FOREIGN KEY (osm_id) REFERENCES places(osm_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);  

--geom için index oluşturma (mesafe ve konum bazlı aramada hızlı sonuç almak için)
CREATE INDEX IF NOT EXISTS idx_places_geom 
ON places 
USING GIST (geom);
