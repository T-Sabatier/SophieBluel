function modified() {
    const login = document.querySelector("#login");                      // Sélectionner le lien login/logout
    const token = sessionStorage.getItem("token");                      // Récupérer le token de connexion
    const filtres = document.querySelector(".filtres");                 // Sélectionner la zone des filtres
    const btnModified = document.querySelector(".btnModified");         // Sélectionner le bouton "modifier"
    const modeEdit = document.querySelector(".modeEdit");               // Sélectionner la barre "mode édition"
    
    // Gestion de la déconnexion et de l'apparence du login/logout
    if (token) {
        login.textContent = "logout";                                    // Utilisateur connecté → afficher "Logout"
        
        if (filtres) {
            filtres.style.visibility = "hidden";                        // Masquer les filtres en mode admin
        }
        
        login.addEventListener("click", (event) => {                     // Gérer le clic sur logout
            event.preventDefault();                                      // Empêcher la redirection par défaut
            sessionStorage.removeItem("token");                         // Supprimer le token du sessionStorage
            window.location.reload();                                    // Recharger la page pour actualiser l'interface
        });
    } else {
        login.textContent = "login";                                     // Utilisateur non connecté → afficher "Login"
        login.href = "login.html";                                       // Définir le lien vers la page de connexion
    }

    // Ajout ou suppression d'objets selon le statut de connexion
    if (token) {
        modeEdit.style.display = "flex";                                 // Afficher la barre "mode édition"
        btnModified.style.display = "flex";                             // Afficher le bouton "modifier"
    } else {
        modeEdit.style.display = "none";                                 // Masquer la barre "mode édition"
        btnModified.style.display = "none";                             // Masquer le bouton "modifier"
    }
}

modified();                                                              // Exécuter la fonction au chargement de la page