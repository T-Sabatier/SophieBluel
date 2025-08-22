const loginForm = document.querySelector(".loginForm");              // Sélectionner le formulaire de connexion

loginForm.addEventListener("submit", async function(event) {     // Écouter la soumission du formulaire
    event.preventDefault();                                      // Empêcher le rechargement de la page
    
    const email = event.target.querySelector("[name=email]").value;       // Récupérer la valeur du champ email
    const password = event.target.querySelector("[name=password]").value; // Récupérer la valeur du champ mot de passe
    
    try {
        const resultat = await loginUser(email, password);       // Envoyer les identifiants à l'API
        console.log("Réponse API :", resultat);                 // Logger la réponse pour debug
        
        sessionStorage.setItem("token", resultat.token);        // Sauvegarder le token de connexion
        window.location.href = "index.html";                    // Rediriger vers la page d'accueil
        
    } catch (error) {
        const msgError = document.querySelector("#msgErreur");         // Sélectionner l'élément d'affichage d'erreur
        msgError.innerText = "Erreur dans l'identifiant ou le mot de passe"; // Afficher message d'erreur à l'utilisateur
        console.log("erreur");                                  // Logger l'erreur en console
    }
});