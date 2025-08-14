const modalContainer = document.querySelector(".modalContainer");
const modalTrigger = document.querySelectorAll(".trigger");
const modalGallery = document.querySelector (".modalGallery");

modalTrigger.forEach(trigger => trigger.addEventListener("click",toggleModal))

function toggleModal (){
    modalContainer.classList.toggle ("active");

    if (modalContainer.classList.contains ("active")){
        loadModalGallery();
        setupButtons()
    }
  
}
//Chargement gallerie modal
async function loadModalGallery() {
    console.log("Je vais récupérer les projets...");
    
    try {
        const works = await getWorks(); 
        
        console.log("J'ai récupéré les projets !", works);

        afficherModalGallery(works);
    } catch (error) {
        console.error("Erreur:", error);
    }
}
// Affichage gallerie modal
function afficherModalGallery(works) {
    console.log("Je vais afficher", works.length, "projets");

    modalGallery.innerHTML = "";

    works.forEach(work => {
        console.log("Creation img");
        
        // 1. D'abord le conteneur
        const deleteContainer = document.createElement("div");
        deleteContainer.className="imageContainer"
        
        
        // 2. Puis l'image
        const image = document.createElement("img");
        image.src = work.imageUrl;
        
        // 3. Puis le bouton
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        

       deleteBtn.addEventListener("click", async () => {
    console.log("Suppression du projet ID:", work.id);
    
    try {
        // 1. Supprimer en base via l'API
        await deleteWorks(work.id);
        
        // 2. Supprimer visuellement de la modal
        deleteContainer.remove();
        
        // 3. Recharger la gallerie principale
        loadGallery();
        
        console.log("Projet supprimé avec succès !");
        
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du projet");
    }
});

        // 4. Assemblage
        deleteContainer.appendChild(image);
        deleteContainer.appendChild(deleteBtn);
        modalGallery.appendChild(deleteContainer);
        
    });
}

    
// Modal ajout projet

    function showGallery(){
        document.querySelector('.modalRemove').style.display='block';
        document.querySelector('.modalContentAdd').style.display='none';
    }
    function showAddForm(){
        document.querySelector('.modalRemove').style.display='none';
        document.querySelector('.modalContentAdd').style.display='block';
    }

    function setupButtons() {
    const addBtn = document.querySelector('.addbtn');
    const backBtn = document.querySelector('.btnBack');
    
    if (addBtn) {
        addBtn.addEventListener('click', showAddForm);
    }
    if (backBtn) {
        backBtn.addEventListener('click', showGallery);
    }
}