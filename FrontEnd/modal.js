// ========== SÉLECTION DES ÉLÉMENTS DOM ==========
const modalContainer = document.querySelector(".modalContainer");   // La modal entière
const modalTrigger = document.querySelectorAll(".trigger");         // Tous les boutons qui ouvrent/ferment la modal
const modalGallery = document.querySelector(".modalGallery");       // La zone d'affichage des projets dans la modal

// ========== ÉCOUTEURS D'ÉVÉNEMENTS ==========
// Pour chaque bouton "trigger", ajouter un écouteur de clic qui ouvre/ferme la modal
modalTrigger.forEach(trigger => trigger.addEventListener("click", toggleModal))

// ========== FONCTION PRINCIPALE D'OUVERTURE/FERMETURE MODAL ==========
function toggleModal(){
    // Ajoute ou supprime la classe "active" pour afficher/masquer la modal
    modalContainer.classList.toggle("active");

    // Si la modal vient de s'ouvrir (classe "active" présente)
    if (modalContainer.classList.contains("active")){
        loadModalGallery();  // Charger les projets dans la modal
        setupButtons();      // Activer les boutons de navigation
    } else {
        // Si la modal vient de se fermer → tout remettre à zéro
        resetModalForm();
    }
}

// ========== CHARGEMENT DES PROJETS DANS LA MODAL ==========
async function loadModalGallery() {
    console.log("Je vais récupérer les projets...");
    
    try {
        // Récupérer tous les projets depuis l'API
        const works = await getWorks(); 
        console.log("J'ai récupéré les projets !", works);
        
        // Afficher ces projets dans la modal
        afficherModalGallery(works);
    } catch (error) {
        console.error("Erreur:", error);
    }
}

// ========== AFFICHAGE DES PROJETS DANS LA MODAL ==========
function afficherModalGallery(works) {
    console.log("Je vais afficher", works.length, "projets");

    // Vider la galerie modal avant d'afficher
    modalGallery.innerHTML = "";

    // Pour chaque projet, créer un élément d'affichage
    works.forEach(work => {
        console.log("Creation img");
        
        // 1. Créer un conteneur pour l'image + bouton suppression
        const deleteContainer = document.createElement("div");
        deleteContainer.className = "imageContainer";
        
        // 2. Créer l'image du projet
        const image = document.createElement("img");
        image.src = work.imageUrl;  // URL de l'image
        
        // 3. Créer le bouton de suppression (icône poubelle)
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
        // Ajouter un écouteur de clic pour supprimer le projet
        deleteBtn.addEventListener("click", async () => {
            console.log("Suppression du projet ID:", work.id);
            
            try {
                // 1. Supprimer le projet en base de données via l'API
                await deleteWorks(work.id);
                
                // 2. Supprimer visuellement l'élément de la modal
                deleteContainer.remove();
                
                // 3. Recharger la galerie principale pour synchroniser
                loadGallery();
                
                console.log("Projet supprimé avec succès !");
                
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression du projet");
            }
        });

        // 4. Assembler : ajouter l'image et le bouton au conteneur
        deleteContainer.appendChild(image);
        deleteContainer.appendChild(deleteBtn);
        
        // 5. Ajouter le conteneur complet à la galerie modal
        modalGallery.appendChild(deleteContainer);
    });
}

// ========== NAVIGATION DANS LA MODAL ==========

// Fonction pour afficher la galerie (masquer le formulaire d'ajout)
function showGallery(){
    document.querySelector('.modalRemove').style.display = 'block';      // Afficher la galerie
    document.querySelector('.modalContentAdd').style.display = 'none';   // Masquer le formulaire
}

// Fonction pour afficher le formulaire d'ajout (masquer la galerie)
function showAddForm(){
    document.querySelector('.modalRemove').style.display = 'none';       // Masquer la galerie
    loadCategories();                                                     // Charger les catégories dans le select
    saveOriginalHTML();                                                   // Sauvegarder l'état original de la zone photo
    document.querySelector('.modalContentAdd').style.display = 'block';  // Afficher le formulaire

    // Ajouter l'écouteur pour la prévisualisation d'image
    const fileInput = document.querySelector("#image");
    fileInput.addEventListener("change", previewImg);
}

