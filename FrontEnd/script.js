// On cible la div qui contient les projets
const gallery = document.querySelector('.gallery');
//Affiche les projets dans la gallerie
 function afficherGallerie(works){
  //Vide la gallerie (pour les filtres
      gallery.innerText="";
//Parcours les projets de works
    works.forEach(work => {
      const figure = document.createElement('figure'); //Creer la balise 

      const img = document.createElement('img'); // Creer la balise
      img.src = work.imageUrl; //Lien vers img
      img.alt = work.title; //Lien vers le titre

      const caption = document.createElement('figcaption'); //Création le titre du projet
      caption.innerText = work.title; //Titre affiché sous l'img

      figure.appendChild(img); 
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

  }
  //Fonction chargement gallerie
async function loadGallery() {
  try {
    const response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }

    const works = await response.json();
    gallery.innerHTML = '';
    // Gestion des filtres
    //Recuperation des categories
    const categorie= works.map(article=> article.category.name)
    console.log(categorie)

    //Suppression des doublons
    const categorieUnique= [... new Set (categorie)];
    console.log(categorieUnique);

    //Cible le conteneur html (filtres)
    // Ajout propriété active au bouton
    const btnActive =(btn)=>{
      document.querySelectorAll(".filtres button").forEach(b => b.classList.remove('active'));
      btn.classList.add("active");
    }; 
    const filtres=document.querySelector(".filtres")
    const btnAll=document.createElement('button')

    btnAll.textContent="Tous";
    filtres.appendChild(btnAll)
    btnAll.addEventListener("click",()=>{
      afficherGallerie(works);
      btnActive(btnAll);
    })

    //Creation des boutons(filtres)
    categorieUnique.forEach (category=>{
    const bouton = document.createElement('button');
    bouton.textContent= category;
    filtres.appendChild(bouton);
    bouton.addEventListener("click",()=>{
    const projetsFiltres = works.filter(work => work.category.name === category);
    afficherGallerie(projetsFiltres)
    btnActive(bouton);
      
    })
    })
    afficherGallerie(works)
  
  } 
  
  catch (error) {
    console.error(error);
  }
}
  
// Appel de la fonction au chargement
loadGallery();

/*Recuperation du token
function getToken(){
token = localStorage.getItem("token");
console.log(token)
}*/

