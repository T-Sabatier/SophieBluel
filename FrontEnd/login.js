const loginForm = document.querySelector(".loginForm");

loginForm.addEventListener("submit", async function(event) { // async ici !
    event.preventDefault();

    const email = event.target.querySelector("[name=email]").value;
    const password = event.target.querySelector("[name=password]").value;

    try {
        const resultat = await loginUser(email, password);
        console.log("Réponse API :", resultat);
        sessionStorage.setItem("token", resultat.token);
        window.location.href = "index.html";
    } catch (error) {
        const msgError = document.querySelector("#messageErreur");
        msgError.innerText = "Erreur dans l'identifiant ou le mot de passe";
        console.log("erreur");
    }
});