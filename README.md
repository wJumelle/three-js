# Découverte

## Ressources

* [**SketchFab - Guinavarro**](https://sketchfab.com/guinavarro.al)

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

Attention, la documentation en français n'est pas entièrement traduite.
Il vaut donc mieux passer par la documentation en anglais.

`new THREE.Scene()` permet d'instancier la scène.

`new THREE.PerspectiveCamera(focal, screenRatio)` permet de définir notre caméra en précisant sa focale (70) et le ratio de l'écran (iw/ih).

`new THREE.BoxGeometry(width, height, depth)` sert à définir la géométrie de notre **mesh**. Dans notre cas nous avons définit une boite avec paramètre (1,1,1) ce qui correspond à un cube.

`new THREE.MeshBasicMaterial({color: 0xffffff})` définit un shader pour notre mesh. Ici nous ne précisons qu'une couleur pour notre cube.

`new THREE.Mesh(geometry, material)` instancie notre **mesh** en lui fournissant comme paramètre sa géométrie et son shader.

> Documentation autour de [**Mesh**](https://threejs.org/docs/?q=mesh#api/en/objects/Mesh), les mesh héritent de l'objet [**Object3D**](https://threejs.org/docs/?q=mesh#api/en/core/Object3D)

Il est possible d'instancier autant de **mesh** qu'on le souhaite à l'aide de la même **geometry** et du même **shader**.

`scene.add(mesh)` ajoute un nouveau mesh à notre scène.

`camera.position.set(x, y, z)` permet de setup la position de la caméra. Par défaut la position de la caméra est orientée selon l'axe **z**.
Si on ne repositionne pas la caméra après avoir afficher une première fois un élément il est probable de ne pas pouvoir observer cette élément dans l'espace, jouer avec la
valeur de **z** permet de l'avancer ou de la reculer et donc de le voir apparaitre.

`requestAnimationFrame()` est une fonction qui va être appelé par le navigateur à chaque fois que ce dernier a fini son rendu. Ainsi, on peut s'en servir pour animer frame / frame nos éléments.

Maintenant que nous avons jouer avec la rotation des axes de notre cube nous allons nous intéresser aux shader afin d'avoir quelque chose d'un peu moins basique.
Il y a déjà pas mal de choix au niveau des shaders trouvables dans la [**documentation au niveau des materials**](https://threejs.org/docs/index.html?q=material#api/en/materials/MeshBasicMaterial).
On peut bien évidemment en créer un personnalisé.

De notre coté, nous allons utiliser un shader capable de simuler l'éclairage sur les surface, **MeshPhongMaterial**.

`new THREE.MeshPhongMaterial({color: 0xffffff})` permet donc d'utiliser ce nouveau shader.

`new THREE.PointLight(0xeeeeee)` pour que notre nouveau shader fonctionne nous avons besoin d'ajouter une lumière, que l'on vient insérer ensuite dans la scène `scene.add(light)` et que l'on positionne au même niveau que notre cube `light.position.set(0, 0, 3)`.

Nous souhaitons ajouter des textures aux faces de notre cube. Pour se faire nous allons
devoir charger au préalable notre texture à l'aide de `new THREE.TextureLoader().load(path)`.
On utilise donc l'image en tant **qu'uniform** que l'on transmet au shader avec `new THREE.MeshPhongMaterial({map: texture})`. C'est alors que notre image vient s'appliquer aux surface des matériaux lors du rendu.

Maintenant nous allons utiliser une géométrie non procédurale, créé à la main avec chaque vertex (point) positionné manuellement.
Pour cela nous allons utiliser le package **GLTFLoader** mis à disposition par CodeurDeNuit sur Github `npm i github:codeurdenuit/GLTFLoader`.

De mon coté j'ai tenté d'importer Bulle, des supers nanas et sans réussite. J'ai donc rebasculer vers les fichiers présent dans le github du tuto. Il faudra tester avec le loader en addon pour track les erreurs, je n'ai pas l'impression que le loader
de Codeurdelanuit renvoie corresctement toutes les erreurs.

Sur **Blender** lors de l'obtention d'un fichier, il faut bien veiller à ce que certaines cases soit cocher lors de l'export afin que 3 tableaux nous soit mis à disposition :
* la position des points/vertex
* l'orientation des points/vertex
* les coordonnées de textures des points/vertex

Donc pour charger notre model 3D de Mario, nous devons charger 2 choses, notre nouveau tableau de vertex (sa géométrie) `await GLTFLoader.loadGeometry('./assets/mario/mario.glb')` et sa texture `new THREE.TextureLoader().load('./assets/mario/mario.png')`.
Il faudra ensuite un peu jouer avec la caméra et la lumière car l'objet n'est plus dans les mêmes dimensions.

```
camera.position.set(0, 1.5, 4)
light.position.set(0, 1, 2)
```

Tant que l'on respecte les formats donnés dans la doc (glTF, glb, FBX, OBJ, COLLADA) on peut charger autant de model 3D qu'on le souhaite.

Nous allons charger un nouveau model (bibi) et modifier une propriété du shader afin de faire disparaitre la brillance du matériaux.
```
const geometry = await GLTFLoader.loadGeometry('./assets/bibi/bibi.glb')
const texture = new THREE.TextureLoader().load('./assets/bibi/bibi.png')
const material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})
```

On passe maintenant à l'animation du model en découvrant les différentes techniques d'animations.
Pour cela nous allons utiliser un deuxième fichier **bibi2.glb**.

On déjà vu qu'il était possible de faire varier les matrices de transformation de nos mesh pour animer leurs positions, leurs rotations mais il est aussi possible de faire varier les positions de chaque vertex manuellement, on appelle ça du **morphing**.

Lorsque sur Blender on créé une animation avec plusieurs clés, pour chaque clés nous allons utiliser un tableau de vertex avec des positions différentes. Lorsque l'on réalise l'**export de la géométrie avec ses différentes versions de tableaux de vertex** et avec le **clip d'animation**, on réalise en réalité l'**export de la scène avec les différentes mesh, les animations, les lumières, les matériaux**.

Donc cette fois-ci nous avons exporter une scène avec un mesh donc nous ne devons pas charger une géométrie mais bien un mesh et sa géométrie `const mesh = await GLTFLoader.loadObject('./assets/bibi/bibi2.glb', 'bibi')`, pourquoi ? Tout simplement car l'animation n'est pas exclusivement lié à la géométrie mais bien aux deux.

Une fois que l'on a chargé la mesh, nous venons instancier ses matériaux `mesh.material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})`.

Pour exécuter l'animation nous allons utiliser un nouveau composant Three.js, l'**AnimationMixer**.
Le role de ce nouveau composant est d'instancier un player qui va nous permettre de jouer l'animation lié à un mesh.
On doit donc lui transmettre notre mesh de la façon suivante `const mixer = new THREE.AnimationMixer(mesh)`.

On indique plusieurs élément à notre player, l'animation que l'on souhaite jouer, sa durée et on lui demande de la jouer.
`mixer.clipAction(mesh.animations[0]).setDuration(5).play()`

Seulement ce n'est pas tout, pour pouvoir jouer correctement l'animation nous avons besoin d'une horloge qui va nous permettre de la synchroniser `const clock = new THREE.Clock()`.

C'est cette horloge qui va nous être utile dans la fonction loop.
En effet, pour chaque frame nous allons interroger l'horloge afin de connaitre le laps de temps qui sépare la frame précédente de l'actuelle. Et à l'aide de ce delta nous allons indiquer au player la progression du temps.
```
const dt = clock.getDelta()
mixer.update(dt)
```

Three.js gère l'animation de notre mesh, à chaque frame il interpole l'animation entre chaque clé.

Pour la deuxième méthode d'animation, nous allons prendre un autre fichier. Dans ce fichier on peut observer que notre bibi possède un **squelette** et une **géométrie**.
A chaque point de cette géométrie, nous avons des **os** avec un **coefficient de pondération**, on appelle ça le **skinning**.
Le skinning nous permet d'animer le squelette, soit par une animation **avec des clés** soit par une **animation procédurale**. Nous n'avons donc plus besoin d'animer chaque vertex un à un, on anime simplement les articulations crées.
En allant plus loin, on peut même **coupler** l'animation skinning avec l'animation **morphing** (on anime en interpolant entre plusieurs formes du modèle de base).

Lorsque l'on va jouer avec ce type de fichier (contenant le squelette etc), nous n'allons pas recevoir le **mesh** directement mais un objet 3D contenant toutes les informations nous intéressant.

Si on log l'objet 3D on peut apercevoir un tableau **animations** contenant 2 **AnimationClip**, un tableau **children** contenant 2 enfants **SkinnedMesh** et **Bone** et d'autres informations utiles.

Ainsi `const mesh = await GLTFLoader.loadObject('./assets/bibi/bibi2.glb', 'bibi')` nous transmet l'objet 3D et nous permet de récupérer **SkinnedMesh** à l'aide de `mesh.children[X]`.
C'est pour cette raison que l'on applique le matériaux sur `mesh.children[0].material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})`, cela n'aurait pas grand intérêt d'appliquer le matériaux sur les os.

Ensuite on a vu qu'on avait un tableau de 2 **AnimationClip**, nous allons donc devoir les animer toutes les deux. L'une est l'animation du squelette (se prénomme **walk** et c'est donc l'animation de **skinning**) et l'autre est l'animation de **morphing** et permet de faire cligner des yeux notre personnage.
```
mixer.clipAction(mesh.animations[0]).setDuration(3).play()
mixer.clipAction(mesh.animations[1]).setDuration(3).play()
```

Enfin dans le tuto il s'amuse à faire varier la rotation du personnage en Y en jouant avec une oscillation prenant en paramètre le **dt**.

Pour finir nous allons aborder le sujet de la génération procédurale.
Pour l'affichage de la géométrie nous allons utiliser le shader [**PointsMaterial**](https://threejs.org/docs/#api/en/materials/PointsMaterial) qui va nous permettre d'afficher uniquement les points.
Et donc il n'est pas nécessaire de générer les coordonnées de textures, l'orientation des faces etc, on va générer uniquement l'attribut position des points.

### Atelier 1 : création du mouvement de la caméra au clic sur des boutons pour s'approcher des points d'intérêt

Cela nécessite l'installation de GSAP : `npm install gsap`.

Ensuite pour gérer la position de caméra il nous suffit de l'animer à l'aide de `gsap.to()`.
Pour information, voici la documentation sur la [**fonction d'easing**](https://gsap.com/docs/v3/Eases/).

### Atelier 2 : export du build

Pour exporter le build nous avons besoin d'inclure le fichier .glb dans le build réalisé par Vite.
Donc pour cela dans notre fichier JS nous devons réaliser l'import du fichier et le passer en paramètre du loader.

```
import radio3DModel from './assets/radio/radio_light.glb';

const loader = new GLTFLoader()
loader.load(radio3DModel,
    function(gltf) { // Success },
    function(xhr) { // On process },
    function(error) {
        console.error('Erreur lors du chargement du fichier : ', error);
    }
);
```

Seulement, l'import du fichier nécessite la création d'un fichier de configuration Vite pour que l'extension
du fichier soit reconnue.
Nous créons donc à la racine du projet **decouverte** le fichier `vite.config.js` contenant les lignes suivantes.

```
export default {
    assetsInclude: ['**/*.gltf', '**/*.glb'],
}
```

Pour que le chemin des fichiers assets soit bien écrit dans les fichiers .js et .css nous devons ajouter une autre ligne de configuration afin de paramétrer le **base** du projet.

```
export default {
    [...]
    base: "./"
}
```
