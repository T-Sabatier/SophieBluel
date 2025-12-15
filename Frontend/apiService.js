// Fonction pour se connecter
async function loginUser(email, password) {
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        throw new Error("Erreur d'authentification");
    }
    
    return response.json();
}

// Fonction pour récupérer la galerie
async function getWorks() {
    const response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
    }

    return response.json();
}

// Fonction de suppression de projets
async function deleteWorks(workId) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
    }
    
    return true;
}

// Fonction ajouter un projet
async function addWork(title, imageFile, categoryId) {
    const token = sessionStorage.getItem("token");

    const infoProjet = new FormData();
    infoProjet.append("title", title);
    infoProjet.append("image", imageFile);
    infoProjet.append("category", categoryId);

    const response = await fetch('https://sophiebluel-api.onrender.com', {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: infoProjet
    });
    
    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout");
    }
    
    return response.json();
}

// Récupérer les catégories
async function getCategory() {
    const response = await fetch('http://localhost:5678/api/categories');

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération");
    }
    
    return response.json();
}