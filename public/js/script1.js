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
    `;
}
