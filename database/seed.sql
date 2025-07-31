-- Données initiales pour la base de données Red Bull Rampage

-- Insertion d'un administrateur par défaut
-- Mot de passe : Admin123! (à changer en production)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES 
('admin', 'admin@redbullrampage.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', 'admin');

-- Catégories du forum
INSERT INTO forum_categories (name, description, slug) VALUES
('Général', 'Discussions générales sur Red Bull Rampage', 'general'),
('Compétitions', 'Actualités et discussions sur les compétitions', 'competitions'),
('Matériel', 'Discussions sur le matériel VTT', 'materiel'),
('Techniques', 'Conseils et astuces techniques', 'techniques'),
('Vidéos et Photos', 'Partagez vos meilleurs moments', 'videos-photos');

-- Classement masculin 2024
INSERT INTO rankings (category, year, position, rider_name, country, points) VALUES
('men', 2024, 1, 'Kyle Strait', 'USA', 1000),
('men', 2024, 2, 'Brandon Semenuk', 'CAN', 950),
('men', 2024, 3, 'Kurt Sorge', 'CAN', 900),
('men', 2024, 4, 'Brett Rheeder', 'CAN', 850),
('men', 2024, 5, 'Thomas Genon', 'BEL', 800);

-- Classement féminin 2024
INSERT INTO rankings (category, year, position, rider_name, country, points) VALUES
('women', 2024, 1, 'Casey Brown', 'CAN', 1000),
('women', 2024, 2, 'Vaea Verbeeck', 'CAN', 950),
('women', 2024, 3, 'Jill Kintner', 'USA', 900),
('women', 2024, 4, 'Caroline Buchanan', 'AUS', 850),
('women', 2024, 5, 'Emilie Siegenthaler', 'SUI', 800);

-- Événements à venir
INSERT INTO events (title, description, location, start_date, end_date, is_featured) VALUES
('Red Bull Rampage 2024', 'La compétition de VTT freeride la plus extrême au monde', 'Virgin, Utah, USA', '2024-10-15 10:00:00', '2024-10-20 18:00:00', TRUE),
('Red Bull Formation', 'Événement féminin de VTT freeride', 'Virgin, Utah, USA', '2024-05-01 09:00:00', '2024-05-03 17:00:00', TRUE),
('Red Bull Rampage Qualifier', 'Qualifications pour le Red Bull Rampage', 'Barcelone, Espagne', '2024-08-20 09:00:00', '2024-08-22 18:00:00', FALSE);

-- Premier sujet de discussion
INSERT INTO forum_topics (category_id, user_id, title, slug, content, is_pinned) VALUES
(1, 1, 'Bienvenue sur le forum Red Bull Rampage', 'bienvenue-forum-redbull-rampage', 'Bienvenue à tous sur le forum officiel de Red Bull Rampage ! Partagez vos expériences, posez vos questions et discutez de votre passion pour le VTT freeride.', TRUE);
