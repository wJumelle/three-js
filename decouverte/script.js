import * as THREE from 'three'

// Déclaration de notre scène, qui contiendra l'ensemble des éléments que l'on souhaite afficher
const scene = new THREE.Scene()

// On ajoute une caméra en précisant la focal (ici 70) et le ratio de l'écran (définit ici par nos variable globale)
// La caméra va générer la matrice qui va transposer les objets du points de vue de l'observateur
const camera = new THREE.PerspectiveCamera(70, iw/ih)

// On ajoute un premier élément à l'image
// Pour fonctionner, un mesh à besoin d'une géométrie
// On va donc générer procéduralement un tableau de point pour dessiner un cube
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Ensuite le mesh à besoin d'un shader pour matérialiser le tableau de point
const material = new THREE.MeshBasicMaterial({color: 0xffffff})

// Il ne nous reste plus qu'à créer une instance mesh qui va utiliser geometry et material
const mesh = new THREE.Mesh(geometry, material)

// On ajoute l'instance de mesh à la scene
scene.add(mesh);

// On positionne la caméra à l'aide de la propriété position (x, y, z)
camera.position.set(0, 0, 3)

// On instancie le moteur de rendu en définissant la balise à utilsier
const renderer = new THREE.WebGLRenderer({canvas})

// On lance une instruction pour effectuer un premier rendu en précisant la scène que l'on souhaite afficher et la caméra
renderer.render(scene, camera)
