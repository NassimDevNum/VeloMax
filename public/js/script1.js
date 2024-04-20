console.log("Script loaded");

const header = document.querySelector("header");
const footer = document.querySelector("footer");

if (header) {
    header.innerHTML = `
    <header>
        <h1>Bienvenue chez VeloMax</h1>
        <nav>
            <a href="/inscriptionClient.html">Inscription</a>
            <a href="/connexion.html">Connexion</a>
            <a href="/connexionAdmin.html">Connexion Admin</a>
            <a href="/inscriptionAdmin.html">Crée compte Admin</a>
        </nav>
    </header>
    `;
}

if (footer) {
    footer.innerHTML = `
    <footer>
        <p>&copy; 2024 VeloMax. Tous droits réservés.</p>
    </footer>
    `};



    document.addEventListener('DOMContentLoaded', function() {
        loadBikes();
    
        function loadBikes() {
            fetch('/api/bikes')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(bikes => {
                    const container = document.getElementById('velos-container');
                    bikes.forEach(bike => {
                        const bikeDiv = document.createElement('div');
                        bikeDiv.className = 'velo';
                        bikeDiv.innerHTML = `
                        <style>
                        .velo { margin-bottom: 20px; }
                        img { width: 200px; height: auto; }
                        .actions { margin-top: 10px; }
                    </style>  
                            <h2>${bike.Nom} (${bike.Grandeur})</h2>
                            <p>Prix: ${bike.Prix_Unitaire}€</p>
                            <img src="${bike.ImagePath}" alt="Image de ${bike.Nom}">
                        `;
                        container.appendChild(bikeDiv);
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des vélos:', error);
                    document.getElementById('velos-container').innerHTML = '<p>Erreur lors du chargement des vélos.</p>';
                });
            }
        });