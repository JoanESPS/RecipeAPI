# RecipeAPI
API for recipes management

Rôles:
  Users: 
	- Chaque user peut ajouter des recettes
	- Chaque user à les droits en lectures sur toute la table de recettes
	- Chaque user à les droits en modif / suppression sur ses propres recettes

  Modérateurs:
	- Possède les droits des users
	- Peut modifier / supprimer les recettes de n'importe quel user

  Admins:
	- Possède les droits des modérateurs
	- A des droits de modif/ban sur les comptes users

Base de données:
  Table 1 - Rôles:        Id / Type
  Table 2 - Utilisateurs: Username / email / password
  Table 3 - Recettes:     Id / Nom / accès / flags
Flags: (types de recette / chaud / froid / saison / notes / temps de préparation / temps de cuisson / temps total / difficulté / testé / date de dernière préparation / Commentaires / pour qui ?)
  Table 4 - Ingrédients:  Id / Nom / flags
Flags: (permanent ?/ saison / facile à trouver)
  Table 5 - Rôle/User:    Username / IdRôle
  Table 6 - Recette/Ingrédient: IdIngrédient / IdRecette
  Table 7 - Recette/Utilisateur: IdRecette / Username

CRUD:
  POST	 /api/auth/signup	signup new account
  POST	 /api/auth/signin	login an account
  POST   /api/recipe/online     add an online Marmiton recipe
  POST   /api/recipe/book       add a recipe from a book
  POST   /api/ingred/           add an ingredient
  GET	 /api/recipe/ 	        retrieve own's recipes
  GET    /api/recipe/name       retrieve own's recipes by name
  GET	 /api/recipe/user	retrieve User’s recipes
  GET	 /api/recipe/all	retrieve all recipes
  GET    /api/recipe/flag       retrieve own's recipes depending on flags
  GET    /api/recipe/ingr       retrieve own's recipes depending on ingredients
  GET    /api/ingred/           retrieve own's ingredients
  GET    /api/ingred/name       retrieve own's ingredient by name
  PUT    /api/recipe/id         modify own's recipes
  PUT    /api/ingred/id         modify own's ingredient
  PUT    /api/modo/user/recipe  modify user's recipes
  PUT    /api/modo/user/ingred  modify user's ingredients
  PUT    /api/user/password     modify user's password
  PUT    /api/user/email        modify user's email
  PUT    /api/admin/role        modify user's role
  DELETE /api/recipe/id         delete own's recipe
  DELETE /api/ingred/id         delete own's ingredient
  DELETE /api/modo/user/recipe  delete user's recipe
  DELETE /api/modo/user/ingred  delete user's ingred
  DELETE /api/admin/user        delete user's account and recipes
  DELETE /api/admin/all         delete all tables     
  
  