// Configuration des boutons de navigation dans la modal
function setupButtons() {
    const addBtn = document.querySelector('.addbtn');    // Bouton "Ajouter une photo"
    const backBtn = document.querySelector('.btnBack');  // Bouton "Retour"
    
    // Si le bouton "Ajouter" existe, lui associer la fonction showAddForm
    if (addBtn) {
        addBtn.addEventListener('click', showAddForm);
    }
    
    // Si le bouton "Retour" existe, lui associer la fonction showGallery
    if (backBtn) {
        backBtn.addEventListener('click', showGallery);
    }
}

// ========== CHARGEMENT DES CATÉGORIES ==========
async function loadCategories() {     
    try {         
        // Récupérer toutes les catégories depuis l'API
        const categories = await getCategory();
        
        // Trouver le menu déroulant des catégories et le vider
        const selectCategorie = document.querySelector("#category");  
        selectCategorie.innerHTML = "";  

        // Pour chaque catégorie, créer une option dans le menu déroulant
        categories.forEach(category => {     
            const option = document.createElement("option");           // Créer un élément <option>
            option.value = category.id;                                // Valeur = ID (envoyé à l'API)
            option.textContent = category.name;                        // Texte = nom (affiché à l'utilisateur)
            selectCategorie.appendChild(option);                       // Ajouter l'option au menu
        });      

    } catch (error) {         
        console.error("Erreur:", error);     
    } 
}

// ========== PRÉVISUALISATION D'IMAGE ==========
function previewImg(){
    // Récupérer l'input file et le fichier sélectionné
    const fileInput = document.querySelector("#image");
    const file = fileInput.files[0];  // Premier fichier sélectionné
    
    // Si aucun fichier n'est sélectionné, arrêter la fonction
    if (!file){
        return;
    }
    
    // Créer un FileReader pour lire le fichier
    const reader = new FileReader();
    
    // Définir ce qui se passe QUAND le fichier est lu
    reader.onload = function(event){
        // Récupérer l'URL de l'image créée par FileReader
        const imageUrl = event.target.result;
        
        // Créer un élément <img> pour l'aperçu
        const createImg = document.createElement("img");
        createImg.src = imageUrl;                           // Lui donner l'URL de l'image
        createImg.className = "image-preview";              // Lui donner une classe CSS
        
        // Remplacer le contenu de la zone photo par l'aperçu
        const photoContainer = document.querySelector(".photoContainer");
        photoContainer.innerHTML = "";                      // Vider la zone
        photoContainer.appendChild(createImg);              // Ajouter l'aperçu
    };
    
    // Demander à FileReader de commencer à lire le fichier
    reader.readAsDataURL(file);
}

// ========== SYSTÈME DE RESET ==========

// Variable globale pour mémoriser le HTML d'origine de la zone photo
let originalPhotoHTML = '';

// Fonction pour sauvegarder l'état d'origine de la zone photo
function saveOriginalHTML() {
    const photoContainer = document.querySelector('.photoContainer');
    
    // Si la zone existe ET qu'on n'a pas encore sauvegardé
    if (photoContainer && !originalPhotoHTML) {
        // Sauvegarder tout le contenu HTML (icône + texte + input)
        originalPhotoHTML = photoContainer.innerHTML;
    }
}

// Fonction pour remettre la modal à zéro (appelée à la fermeture)
function resetModalForm() {
    // 1. Retourner à l'affichage galerie
    showGallery();
    
    // 2. Vider tous les champs du formulaire
    const form = document.querySelector('.projetAdd');
    if (form) {
        form.reset();  // Méthode native pour vider un formulaire
    }
    
    // 3. Remettre la zone photo à son état d'origine
    const photoContainer = document.querySelector('.photoContainer');
    if (photoContainer && originalPhotoHTML) {
        // Restaurer le HTML sauvegardé (icône + texte + input)
        photoContainer.innerHTML = originalPhotoHTML;
    }
}