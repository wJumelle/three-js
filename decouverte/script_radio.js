import * as THREE from 'three'
import gsap from "gsap"
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

// Variables autour de la caméra
const nbCameraViews = 4;
let currentCameraView = 0;
const cameraViews = [{
        x: 130,
        y: 54,
        z: 391
    },
    {
        x: 187.11,
        y: -0.7,
        z: 290.3
    },
    {
        x: 7.48,
        y: 77.28,
        z: 233.9
    },
    {
        x: -128,
        y: 241.2,
        z: 300.1
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

// Définition des constantes pour la caméra
const CAMERA_FOV = 70
const CAMERA_ZOOM = 2.28
const CAMERA_NEAR = 70
const CAMERA_FAR = 10000048

// On ajoute une caméra en précisant la focal (ici 70) et le ratio de l'écran (définit ici par nos variable globale)
// La caméra va générer la matrice qui va transposer les objets du points de vue de l'observateur
const camera = new THREE.PerspectiveCamera(CAMERA_FOV, iw / ih, CAMERA_NEAR, CAMERA_FAR)

let renderer = null

// On ajoute un premier élément à l'image
const loader = new GLTFLoader()
loader.load('./assets/radio/radio_light.glb',
    function(gltf) {
        const radio = gltf.scene.children[0].children[0].children[0];

        // On récupère l'ensemble des mesh présent dans l'objet Radio
        const meshes = [];
        radio.traverse((child) => {
            if(child.name !== 'Radio' && child.type === 'Mesh') {
                meshes.push(child)
            }
        })

        // On ajoute la scène chargée à notre scène principale
        scene.add(gltf.scene)

        // Pour utiliser le shader MeshPhongMaterial nous allons avoir besoin d'instancier une lumière
        const lightFront = new THREE.PointLight(0xeeeeee, 10)

        // On ajoute la lumière à la scène pour qu'elle soit prise en compte par le moteur
        scene.add(lightFront)

        // On positionne la caméra à l'aide de la propriété position (x, y, z)
        camera.position.set(cameraViews[0].x, cameraViews[0].y, cameraViews[0].z)

        // On ajuste le regard de la caméra
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        // On ajuste le zoom
        camera.zoom = CAMERA_ZOOM
        camera.updateProjectionMatrix()
        console.log({camera});

        // On positionne la lumière au même niveau que la caméra
        lightFront.position.set(0, 1, 3)

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

            // Vérifier les intersections avec TOUS les meshes
            const intersects = raycaster.intersectObjects(meshes);

            // Si au moins un objet est touché, change sa couleur
            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;

                // Interaction 1 : Changer la couleur du matériau
                // Vérifie si le matériau est déjà unique, sinon clone-le
                // changeMeshColor(clickedMesh);

                // Interaction 2 : Ouverture d'une popin avec les informations de l'objet
                // actuellement remplacé par une alert basique
                alert(`Nom du mesh cliqué : ${clickedMesh.name}`);
            }
        });

        // On instancie le moteur de rendu en définissant la balise à utilsier
        renderer = new THREE.WebGLRenderer({
            canvas
        })
        animate()
    },
    function(xhr) {},
    function(error) {
        console.error('Erreur lors du chargement du fichier : ', error);
    }
);

/**
 * animate - Fonction permettant de mettre à jour le rendu de la scène
 */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
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
    const {
        id,
        value,
        dataset
    } = e.target;
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
    if (dataset.type === 'range') {
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
    const {
        id,
        value,
        dataset
    } = e.target;
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
    if (dataset.type === 'range') {
        input.nextElementSibling.value = input.value;
    } else {
        input.previousElementSibling.value = input.value;
    }
}

/**
 * changeMeshColor - Fonction permettant de gérer l'intéraction 1
 * @param {object} mesh
 */
function changeMeshColor(mesh) {
    if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material.clone();
    }

    // Appliquer la nouvelle couleur
    mesh.material = mesh.material.clone();
    mesh.material.color.set(getRandomColor());
}

/**
 * getRandomColor - Fonction permettant de générer une couleur aléatoire au format 0xRRGGBB
 * @returns {*} - Couleur aléatoire
 */
function getRandomColor() {
    return Math.floor(Math.random() * 16777215);
}
