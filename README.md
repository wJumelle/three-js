# Découverte

## Vidéo 1
**[Tuto THREE.js](https://www.youtube.com/watch?v=vhK6o26OV4Q&list=WL&index=4) par Codeur de nuit**

### Théorie WebGL et Three.js
Three.js utilise l'api **WebGL** pour dialoguer avec la carte graphique.

Un modèle 3D est formé de plusieurs tableaux, que l'on appelle **attributs** :
* **POSITION** = La position des points (qui permet de former la géométrie)
* **NORMAL** = l'orientation des points qui permet de calculer le comportement de la lumière
* **UV** = la coordonnée de texture, qui permet tout simpplement de projeter une image sur une surface

La première étape est donc de transmettre à la carte un programme permettant de calculer la projection de ces points sur l'écran.
On appelle ce programme de calcul le **vertex shader**.

Ce programme va utiliser des variables afin de déterminer la position de ces points sur l'écran :
* **ModelMatrix** = matrice de position et d'orientation de la géométrie dans l'espace
* **ViewMatrix** = matrice de position et d'orientation de la caméra qui observe la scène
* **ProjMatrix** = matrice de la focale de la caméra pour simuler la perspective et calculer la projection des points sur l'écran
On apppelle ces variables **Uniforms**.

On peut transmettre donc 3 choses à la carte graphique :
* les **attributs**
* les **shaders**
* les **uniforms**

Une fois l'attribut **POSITION** projeter sur l'écran, les points forment des triangles.

Pour remplir les pixels formés par ses triangles nous allons nous servir d'un autre programme de calcul, le **pixel shader**.
A son tour, son programme va utiliser deux types de variables pour calculer la couleur de chaque pixel :
* l'**interpolation des attributs**
* des **uniforms** : matrices, couleurs (Vec3), vecteurs (Vec3), textures (Sample2D)

C'est au développeur de créer des variables et des calculs pertinents afin que le remplissage des pixels simule un matériaux.

Le role de l'API WebGL est de permettre au développeur d'envoyer des **uniforms**, des **attributs** et des **shader** afin d'utiliser
la puissance de la carte graphique pour effectuer des calculs sur des surfaces de pixels.
Et le **role de Three.js est d'abstraire toute la partie écriture des shaders, écriture d'attributs, calculs matriciels**.

En tant que développeur nous allons donc demander à Three.js d'afficher tel ou tel géométrie, avec tel position, tel angle de caméra, tel
lumière, tel matériaux etc. Malgré le niveau d'abstraction, il est bien sur important de comprendre les mécaniques qui se cachent derrière le
fonctionnement pour pouvoir optimiser notre projet.

Exemple :
* si on cherche à avoir un rendu simpliste (low poly) mais que nous avons des milliers d'objets à afficher sur l'écran nous allons faire des milliers
d'instructions (afin d'envoyer toutes les datas : lumières, angles, textures etc..) à envoyer à la CG ==> on fait ramer le CPU
* si on a très peu d'éléments mais avec des shaders très complexe et des surfaces de pixels très importantes à l'écran ==> on fait ramer le GPU

### Pratique
