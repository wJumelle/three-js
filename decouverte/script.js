import * as THREE from 'three'
import GLTFLoader from 'gltfloader'

// Déclaration de notre scène, qui contiendra l'ensemble des éléments que l'on souhaite afficher
const scene = new THREE.Scene()

// On ajoute une caméra en précisant la focal (ici 70) et le ratio de l'écran (définit ici par nos variable globale)
// La caméra va générer la matrice qui va transposer les objets du points de vue de l'observateur
const camera = new THREE.PerspectiveCamera(70, iw/ih)

// On ajoute un premier élément à l'image
// Pour fonctionner, un mesh à besoin d'une géométrie
// On va donc générer procéduralement un tableau de point pour dessiner un cube
// Ex 1 : const geometry = new THREE.BoxGeometry(1, 1, 1)
// Ex 2 :const geometry = await GLTFLoader.loadGeometry('./assets/bibi/bibi.glb')
const mesh = await GLTFLoader.loadObject('./assets/bibi/bibi.glb', 'bibi')

// Pour le chargement des textures sur les faces de notre cube, nous avons d'abord
// besoin de charger une image en mémoire
// const texture = new THREE.TextureLoader().load('./assets/JinxCube.jpg')
const texture = new THREE.TextureLoader().load('./assets/bibi/bibi.png')

// Ensuite le mesh à besoin d'un shader pour matérialiser le tableau de point
// Ex 1 et 2 :const material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})
mesh.material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})

// Il ne nous reste plus qu'à créer une instance mesh qui va utiliser geometry et material
// Ex 1 et 2 : const mesh = new THREE.Mesh(geometry, material)

// Pour utiliser le shader MeshPhongMaterial nous allons avoir besoin d'instancier une lumière
const light = new THREE.PointLight(0xeeeeee)

// On ajoute l'instance de mesh à la scene
scene.add(mesh)

// On ajoute la lumière à la scène pour qu'elle soit prise en compte par le moteur
scene.add(light)

// On positionne la caméra à l'aide de la propriété position (x, y, z)
camera.position.set(0, 1.5, 4)

// On positionne la lumière au même niveau que la caméra
light.position.set(0, 1, 2)

// On instancie le moteur de rendu en définissant la balise à utilsier
const renderer = new THREE.WebGLRenderer({canvas})

// On instancie un player lié à notre mesh afin de jouer l'animation de ce dernier
const mixer = new THREE.AnimationMixer(mesh)

// On lui indique l'animation à suivre animations[0]
// La durée qui est en 5 frames setDuration(5)
// et on démarre
mixer.clipAction(mesh.animations[0]).setDuration(5).play()

// On instancie une horloge qui va nous permettre de synchroniser l'animation
const clock = new THREE.Clock()

// On anime la propriété rotation de notre cube
loop()

function loop() {
  // La fonction requestAnimationFrame() va apppeler la fonction fourni en paramètre
  // à chaque fois que le navigateur a terminé un rendu
  requestAnimationFrame(loop)

  // A chaque frame nous allons jouer avec la rotation de l'axe x et y de notre cube
  // Ex 1 et 2 : mesh.rotation.y += 0.01
  // Ex 1 et 2 : mesh.rotation.x += 0.005

  // A chaque frame nous intérogeons l'horloge pour connaitre le laps de temps depuis la dernière image
  const dt = clock.getDelta()

  // Et on indique en fonction de ce delta la progression du temps
  mixer.update(dt)

  // On lance une instruction pour effectuer un premier rendu en précisant la scène que l'on souhaite afficher et la caméra
  renderer.render(scene, camera)
}
