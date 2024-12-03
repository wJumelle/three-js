import * as THREE from 'three'

// On instancie la scene
const scene = new THREE.Scene()

// On instancie la caméra
const camera = new THREE.PerspectiveCamera(70, iw/ih)

// On instancie la géométrie
const geometry = computeGeometry()

// On instancie le shader en précisant la taille des points
const material = new THREE.PointsMaterial({size:0.015, vertexColors: true})

// On instancie le mesh qui utilise la géométrie et le matériel
const mesh = new THREE.Points(geometry, material)

// On ajoute la mesh à la scène
scene.add(mesh)

// On positionne la caméra à l'aide de la propriété position (x, y, z)
camera.position.set(0, 1, 2)
camera.lookAt(0, -0.5, 0)

// On instancie le moteur de rendu en définissant la balise à utilsier
const renderer = new THREE.WebGLRenderer({canvas})

// On setup une clock pour l'animation
const clock = new THREE.Clock()
let t = 0

// On anime la propriété rotation de notre cube
loop()

function loop() {
  // On calcule le delta entre deux frame
  t += clock.getDelta()

  // On souhaite animer nos vertex en fonction de la variation t pour chaque frame
  animateGeometry(geometry, t)

  // On lance une instruction pour effectuer un premier rendu en précisant la scène que l'on souhaite afficher et la caméra
  renderer.render(scene, camera)

  requestAnimationFrame(loop)
}

function computeGeometry() {
  // On génère une surface de 4 sur 4
  const space = 4

  // Avec un découpage de 100 points par 100 points
  const nb = 100

  // Avec une variation d'amplitude de 0.1
  const amp = 0.1

  // Et une période de variation de 1
  const fre = 1

  const pi2 = Math.PI*2

  // On créé la géométrie que l'on retournera en résultat, par défaut elle est vide
  const geometry = new THREE.BufferGeometry()

  // On prépare le tableau de points de 100 pts par 100 pts avec chaque points en 3 dimensions
  const positions = new Float32Array(nb * nb * 3)

  // On a un tableau de couleur exactement pareil
  const colors = new Float32Array(nb * nb * 3)

  // On parcourt chaque point de notre surface, en largeur (i) et en longueur (j)
  let k = 0
  for(let i = 0; i < nb; i++) {
    for(let j = 0; j < nb; j++) {
      // Pour chaque vertex on va créer la position x, avec 0 comme centre de notre surface
      const x = i * (space/nb) - space/2

      // On fait la même chose pour la position z
      const z = j * (space/nb) - space/2

      // On fait varier la hauteur de notre surface (son amplitude) via une sinusoude baséee sur l'axe x
      // On ajoute une variation de l'amplitude par l'axe z
      const y = amp * (Math.cos(x * pi2 * fre) + Math.sin(z * pi2 * fre))

      // On rempli le tableau des positions
      positions[ 3 * k + 0 ] = x
      positions[ 3 * k + 1 ] = y
      positions[ 3 * k + 2 ] = z

      // On calcule l'intensité de la couleur des pixels en fonction de l'amplitude
      const intensity = (y/amp) / 2 + 0.3

      // On calcule la couleur RGB pour chaque point
      colors[ 3 * k + 0 ] = j / nb * intensity // Plus on avance sur l'axe x, on augmente la couleur rouge
      colors[ 3 * k + 1 ] = 0 // Ici ça correspond au vert
      colors[ 3 * k + 2 ] = i / nb * intensity // Plus on anvance sur l'axe z, on augmente la couleur bleu

      k++
    }
  }

  // Il ne nous reste plus qu'à transformer les tableaux positions et colors en attributs
  // de la géométrie qui sont nécessaire au shader que l'on utilise
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  return geometry
}

/**
 * animateGeometry - Fonction qui va permettre d'animer notre modèle 3D générer procéduralement
 * @param {*} geometry - Geométrie du modèle 3D
 * @param {*} progress - Progression du temps
 */
function animateGeometry(geometry, progress) {
  // On génère une surface de 4 sur 4
  const space = 4

  // Avec un découpage de 100 points par 100 points
  const nb = 100

  // Avec une variation d'amplitude de 0.1
  const amp = 0.1

  // Et une période que l'on fait varier en fonction du temps
  const fre = 0.8 + Math.cos(progress) / 2

  const pi2 = Math.PI*2

  // On ajoute un déphasage
  const phase = progress

  // On parcourt chaque point de notre surface, en largeur (i) et en longueur (j)
  let k = 0
  for(let i = 0; i < nb; i++) {
    for(let j = 0; j < nb; j++) {
      // Pour chaque vertex on va créer la position x, avec 0 comme centre de notre surface
      const x = i * (space/nb) - space/2

      // On fait la même chose pour la position z
      const z = j * (space/nb) - space/2

      // On fait varier la hauteur de notre surface (son amplitude) via une sinusoude baséee sur l'axe x
      // On ajoute une variation de l'amplitude par l'axe z
      const y = amp * (Math.cos(x * pi2 * fre + phase) + Math.sin(z * pi2 * fre + phase))

      // Pour chacun des points on va venir écraser la position Y par la nouvelle position
      geometry.attributes.position.setY(k, y)

      // On calcule l'intensité de la couleur des pixels en fonction de l'amplitude
      const intensity = (y/amp) / 2 + 0.3

      // Et on écrase l'ancienne couleur qui va varier en fonction de la hauteur du point
      // On calcule la couleur RGB pour chaque point
      geometry.attributes.color.setX(k, j / nb * intensity)
      geometry.attributes.color.setZ(k, i / nb * intensity)

      k++
    }
  }

  // On indique au moteur que la géométrie a été mise à jour et doit être rafraichie dans la VRAM
  geometry.attributes.position.needsUpdate = true
  geometry.attributes.color.needsUpdate = true
}
