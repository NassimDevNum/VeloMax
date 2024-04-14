-- Table des Magasins
CREATE TABLE Magasin (
    ID_Magasin INT PRIMARY KEY AUTO_INCREMENT,
    Nom_Magasin VARCHAR(255),
    Adresse VARCHAR(255),
    Telephone VARCHAR(15),
    Email VARCHAR(255)
);

-- Table des Employes
CREATE TABLE Employe (
    ID_Employe INT PRIMARY KEY AUTO_INCREMENT,
    Nom VARCHAR(255),
    Prenom VARCHAR(255),
    Type VARCHAR(20),
    Salaire_fixe DECIMAL(10,2),
    Prime DECIMAL(10,2),
    ID_Magasin INT,
    FOREIGN KEY (ID_Magasin) REFERENCES Magasin(ID_Magasin)
);


-- ajout à la main 
ALTER TABLE Employe
ADD Login_Employe VARCHAR(100),
ADD Mdp_Employe VARCHAR(255);


-- Table des Velos
CREATE TABLE Velo (
    ID_Velo INT PRIMARY KEY AUTO_INCREMENT,
    Numero_Produit VARCHAR(50),
    Nom VARCHAR(255),
    Grandeur VARCHAR(50),
    Prix_Unitaire DECIMAL(10,2),
    Date_Introduction DATE,
    Date_Discontinuation DATE,
    ID_Ligne_Produit INT
);

-- Table des Pieces Detachees
CREATE TABLE Piece_Detachee (
    ID_Piece INT PRIMARY KEY AUTO_INCREMENT,
    Numero_Produit VARCHAR(50),
    Description VARCHAR(255),
    Nom_Fournisseur VARCHAR(255),
    Numero_Catalogue_Fournisseur VARCHAR(50),
    Prix_Unitaire DECIMAL(10,2),
    Date_Introduction DATE,
    Date_Discontinuation DATE,
    Delai_Approvisionnement INT
);

-- Table des Commandes
CREATE TABLE Commande (
    ID_Commande INT PRIMARY KEY AUTO_INCREMENT,
    Date_Commande DATE,
    Adresse_Livraison VARCHAR(255),
    Date_Livraison DATE,
    ID_Magasin INT,
    ID_Client INT,
    FOREIGN KEY (ID_Magasin) REFERENCES Magasin(ID_Magasin),
    FOREIGN KEY (ID_Client) REFERENCES Client(ID_Client)
);

-- Table des Clients
CREATE TABLE Client (
    ID_Client INT PRIMARY KEY AUTO_INCREMENT,
    Nom VARCHAR(255),
    Prenom VARCHAR(255),
    Adresse VARCHAR(255),
    Ville VARCHAR(100),
    Code_Postal VARCHAR(10),
    Province VARCHAR(100),
    Telephone VARCHAR(15),
    Email VARCHAR(255)
);



-- ajout à la main 
ALTER TABLE Client
ADD Login_Utilisateur VARCHAR(100),
ADD Mdp_User VARCHAR(255);


-- Table des Fournisseurs
CREATE TABLE Fournisseur (
    ID_Fournisseur INT PRIMARY KEY AUTO_INCREMENT,
    Siret VARCHAR(20),
    Nom_Entreprise VARCHAR(255),
    Contact VARCHAR(255),
    Adresse VARCHAR(255),
    Qualificatif INT
);

-- Table des Programmes Fidelio
CREATE TABLE Programme_Fidelio (
    ID_Programme INT PRIMARY KEY AUTO_INCREMENT,
    Nom_Programme VARCHAR(255),
    Pourcentage_Rabais DECIMAL(5,2)
);
