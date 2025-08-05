// script.js

// On cible la div qui contient les projets
const gallery = document.querySelector('.gallery');

async function loadGallery() {
  try {
    const response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }

    const works = await response.json();
    gallery.innerHTML = '';

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

  } catch (error) {
    console.error(error);
  }
}

// Appel de la fonction au chargement
loadGallery();


  const categorie= projets.map(article=> article.category.name)
  
  
  
  