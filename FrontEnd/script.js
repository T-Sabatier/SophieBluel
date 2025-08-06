// On cible la div qui contient les projets
const gallery = document.querySelector('.gallery');
 function afficherGallerie(works){
      gallery.innerText="";
      
    works.forEach(work => {
      const figure = document.createElement('figure');

      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;

      const caption = document.createElement('figcaption');
      caption.innerText = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });

  }
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
    const filtres=document.querySelector(".filtres")
    const btnAll=document.createElement('button')
    btnAll.textContent="Tous";
    filtres.appendChild(btnAll)
    btnAll.addEventListener("click",()=>{
      afficherGallerie(works);
    })

    //Creation des boutons(filtres)
    categorieUnique.forEach (category=>{
    const bouton = document.createElement('button');
    bouton.textContent= category;
    filtres.appendChild(bouton);
    bouton.addEventListener("click",()=>{
    const projetsFiltres = works.filter(work => work.category.name === category);
    afficherGallerie(projetsFiltres)
      
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