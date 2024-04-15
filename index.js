const express = require("express");
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const session = require('express-session');
const saltRounds = 10;

const path = require('path'); // Importation du module path

const port = process.env.PORT || 5000;

const app = express();
app.use(express.static('public'));  // Sert les fichiers statiques depuis le dossier `public`

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'votre_secret_ici',  // Choisissez un secret fort pour la production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Activez `secure` uniquement si vous êtes en HTTPS
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'velomax2',
});

connection.connect((err) => {
    if(err) {
        console.log("Erreur de connexion" + err.stack);
        return;
    }
    console.log("Connexion réussie à la bdd !");
});

// Route pour servir la page de connexion via GET

app.get('/index', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/connexion', (req, res) => {
    res.sendFile('connexion.html', { root: __dirname + '/public' });
});

app.get('/connexionAdmin', (req, res) => {
    res.sendFile('connexionAdmin.html', { root: __dirname + '/public' });
});

// Gérez la soumission du formulaire d'inscription
app.post('/inscription', async (req, res) => {
    const { nom, prenom, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `INSERT INTO Client (nom, prenom, email, Mdp_User) VALUES (?, ?, ?, ?)`;
        connection.query(query, [nom, prenom, email, hashedPassword], (err, results) => {
            if (err) {
                console.error("Erreur lors de l'insertion des données: ", err);
                res.send("Une erreur est survenue lors de l'inscription du client.");
            } else {
                console.log("Client inscrit avec succès !");
                res.send(`Client inscrit avec succès ! Nom : ${nom}, Prénom : ${prenom}`);
            }
        });
    } catch (error) {
        console.error("Erreur lors du hachage du mot de passe: ", error);
        res.send("Erreur lors du traitement de votre inscription.");
    }
});

// Route de connexion
app.post('/connexion', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT ID_Client, nom, prenom, Mdp_User AS hashedPassword FROM Client WHERE email = ?`;
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("Erreur lors de la requête: ", err);
            res.send("Une erreur est survenue lors de la tentative de connexion.");
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
                if (err) {
                    console.error("Erreur lors de la comparaison des mots de passe: ", err);
                    res.send("Une erreur est survenue lors de la tentative de connexion.");
                    return;
                }
                if (isMatch) {
                    req.session.userId = user.ID_Client;
                    req.session.username = user.nom;
                    res.redirect('/bienvenue');  // Redirigez vers une page de bienvenue
                } else {
                    res.send("Email ou mot de passe incorrect.");
                }
            });
        } else {
            res.send("Email ou mot de passe incorrect.");
        }
    });
});

app.get('/bienvenue', (req, res) => {
    if (!req.session.userId) {
        res.redirect('/connexion');
        return;
    }
    res.cookie('username', req.session.username, { httpOnly: false, secure: false }); // Secure à true si en HTTPS
    res.sendFile(path.join(__dirname, 'public', 'bienvenueUser.html'));
});

app.get('/bienvenueAdmin', (req, res) => {
    if (!req.session.userId) {
        res.redirect('/connexionAdmin');
        return;
    }
    res.cookie('username', req.session.username, { httpOnly: false, secure: false }); // Secure à true si en HTTPS
    res.sendFile(path.join(__dirname, 'public', 'bienvenueAdmin.html'));
});
// Route de déconnexion
app.get('/deconnexion', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Erreur lors de la déconnexion : ", err);
            res.send("Une erreur est survenue lors de la tentative de déconnexion.");
        } else {
            res.clearCookie('connect.sid');
            res.redirect('/index');
        }
    });
});



// Gérez la soumission du formulaire d'inscription des employés
app.post('/inscriptionAdmin', async (req, res) => {
    const { nom, prenom, Login_Employe, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = `INSERT INTO Employe (nom, prenom, Login_Employe, Mdp_Employe) VALUES (?, ?, ?, ?)`;
        connection.query(query, [nom, prenom, Login_Employe, hashedPassword], (err, results) => {
            if (err) {
                console.error("Erreur lors de l'insertion des données: ", err);
                res.send("Une erreur est survenue lors de l'inscription de l'employé.");
            } else {
                console.log("Employé inscrit avec succès !");
                res.send(`Employé inscrit avec succès ! Nom : ${nom}, Prénom : ${prenom}`);
            }
        });
    } catch (error) {
        console.error("Erreur lors du hachage du mot de passe: ", error);
        res.send("Erreur lors du traitement de votre inscription.");
    }
});


// Route de connexion employe 
app.post('/connexionAdmin', (req, res) => {
    const { Login_Employe, password } = req.body;
    const query = `SELECT ID_Employe, nom, prenom, Mdp_Employe AS hashedPassword FROM Employe WHERE Login_Employe = ?`;
    connection.query(query, [Login_Employe], (err, results) => {
        if (err) {
            console.error("Erreur lors de la requête admin: ", err);
            return res.send("Une erreur est survenue lors de la tentative de connexion admin.");
        }
        if (results.length > 0) {
            const user = results[0];
            console.log("User found:", user);
            bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
                if (err) {
                    console.error("Erreur lors de la comparaison des mots de passe admin: ", err);
                    return res.send("Une erreur est survenue lors de la tentative de connexion admin.");
                }
                if (isMatch) {
                    req.session.userId = user.ID_Employe; // Assurez-vous que c'est `ID_Employe` et non `id_Employe`
                    req.session.username = user.nom;
                    console.log("Session info:", req.session.userId, req.session.username);
                    return res.redirect('/bienvenueAdmin');
                } else {
                    return res.send("Login ou mot de passe admin incorrect.");
                }
            });
        } else {
            return res.send("Login ou mot de passe admin incorrect.");
        }
    });
});


// affiche les client 
app.get('/api/clients', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Non autorisé");
    }

    const query = "SELECT ID_Client, nom, prenom, email FROM Client;";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des clients: ", err);
            return res.status(500).send("Erreur lors de la récupération des données.");
        }
        res.json(results);
    });
});

// supprimer un clien 
app.delete('/api/clients/:id', (req, res) => {
    const { id } = req.params;
    if (!req.session.userId) {
        return res.status(401).send("Accès refusé");
    }

    const query = "DELETE FROM Client WHERE ID_Client = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression du client: ", err);
            return res.status(500).send("Erreur lors de la suppression du client.");
        }
        res.send("Client supprimé avec succès.");
    });
});

//modifier le clien
// Route pour modifier un client existant
app.post('/api/clients/edit/:id', (req, res) => {
    const { id } = req.params; // Récupère l'ID du client à modifier
    const { nom, prenom, email } = req.body; // Récupère les nouvelles valeurs depuis le corps de la requête

    if (!req.session.userId) {
        return res.status(401).send("Action non autorisée."); // Sécurité pour s'assurer que l'utilisateur est connecté
    }

    const query = `UPDATE Client SET nom = ?, prenom = ?, email = ? WHERE ID_Client = ?`;
    connection.query(query, [nom, prenom, email, id], (err, results) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du client: ", err);
            return res.status(500).send("Erreur lors de la modification du client.");
        }
        res.send("Client modifié avec succès !");
    });
});

// fin ici 
app.listen(port, () => {
    console.log(`Serveur est en ligne sur le port ${port}!`);
});
