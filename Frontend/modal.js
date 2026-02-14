// ========== SÉLECTION DES ÉLÉMENTS DOM ==========
const modalContainer = document.querySelector(".modalContainer");
const modalTrigger = document.querySelectorAll(".trigger");
const modalGallery = document.querySelector(".modalGallery");

// ========== ÉCOUTEURS D'ÉVÉNEMENTS ==========
modalTrigger.forEach(trigger => trigger.addEventListener("click", toggleModal)) // Pour chaque bouton "trigger", ajouter un écouteur de clic

// ========== FONCTION PRINCIPALE D'OUVERTURE/FERMETURE MODAL ==========
function toggleModal(){
    modalContainer.classList.toggle("active"); // Ajoute ou supprime la classe "active" pour afficher/masquer la modal

    if (modalContainer.classList.contains("active")){
        loadModalGallery();  // Charger les projets dans la modal
        setupButtons();      // Activer les boutons de navigation
    } else {
        resetModalForm();    // Si la modal vient de se fermer → tout remettre à zéro
    }
}

// ========== CHARGEMENT DES PROJETS DANS LA MODAL ==========
async function loadModalGallery() {
    console.log("Je vais récupérer les projets...");
    
    try {
        const works = await getWorks();  // Récupérer tous les projets depuis l'API
        console.log("J'ai récupéré les projets !", works);
        
        afficherModalGallery(works);     // Afficher ces projets dans la modal
    } catch (error) {
        console.error("Erreur:", error);
    }
}

// ========== AFFICHAGE DES PROJETS DANS LA MODAL ==========
function afficherModalGallery(works) {
    console.log("Je vais afficher", works.length, "projets");

    modalGallery.innerHTML = "";     // Vider la galerie modal avant d'afficher

    works.forEach(work => {          // Pour chaque projet, créer un élément d'affichage
        console.log("Creation img");
        
        const deleteContainer = document.createElement("div");     // Créer un conteneur pour l'image + bouton suppression
        deleteContainer.className = "imageContainer";
        
        const image = document.createElement("img");               // Créer l'image du projet
        image.src = work.imageUrl;
        
        const deleteBtn = document.createElement("button");        // Créer le bouton de suppression (icône poubelle)
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        
        deleteBtn.addEventListener("click", async () => {          // Ajouter un écouteur de clic pour supprimer le projet
            console.log("Suppression du projet ID:", work.id);
            
            try {
                await deleteWorks(work.id);     // Supprimer le projet en base de données via l'API
                deleteContainer.remove();       // Supprimer visuellement l'élément de la modal
                loadGallery();                  // Recharger la galerie principale pour synchroniser
                
                console.log("Projet supprimé avec succès !");
                
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression du projet");
            }
        });

        deleteContainer.appendChild(image);         // Assembler : ajouter l'image et le bouton au conteneur
        deleteContainer.appendChild(deleteBtn);
        
        modalGallery.appendChild(deleteContainer);  // Ajouter le conteneur complet à la galerie modal
    });
}

// ========== NAVIGATION DANS LA MODAL ==========
function showGallery(){
    document.querySelector('.modalRemove').style.display = 'block';      // Afficher la galerie
    document.querySelector('.modalContentAdd').style.display = 'none';   // Masquer le formulaire
}

function showAddForm(){
    document.querySelector('.modalRemove').style.display = 'none';       // Masquer la galerie
    loadCategories();                                                     // Charger les catégories dans le select
    saveOriginalHTML();                                                   // Sauvegarder l'état original de la zone photo
    document.querySelector('.modalContentAdd').style.display = 'block';  // Afficher le formulaire
    
    document.addEventListener("change", function(event) {                 // Ajouter l'écouteur pour la prévisualisation d'image
        if (event.target && event.target.id === "image") {
            previewImg();
        }
    });

    const projetSubmit= document.querySelector(".projetAdd");
    projetSubmit.addEventListener("submit",addForm);

    document.querySelector("#image").addEventListener("change", verifierChamps);
    document.querySelector("#title").addEventListener("input", verifierChamps);
    document.querySelector("#category").addEventListener("change", verifierChamps);
}

function setupButtons() {
    const addBtn = document.querySelector('.addbtn');    // Bouton "Ajouter une photo"
    const backBtn = document.querySelector('.btnBack');  // Bouton "Retour"
    
    if (addBtn) {
        addBtn.addEventListener('click', showAddForm);    // Si le bouton "Ajouter" existe, lui associer la fonction showAddForm
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', showGallery);   // Si le bouton "Retour" existe, lui associer la fonction showGallery
    }
}

// ========== CHARGEMENT DES CATÉGORIES ==========
async function loadCategories() {     
    try {         
        const categories = await getCategory();           // Récupérer toutes les catégories depuis l'API
        
        const selectCategorie = document.querySelector("#category");  // Trouver le menu déroulant des catégories
           
            selectCategorie.innerHTML = '<option value="">Choisir une catégorie</option>'  // Vide le cache

        categories.forEach(category => {                  // Pour chaque catégorie, créer une option dans le menu déroulant
            const option = document.createElement("option");
            option.value = category.id;                   // Valeur = ID (envoyé à l'API)
            option.textContent = category.name;           // Texte = nom (affiché à l'utilisateur)
            selectCategorie.appendChild(option);          // Ajouter l'option au menu
        });      

    } catch (error) {         
        console.error("Erreur:", error);     
    } 
}

// ========== PRÉVISUALISATION D'IMAGE ==========
function previewImg(){
    const fileInput = document.querySelector("#image"); // Récupérer l'input file et le fichier sélectionné
    const file = fileInput.files[0];
    
    if (!file){                                         // Si aucun fichier n'est sélectionné, arrêter la fonction
        return;
    }
    
    
if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image.webp') {
    afficherMessage("Seuls les fichiers PNG, JPG et JPEG sont autorisés !", "erreur");
    fileInput.value = "";
    return;
}


