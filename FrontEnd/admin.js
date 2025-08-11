function modified() {
const login = document.querySelector("#login");
const token = localStorage.getItem("token");
const filtres = document.querySelector(".filtres");
const btnModified = document.querySelector(".btnModified");
const modeEdit = document.querySelector(".modeEdit");

//Gestion de la deconnexion et de l'apparence du login/logout
if (token) {
  // Utilisateur connecté → on transforme en "Logout"
  login.textContent = "logout";
  if (filtres){ 
  filtres.style.visibility = "hidden";
  };
  login.addEventListener("click", (event) => {  //Click sur logout
    event.preventDefault();
    localStorage.removeItem("token");// Supprime le token du localstorage
    window.location.reload();         // Recharge la page 
  });
} else {
  // Utilisateur non connecté  on garde "Login"
  login.textContent = "login";
  login.href = "login.html";
}

//Ajout ou suppression d'objets
if(token) {
  modeEdit.style.display = "flex";
  btnModified.style.display ="flex"
}
else{
  modeEdit.style.display = "none"
  btnModified.style.display ="none"
}

}
modified()