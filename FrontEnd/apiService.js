//fonction pour se connecter
async function loginUser(email, password) {
    const response= await fetch ('http://localhost:5678/api/users/login',{
method: "POST",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({email,password})
})
  if (!response.ok) {
        throw new Error("Erreur d'authentification");
    }
    
    return response.json();
}

//fonction pour récuperer la gallerie
async function getWorks(){
 const response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }

    return response.json();
}

//fonction de suppression de projets
async function deleteWorks(workId){
    const token = sessionStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${workId}` , {
        method : "DELETE",
        headers :{
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok){
        throw new Error ("Erreur lors de la suppression");
    }
    return true;
}