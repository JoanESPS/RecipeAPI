# RecipeAPI
API de gestion de recettes de cuisines organisées par catégories.

Le rôle de cette API est de pouvoir stocker les recettes de cuisines que l'on souhaite avec leur source (livre de cuisine ou lien internet).

Par ailleurs elle permet aussi de pouvoir faire de la recherche de recette de cuisine selon les catégories renseignées, par exemple on peut afficher toutes les recettes de cuisine qui sont italiennes. Plus il y a de catégories demandées, plus c'est restrictif.


Cette API comporte 3 CRUD complet, les user, les recettes et les catégories.

Le CRUD user permet de créer des comptes utilisateurs, modérateurs ou administrateurs avec des autorisations différentes. On peut se connecter à ces comptes via un mot de passe et récupérer un JSON web token.

Les users peuvent utiliser les CRUD de recettes et catégories complets avec une restriction sur les PUT et DELETE qui ne fonctionnent que sur les recettes ajoutées par eux-même. Concernant le CRUD user, ils peuvent seulement modifier leur propre compte et se connecter.

Les modérateurs peuvent eux, en plus des possibilités des users, modifier et supprimer les recettes de n'importe quel user.

Les admins ont en plus des possibilités des moderateurs un accès en suppression, en modification et en visualisation des comptes user (le mot de passe sont crypté, personne n'y a accès).



Le lien du swagger pour afficher les routes et détails de fonctionnement de l'application: http://localhost:8081/api-docs/