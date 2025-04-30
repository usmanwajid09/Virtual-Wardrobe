
-- Create Database
CREATE DATABASE VirtualWardrobeDB;
GO
USE VirtualWardrobeDB;
GO

-- Users Table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARBINARY(256) NOT NULL
);
GO

-- Clothes Table
CREATE TABLE Clothes (
    cloth_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    cloth_name VARCHAR(100),
    type VARCHAR(50),
    color VARCHAR(50),
    brand VARCHAR(100),
    season VARCHAR(50),
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Outfits Table
CREATE TABLE Outfits (
    outfit_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    outfit_name VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Outfit_Clothes (Many-to-Many)
CREATE TABLE Outfit_Clothes (
    outfit_id INT NOT NULL,
    cloth_id INT NOT NULL,
    PRIMARY KEY (outfit_id, cloth_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfits(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (cloth_id) REFERENCES Clothes(cloth_id) ON DELETE NO ACTION
);
GO

-- Events Table
CREATE TABLE Events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    event_name VARCHAR(100),
    event_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Event_Outfits
CREATE TABLE Event_Outfits (
    event_id INT NOT NULL,
    outfit_id INT NOT NULL,
    PRIMARY KEY (event_id, outfit_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (outfit_id) REFERENCES Outfits(outfit_id) ON DELETE NO ACTION
);
GO

-- Feedback Table
CREATE TABLE Feedback (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
GO

-- Suggestions Table
CREATE TABLE Suggestions (
    suggestion_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    outfit_id INT NULL,
    suggestion_text VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (outfit_id) REFERENCES Outfits(outfit_id) ON DELETE NO ACTION
);
GO

-- Sample Data (Insert Users)
INSERT INTO Users (username, email, password)
VALUES 
('usman', 'usman@example.com', HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'password123'))),
('aisha', 'aisha@example.com', HASHBYTES('SHA2_256', CONVERT(VARBINARY, 'mypassword')));

-- Sample Data (Clothes)
INSERT INTO Clothes (user_id, cloth_name, type, color, brand, season)
VALUES 
(1, 'Black Hoodie', 'Topwear', 'Black', 'Nike', 'Winter'),
(1, 'Blue Jeans', 'Bottomwear', 'Blue', 'Levis', 'All Season'),
(2, 'Floral Dress', 'One-piece', 'Red', 'Zara', 'Summer');

-- Sample Data (Outfits)
INSERT INTO Outfits (user_id, outfit_name)
VALUES 
(1, 'Casual Day Out'),
(2, 'Summer Picnic');

-- Sample Data (Outfit_Clothes)
INSERT INTO Outfit_Clothes (outfit_id, cloth_id)
VALUES 
(1, 1),
(1, 2),
(2, 3);

-- Sample Data (Events)
INSERT INTO Events (user_id, event_name, event_date)
VALUES 
(1, 'Job Interview', '2025-05-01'),
(2, 'Wedding', '2025-06-15');

-- Sample Data (Event_Outfits)
INSERT INTO Event_Outfits (event_id, outfit_id)
VALUES 
(1, 1),
(2, 2);

-- View 1: Top 5 Most Used Clothes in Outfits
CREATE VIEW Top5MostUsedClothes AS
SELECT TOP 5 c.cloth_name, COUNT(*) AS usage_count
FROM Outfit_Clothes oc
JOIN Clothes c ON oc.cloth_id = c.cloth_id
GROUP BY c.cloth_name;
GO

-- View 2: Upcoming Events within the Next 30 Days
CREATE VIEW UpcomingEvents AS
SELECT * FROM Events
WHERE event_date BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE());
GO

-- View 3: Detailed Outfits with Their Clothes
CREATE VIEW OutfitClothingDetails AS
SELECT o.outfit_name, c.cloth_name, c.type, c.color
FROM Outfits o
JOIN Outfit_Clothes oc ON o.outfit_id = oc.outfit_id
JOIN Clothes c ON oc.cloth_id = c.cloth_id
ORDER BY o.outfit_name;
GO

-- View 4: Most Popular Clothing Type
CREATE VIEW MostPopularClothingType AS
SELECT TOP 1 type, COUNT(*) AS count
FROM Clothes
GROUP BY type
ORDER BY count DESC;
GO

-- View 5: Number of Outfits Per User
CREATE VIEW UserOutfitCounts AS
SELECT u.username, COUNT(o.outfit_id) AS total_outfits
FROM Users u
LEFT JOIN Outfits o ON u.user_id = o.user_id
GROUP BY u.username;
GO

-- View 6: Average Feedback Rating
CREATE VIEW AverageFeedbackRating AS
SELECT AVG(rating) AS average_rating FROM Feedback;
GO

-- View 7: Upcoming Event and Assigned Outfits
CREATE VIEW UpcomingEventOutfits AS
SELECT e.event_name, e.event_date, o.outfit_name
FROM Events e
JOIN Event_Outfits eo ON e.event_id = eo.event_id
JOIN Outfits o ON eo.outfit_id = o.outfit_id
WHERE e.event_date >= GETDATE();
GO



select * from Top5MostUsedClothes ;