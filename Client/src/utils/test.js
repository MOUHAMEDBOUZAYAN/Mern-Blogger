const db = require('../'); // Importez db.json

// Fonction pour filtrer par catégorie
function filtrerParCategorie(categorieId) {
  return db.articles.filter(article => article.categorie === categorieId);
}

// Exemple : Récupérer tous les articles "dev"
const articlesDev = filtrerParCategorie('dev');
console.log(articlesDev);