if (file.size > 4 * 1024 * 1024) {
    afficherMessage("Le fichier est trop volumineux ! Maximum 4Mo.", "erreur");
    fileInput.value = "";
    return;
}
    
    const reader = new FileReader();                    // Créer un FileReader pour lire le fichier
    
    reader.onload = function(event){                    // Définir ce qui se passe QUAND le fichier est lu
        const imageUrl = event.target.result;          // Récupérer l'URL de l'image créée par FileReader
        
        const createImg = document.createElement("img"); // Créer un élément <img> pour l'aperçu
        createImg.src = imageUrl;
        createImg.className = "image-preview";
        
        createImg.addEventListener("click",function(){
            fileInput.click();
        })
        
        const photoContainer = document.querySelector(".photoContainer"); // Remplacer le contenu de la zone photo par l'aperçu
        const ancienneImage = photoContainer.querySelector('.image-preview');
        if (ancienneImage) {
            ancienneImage.remove();
        }
        document.querySelector('.fa-image').style.display = 'none';
        document.querySelector('.customInput').style.display = 'none';
        document.querySelector('#image').style.display = 'none';
        document.querySelector('.fileInfo').style.display = 'none';                     
        photoContainer.appendChild(createImg);
    };
    
    reader.readAsDataURL(file);                         // Demander à FileReader de commencer à lire le fichier
}

// ========== SYSTÈME DE RESET ==========
let originalPhotoHTML = '';                             // Variable globale pour mémoriser le HTML d'origine de la zone photo

function saveOriginalHTML() {
    const photoContainer = document.querySelector('.photoContainer');
    
    if (photoContainer && !originalPhotoHTML) {         // Si la zone existe ET qu'on n'a pas encore sauvegardé
        originalPhotoHTML = photoContainer.innerHTML;   // Sauvegarder tout le contenu HTML (icône + texte + input)
    }
}

function resetModalForm() {
    showGallery();                                      // Retourner à l'affichage galerie
    
    const form = document.querySelector('.projetAdd'); // Vider tous les champs du formulaire
    if (form) {
        form.reset();
    }
    
    const photoContainer = document.querySelector('.photoContainer'); // Remettre la zone photo à son état d'origine
    if (photoContainer && originalPhotoHTML) {
        photoContainer.innerHTML = originalPhotoHTML;   // Restaurer le HTML sauvegardé (icône + texte + input)
    }
}

// ========== INITIALISATION DU FORMULAIRE ==========
const projetSubmit = document.querySelector(".projetAdd");              // Sélectionner le formulaire d'ajout
projetSubmit.addEventListener("submit", addForm);                        // Écouter la soumission du formulaire

// ========== SYSTÈME DE MESSAGES POPUP ==========
function afficherMessage(texte, type) {
    const popup = document.createElement('div');                         // Créer la fenêtre popup
    popup.className = `popup-message ${type}`;                          // Ajouter les classes CSS (popup-message + type)
    popup.textContent = texte;                                           // Définir le texte du message
    
    document.body.appendChild(popup);                                    // Ajouter le popup au DOM
    
    setTimeout(() => {                                                   // Faire disparaître après 3 secondes
        popup.remove();                                                  // Supprimer le popup du DOM
    }, 3000);
}

// ========== AJOUT D'UN NOUVEAU PROJET ==========
async function addForm(event) {
    event.preventDefault();                                              // Empêcher le rechargement de la page

    const img = document.querySelector("#image").files[0];               // Récupérer le fichier image sélectionné
    const title = document.querySelector("#title").value;               // Récupérer la valeur du titre
    const category = document.querySelector("#category").value;         // Récupérer la catégorie sélectionnée

    if (!img) {                                                          // Vérifier que tous les champs sont remplis
        afficherMessage("Veuillez sélectionner une image !", "erreur");
        return;
    }
    
    if (!title) {
        afficherMessage("Veuillez saisir un titre !", "erreur");
        return;
    }
    
    if (!category) {
        afficherMessage("Veuillez choisir une catégorie !", "erreur");
        return;
    }

    try {
        await addWork(title, img, category);                             // Envoyer les données à l'API
        const form = event.target;                                       // Récupérer le formulaire
        form.reset();                                                   // Vider tous les champs du formulaire

        document.querySelector(".btnSubmit button").style.backgroundColor = "#aca6a6"; 
        
        const photoContainer = document.querySelector('.photoContainer'); // Remettre la zone photo à son état initial
        if (photoContainer && originalPhotoHTML) {
            photoContainer.innerHTML = originalPhotoHTML;                // Restaurer l'affichage par défaut
        }
        
        afficherMessage("Projet ajouté avec succès !", "succes");       // Afficher message de succès
        loadGallery();                                                   // Recharger la galerie principale
        loadModalGallery();                                              // Recharger la galerie de la modal
        
    } catch (error) {
        console.error("Erreur lors de l'ajout:", error);                // Logger l'erreur en console
        afficherMessage("Erreur lors de l'ajout du projet", "erreur");  // Afficher message d'erreur à l'utilisateur
    }
}

// Validation du formulaire par changement de couleur bouton valider
function verifierChamps() {
    const image = document.querySelector("#image").files[0];
    const titre = document.querySelector("#title").value;
    const categorie = document.querySelector("#category").value;
    const bouton = document.querySelector(".btnSubmit button");
    


    if (image && titre && categorie) {
        bouton.style.backgroundColor = "#1D6154"; 
    } else {
        bouton.style.backgroundColor = "#aca6a6";
    }
}