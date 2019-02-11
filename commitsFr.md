- Commit 1:
  - Extraction des données du fichier JSON et affichage basique
	  - Problèmes rencontrés : La fonction d'extraction était exécutée après la fonction d'affichage des données du fait du comportement asynchrone de javascript

- Commit 2:
  - Ajout de commentaires oubliés au Commit 1
  - Ajout d'un système de votes
  - Mise à jour du score des deux chats affichés à l'écran à chaque fois qu'un vote a lieu (le gagnant voit son score augmenter et le perdant voit ses points diminuer selon le système de notation ELO utilisé par la FIDE actuellement)

- Commit 3:
  - Ajout d'un tableau des scores
  - Classement des chats par score
	  - Problèmes rencontrés : Si l'utilisateur clique rapidement et plusieurs fois sur un chat, plusieurs votes seront comptabilisés 

- Commit 4:
  - Refonte de la mise en page du site avec Bootstrap ajoutant un design responsive
  - Ajout de commentaires sur les fichiers html et css
	  - Problèmes rencontrés : Les icônes ajoutées en local à l'aide de Bootstrap ne pouvaient pas s'afficher sur le site (problème de format)