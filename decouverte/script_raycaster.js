import * as THREE from 'three'
import GLTFLoader from 'gltfloader'
import gsap from "gsap"

// Variables autour de la caméra
const nbCameraViews = 4;
let currentCameraView = 0;
const cameraViews = [
  {
    x: 0,
    y: 1.5,
    z: 4
  },
  {
    x: 6,
    y: 5,
    z: 7
  },
  {
    x: -6,
    y: 5,
    z: 4
  },
  {
    x: 0,
    y: 1.5,
    z: -10
  },
];

document.addEventListener('DOMContentLoaded', () => {
  // Gestion des boutons pour changer les vues
  const btnPrevView = document.getElementById('camera-controller__prev');
  const btnNextView = document.getElementById('camera-controller__next');

  btnPrevView.addEventListener('click', handleSwitchView);
  btnNextView.addEventListener('click', handleSwitchView);

  // Gestion de l'interface pour jouer directement avec la caméra
  document.querySelectorAll('.camera-inputs-position__container input[type=range]').forEach(input => input.addEventListener('change', handleCameraInputsPositionChange));
  document.querySelectorAll('.camera-inputs-position__container input[type=number]').forEach(input => input.addEventListener('change', handleCameraInputsPositionChange));
  document.querySelectorAll('.camera-inputs-angle__container input[type=range]').forEach(input => input.addEventListener('change', handleCameraInputsAngleChange));
  document.querySelectorAll('.camera-inputs-angle__container input[type=number]').forEach(input => input.addEventListener('change', handleCameraInputsAngleChange));
});

// Définition de variables globales afin de simplifier la démonstration
window.canvas = document.getElementById('canvas')
window.canvas.width = innerWidth
window.canvas.height = innerHeight
window.iw = innerWidth
window.ih = innerHeight

// Déclaration de notre scène, qui contiendra l'ensemble des éléments que l'on souhaite afficher
const scene = new THREE.Scene()

// On ajoute une caméra en précisant la focal (ici 70) et le ratio de l'écran (définit ici par nos variable globale)
// La caméra va générer la matrice qui va transposer les objets du points de vue de l'observateur
const camera = new THREE.PerspectiveCamera(70, iw/ih)

// On ajoute un premier élément à l'image
// Pour fonctionner, un mesh à besoin d'une géométrie
// On va donc générer procéduralement un tableau de point pour dessiner un cube
// Ex 1 : const geometry = new THREE.BoxGeometry(1, 1, 1)
// Ex 2 : const geometry = await GLTFLoader.loadGeometry('./assets/bibi/bibi.glb')
// Ex 3 : const mesh = await GLTFLoader.loadObject('./assets/bibi/bibi.glb', 'bibi')
const mesh = await GLTFLoader.loadObject('./assets/bibi/bibi2.glb', 'bibi')

// Pour le chargement des textures sur les faces de notre cube, nous avons d'abord
// besoin de charger une image en mémoire
// const texture = new THREE.TextureLoader().load('./assets/JinxCube.jpg')
const texture = new THREE.TextureLoader().load('./assets/bibi/bibi.png')

// Ensuite le mesh à besoin d'un shader pour matérialiser le tableau de point
// Ex 1 et 2 :const material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})
mesh.children[0].material = new THREE.MeshPhongMaterial({map: texture, shininess: 0})

// Il ne nous reste plus qu'à créer une instance mesh qui va utiliser geometry et material
// Ex 1 et 2 : const mesh = new THREE.Mesh(geometry, material)

// Pour utiliser le shader MeshPhongMaterial nous allons avoir besoin d'instancier une lumière
const lightFront = new THREE.PointLight(0xeeeeee, 10)

// On ajoute une lumière ambiante pour éclairer l'ensemble de la scène
const lightAmbient = new THREE.AmbientLight(0x404040, 10)

// On ajoute l'instance de mesh à la scene
scene.add(mesh)

// On ajoute la lumière à la scène pour qu'elle soit prise en compte par le moteur
scene.add(lightFront)

// On ajoute la lumière ambiante à la scène pour qu'elle soit prise en compte par le moteur
scene.add(lightAmbient)

// On positionne la caméra à l'aide de la propriété position (x, y, z)
camera.position.set(0, 1.5, 10)

// On ajuste le regard de la caméra
camera.lookAt(new THREE.Vector3(0, 0, 0))

// On positionne la lumière au même niveau que la caméra
lightFront.position.set(0, 1, 2)

// Initialisation du Raycaster et du vecteur de la souris
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Écouteur de clic
document.getElementById('canvas').addEventListener('click', (event) => {
    // Convertir la position de la souris en coordonnées normalisées (-1 à 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Lancer le rayon depuis la caméra
    raycaster.setFromCamera(mouse, camera);

    // Vérifier l'intersection avec l'objet cible
    const intersects = raycaster.intersectObject(mesh);

    for ( let i = 0; i < intersects.length; i ++ ) {
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
});

// On instancie le moteur de rendu en définissant la balise à utilsier
const renderer = new THREE.WebGLRenderer({canvas})

// On instancie un player lié à notre mesh afin de jouer l'animation de ce dernier
const mixer = new THREE.AnimationMixer(mesh)

// On lui indique l'animation à suivre animations[0]
// La durée qui est en 5 frames setDuration(5)
// et on démarre
// Ex 1 / 2 / 3 : mixer.clipAction(mesh.animations[0]).setDuration(5).play()
// On anime le skelette
mixer.clipAction(mesh.animations[0]).setDuration(3).play()
// On anime le morphing
mixer.clipAction(mesh.animations[1]).setDuration(3).play()

// On instancie une horloge qui va nous permettre de synchroniser l'animation
const clock = new THREE.Clock()

// On créé une légère oscillation au niveau de l'axe y
let t = 0

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

  // Met à jour la valeur de l'oscilation en fonction de dt
  t += dt

  // Et on applique la rotation
  mesh.rotation.y = Math.cos(t*Math.PI/4)/2

  // Et on indique en fonction de ce delta la progression du temps
  mixer.update(dt)

  // On lance une instruction pour effectuer un premier rendu en précisant la scène que l'on souhaite afficher et la caméra
  renderer.render(scene, camera)
}

