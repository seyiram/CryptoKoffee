-- CryptoKoffee Database Schema for Donation Caching
-- Supports PostgreSQL, MySQL, and SQLite

-- Donations table - core donation events
CREATE TABLE donations (
    id VARCHAR(255) PRIMARY KEY,
    amount DECIMAL(78, 0) NOT NULL, -- BigInt support
    donor VARCHAR(42) NOT NULL, -- Ethereum address
    recipient VARCHAR(42) NOT NULL, -- Ethereum address
    timestamp BIGINT NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    network VARCHAR(20) NOT NULL DEFAULT 'polygon',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient (recipient),
    INDEX idx_donor (donor),
    INDEX idx_timestamp (timestamp),
    INDEX idx_network (network),
    INDEX idx_tx_hash (transaction_hash)
);

-- Donor profiles - aggregated donor statistics
CREATE TABLE donor_profiles (
    address VARCHAR(42) PRIMARY KEY,
    total_donated DECIMAL(78, 0) NOT NULL DEFAULT 0,
    donation_count INT NOT NULL DEFAULT 0,
    first_donation_timestamp BIGINT,
    last_donation_timestamp BIGINT,
    networks JSON, -- Array of networks they've donated on
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_total_donated (total_donated),
    INDEX idx_donation_count (donation_count),
    INDEX idx_last_donation (last_donation_timestamp)
);

-- Recipient profiles - aggregated recipient statistics  
CREATE TABLE recipient_profiles (
    address VARCHAR(42) PRIMARY KEY,
    total_received DECIMAL(78, 0) NOT NULL DEFAULT 0,
    donation_count INT NOT NULL DEFAULT 0,
    unique_donor_count INT NOT NULL DEFAULT 0,
    first_donation_timestamp BIGINT,
    last_donation_timestamp BIGINT,
    networks JSON, -- Array of networks they've received on
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_total_received (total_received),
    INDEX idx_donation_count (donation_count),
    INDEX idx_unique_donors (unique_donor_count),
    INDEX idx_last_donation (last_donation_timestamp)
);

-- Donor-Recipient relationships - for top donors per recipient
CREATE TABLE donor_recipient_stats (
    id VARCHAR(255) PRIMARY KEY, -- recipient-donor composite
    donor VARCHAR(42) NOT NULL,
    recipient VARCHAR(42) NOT NULL,
    total_amount DECIMAL(78, 0) NOT NULL DEFAULT 0,
    donation_count INT NOT NULL DEFAULT 0,
    first_donation_timestamp BIGINT,
    last_donation_timestamp BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_recipient (recipient),
    INDEX idx_donor (donor),
    INDEX idx_total_amount (total_amount),
    INDEX idx_donation_count (donation_count),
    FOREIGN KEY (donor) REFERENCES donor_profiles(address) ON DELETE CASCADE,
    FOREIGN KEY (recipient) REFERENCES recipient_profiles(address) ON DELETE CASCADE
);

-- Daily statistics for analytics
CREATE TABLE daily_stats (
    date DATE PRIMARY KEY,
    total_donations DECIMAL(78, 0) NOT NULL DEFAULT 0,
    donation_count INT NOT NULL DEFAULT 0,
    unique_donors INT NOT NULL DEFAULT 0,
    unique_recipients INT NOT NULL DEFAULT 0,
    average_donation DECIMAL(78, 0) NOT NULL DEFAULT 0,
    network VARCHAR(20) NOT NULL DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_network (network)
);

-- Monthly statistics for analytics
CREATE TABLE monthly_stats (
    month VARCHAR(7) PRIMARY KEY, -- YYYY-MM format
    total_donations DECIMAL(78, 0) NOT NULL DEFAULT 0,
    donation_count INT NOT NULL DEFAULT 0,
    unique_donors INT NOT NULL DEFAULT 0,
    unique_recipients INT NOT NULL DEFAULT 0,
    average_donation DECIMAL(78, 0) NOT NULL DEFAULT 0,
    network VARCHAR(20) NOT NULL DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_month (month),
    INDEX idx_network (network)
);

-- Global statistics
CREATE TABLE global_stats (
    id VARCHAR(20) PRIMARY KEY DEFAULT 'global',
    total_donations DECIMAL(78, 0) NOT NULL DEFAULT 0,
    total_donation_count INT NOT NULL DEFAULT 0,
    total_unique_recipients INT NOT NULL DEFAULT 0,
    total_unique_donors INT NOT NULL DEFAULT 0,
    networks JSON, -- Stats per network
    last_updated BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync status tracking for The Graph integration
CREATE TABLE sync_status (
    network VARCHAR(20) PRIMARY KEY,
    last_synced_block BIGINT NOT NULL DEFAULT 0,
    last_synced_timestamp BIGINT NOT NULL DEFAULT 0,
    sync_in_progress BOOLEAN DEFAULT FALSE,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles from DynamoDB cache (optional - for faster queries)
CREATE TABLE user_profiles_cache (
    user_id VARCHAR(255) PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    custom_url TEXT,
    username VARCHAR(255),
    avatar TEXT,
    short_bio TEXT,
    custom_message TEXT,
    twitter_link TEXT,
    instagram_link TEXT,
    youtube_link TEXT,
    website_link TEXT,
    patreon_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE INDEX idx_wallet_address (wallet_address),
    INDEX idx_custom_url (custom_url),
    INDEX idx_username (username)
);

-- Insert initial global stats
INSERT INTO global_stats (id, last_updated) VALUES ('global', 0)
ON DUPLICATE KEY UPDATE id = id; -- MySQL
-- For PostgreSQL: ON CONFLICT (id) DO NOTHING;
-- For SQLite: ON CONFLICT (id) DO NOTHING;

-- Insert initial sync status for networks
INSERT INTO sync_status (network) VALUES 
    ('polygon'),
    ('arbitrum')
ON DUPLICATE KEY UPDATE network = network; -- MySQL
-- For PostgreSQL: ON CONFLICT (network) DO NOTHING;
-- For SQLite: ON CONFLICT (network) DO NOTHING;