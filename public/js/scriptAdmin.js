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
    });
    function loadBikes() {
        fetch('/api/bikes')
            .then(response => response.json())
            .then(bikes => {
                const container = document.getElementById('velos-container');
                bikes.forEach(bike => {
                    const bikeDiv = document.createElement('div');
                    bikeDiv.className = 'velo';
                    bikeDiv.id = `bike-${bike.ID_Velo}`; // Assurez-vous que chaque vélo a un ID unique
    
                    bikeDiv.innerHTML = `
                        <style>
                            .velo { margin-bottom: 20px; }
                            img { width: 200px; height: auto; }
                            .actions { margin-top: 10px; }
                        </style>  
                        <h2 class="bike-nom">${bike.Nom} (${bike.Grandeur})</h2>
                        <p class="bike-prix">Prix: ${bike.Prix_Unitaire}€</p>
                        <img src="${bike.ImagePath}" alt="Image de ${bike.Nom}">
                        <button class='edit-button' data-bike-id='${bike.ID_Velo}'>Modifier</button>
                        <button class='delete-button' data-bike-id='${bike.ID_Velo}'>Supprimer</button>
                    `;
                    container.appendChild(bikeDiv);
                });
    
                // Attach event listeners to edit and delete buttons
                container.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', function() {
                        editBike(this.getAttribute('data-bike-id'));
                    });
                });
    
                container.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', function() {
                        deleteBike(this.getAttribute('data-bike-id'));
                    });
                });
            })
            .catch(error => console.error('Erreur lors de la récupération des vélos:', error));
    }
    
    function deleteBike(id) {
        fetch(`/api/bikes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Bike deleted successfully');
                // Ici, vous pouvez rafraîchir la liste des vélos ou afficher un message
            } else {
                throw new Error('Failed to delete bike');
            }
        })
        .catch(error => console.error('Error deleting bike:', error));
    }
    
    
function deleteBike(bikeId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vélo ?')) {
        fetch(`/api/bikes/${bikeId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Vélo supprimé avec succès');
                // Actualiser la liste des vélos
                location.reload();
            } else {
                throw new Error('Erreur lors de la suppression du vélo');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du vélo:', error);
        });
    }
}


//modifier le velo 
function editBike(bikeId) {
    const bikeDiv = document.getElementById(`bike-${bikeId}`);
    if (!bikeDiv) {
        console.error(`No bike found with ID 'bike-${bikeId}'`);
        return;
    }

    const nomElement = bikeDiv.querySelector('.bike-nom');
    const prixElement = bikeDiv.querySelector('.bike-prix');

    if (!nomElement || !prixElement) {
        console.error("Could not find bike details in the DOM");
        return;
    }

    const nom = nomElement.textContent;
    const prix = prixElement.textContent.match(/[\d,.]+/)[0]; // Extract the price part

    // Create a form in the DOM
    bikeDiv.innerHTML = `
        <form onsubmit="submitEdit(event, ${bikeId})">
            <input type="text" name="nom" value="${nom}">
            <input type="number" name="prix" value="${prix}" step="0.01">
            <button type="submit">Sauvegarder</button>
            <button type="button" onclick="cancelEdit(${bikeId})">Annuler</button>
        </form>
    `;
}


// function submitEdit(event, id) {
//     event.preventDefault();
//     const form = event.target;
//     const data = {
//         nom: form.nom.value,
//         grandeur: form.grandeur.value,
//         prix: form.prix.value
//     };

//     fetch(`/api/bikes/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error('Failed to update bike');
//     })
//     .then(() => {
//         // Recharge la liste des vélos ou rafraîchit la page
//         console.log('Bike updated successfully');
//         loadBikes();
//     })
//     .catch(error => console.error('Error updating bike:', error));
// }

function submitEdit(event, bikeId) {
    event.preventDefault();
    const form = event.target;
    const data = {
        nom: form.nom.value,
        prix: parseFloat(form.prix.value)
    };

    fetch(`/api/bikes/${bikeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update bike');
        loadBikes(); // Reload bikes to show updated info
    })
    .catch(error => {
        console.error('Error updating bike:', error);
        alert('Failed to update bike');
    });
}


function cancelEdit(id, nom, grandeur, prix) {
    const bikeDiv = document.querySelector(`#bike-${id}`);
    bikeDiv.innerHTML = `
        <h2>${nom}</h2>
        <p class="bike-grandeur">${grandeur}</p>
        <p class="bike-prix">${prix}</p>
        <button onclick="editBike(${id})">Modifier</button>
    `;
}

    // Route pour récupérer tous les vélos