/**
 * moveCameraPosition - Fonction permettant de déplacer la caméra
 * @param {number} px - Position en x
 * @param {number} py - Position en y
 * @param {number} pz - Position en z
 * @param {string} easingfunction - Fonction d'easing
 */
function moveCameraPosition(px, py, pz, easingfunction = "power2.inOut") {
  gsap.to(camera.position, {
      x: px,
      y: py,
      z: pz,
      duration: 2, // Durée en secondes
      ease: easingfunction,
      onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
  });

  // On met à jour le logger
  document.getElementById('logger').innerHTML =
  `
    ${document.getElementById('logger').innerHTML +
      `
        <p>Position de la caméra : x = <strong>${px}</strong>, y = <strong>${py}</strong>, z = <strong>${pz}</strong></p>
      `}
  `;
}

/**
 * moveCameraFocusPoint - Fonction permettant de déplacer la caméra
 * @param {object} vector - Vecteur de direction
 * @param {number} x - Position en x
 * @param {number} y - Position en y
 * @param {number} z - Position en z
 * @param {string} easingfunction - Fonction d'easing
 */
function moveCameraFocusPoint(vector, x, y, z, easingfunction = "power2.inOut") {
  gsap.to(vector, {
    x: x,
    y: y,
    z: z,
    duration: 2, // Durée de l'animation en secondes
    ease: easingfunction,
    onUpdate: () => {
        camera.lookAt(vector);
    }
  });

  // On met à jour le logger
  document.getElementById('logger').innerHTML =
  `
    ${document.getElementById('logger').innerHTML +
      `
        <p>Coordonnées du point de focus de la caméra : x = <strong>${x}</strong>, y = <strong>${y}</strong>, z = <strong>${z}</strong></p>
      `}
  `;
}

/**
 * handleSwitchView - Fonction permettant de gérer le changement de vue
 */
function handleSwitchView(e) {
  // On récupère la position à charger en fonction du bouton cliqué
  if (e.target.id === 'camera-controller__prev') {
    currentCameraView = currentCameraView === 0 ? nbCameraViews - 1 : currentCameraView - 1
  } else {
    currentCameraView = currentCameraView === nbCameraViews - 1 ? 0 : currentCameraView + 1
  }

  // On déplace la caméra
  moveCameraPosition(cameraViews[currentCameraView].x, cameraViews[currentCameraView].y, cameraViews[currentCameraView].z)
}

/**
 * handleCameraInputsPositionChange - Fonction permettant de gérer le changement de position de la caméra via l'interface
 * @param {object} e
 */
function handleCameraInputsPositionChange(e) {
  const { id, value, dataset } = e.target;
  const input = document.getElementById(id);
  let nextPositions = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  }

  // On met à jour la position en fonction de l'input modifié
  switch (id) {
    case 'camera-input-position__x':
    case 'camera-input-position-number__x':
      nextPositions.x = value;
      break;
    case 'camera-input-position__y':
    case 'camera-input-position-number__y':
      nextPositions.y = value;
      break;
    case 'camera-input-position__z':
    case 'camera-input-position-number__z':
      nextPositions.z = value;
      break;
  }

  // On déplace la caméra
  moveCameraPosition(nextPositions.x, nextPositions.y, nextPositions.z);

  // On met à jour la valeurs du champ associé
  if(dataset.type === 'range') {
    input.nextElementSibling.value = input.value;
  } else {
    input.previousElementSibling.value = input.value;
  }
}

/**
 * handleCameraInputsAngleChange - Fonction permettant de gérer le point focus par la caméra via l'interface
 * @param {object} e
 */
function handleCameraInputsAngleChange(e) {
  const { id, value, dataset } = e.target;
  const input = document.getElementById(id);
  const direction = camera.getWorldDirection(new THREE.Vector3());

  let nextFacingPointCoords = {
    x: direction.x,
    y: direction.y,
    z: direction.z
  }

  // On met à jour la position en fonction de l'input modifié
  switch (id) {
    case 'camera-input-angle__x':
    case 'camera-input-angle-number__x':
      nextFacingPointCoords.x = value;
      break;
    case 'camera-input-angle__y':
    case 'camera-input-angle-number__y':
      nextFacingPointCoords.y = value;
      break;
    case 'camera-input-angle__z':
    case 'camera-input-angle-number__z':
      nextFacingPointCoords.z = value;
      break;
  }

  // On déplace la caméra
  moveCameraFocusPoint(direction, nextFacingPointCoords.x, nextFacingPointCoords.y, nextFacingPointCoords.z);

  // On met à jour la valeurs du champ associé
  if(dataset.type === 'range') {
    input.nextElementSibling.value = input.value;
  } else {
    input.previousElementSibling.value = input.value;
  }
}
