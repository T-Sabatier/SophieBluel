const loginForm=document.querySelector(".loginForm")
loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    const email=event.target.querySelector("[name=email]").value;
    const password=event.target.querySelector("[name=password]").value;


const loginData={
    email:email,
    password:password
};
 fetch ("http://localhost:5678/api/users/login",{
method: "POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify(loginData)
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur d'authentification");
    }
    return response.json();
  })
  .then(resultat => {
    console.log("Réponse API :", resultat);
  localStorage.setItem("token", resultat.token); // stock le token 
  window.location.href = "index.html"; //Renvoi vers la page index 

  })
  .catch(error => {
    const msgError=document.querySelector("#messageErreur");
    msgError.innerText="Combinaison email/mot passe incorrect"
    console.log("erreur")
  
  })
});
