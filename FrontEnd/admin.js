function modified() {
const login = document.querySelector("#login");
const token = localStorage.getItem("token");
const filtres=document.querySelector(".filtres");
const btnModified=document.querySelector(".btnModified");

if (token) {
  // Utilisateur connecté → on transforme en "Logout"
  login.textContent = "Logout";
  if (filtres){
 // if pour l'independance de chaque instructions
    if (filtres) filtres.style.visibility = "hidden";
    if (btnModified) btnModified.style.display ="block"; // sinon effet "cascade" et une erreur stop tout
  };
  login.addEventListener("click", (event) => {  //Click sur logout
    event.preventDefault();
    localStorage.removeItem("token");// Supprime le token du localstorage
    window.location.reload();         // Recharge la page 
  });
} else {
  // Utilisateur non connecté  on garde "Login"
  login.textContent = "Login";
  login.href = "login.html";
}
}
modified()