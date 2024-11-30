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
const material = new THREE.MeshPhongMaterial({color: 0xffffff})

// Il ne nous reste plus qu'à créer une instance mesh qui va utiliser geometry et material
const mesh = new THREE.Mesh(geometry, material)

// Pour utiliser le shader MeshPhongMaterial nous allons avoir besoin d'instancier une lumière
const light = new THREE.PointLight(0xeeeeee)

// On ajoute l'instance de mesh à la scene
scene.add(mesh)

// On ajoute la lumière à la scène pour qu'elle soit prise en compte par le moteur
scene.add(light)

// On positionne la caméra à l'aide de la propriété position (x, y, z)
camera.position.set(0, 0, 3)

// On positionne la lumière au même niveau que la caméra
light.position.set(0, 0, 3)

// On instancie le moteur de rendu en définissant la balise à utilsier
const renderer = new THREE.WebGLRenderer({canvas})

// On anime la propriété rotation de notre cube
loop()

function loop() {
  // La fonction requestAnimationFrame() va apppeler la fonction fourni en paramètre
  // à chaque fois que le navigateur a terminé un rendu
  requestAnimationFrame(loop)

  // A chaque frame nous allons jouer avec la rotation de l'axe x et y de notre cube
  mesh.rotation.y += 0.01
  mesh.rotation.x += 0.005

  // On lance une instruction pour effectuer un premier rendu en précisant la scène que l'on souhaite afficher et la caméra
  renderer.render(scene, camera)
}
