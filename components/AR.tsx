// import { useRef, useEffect } from "react"
// import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight } from "three"
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js"

// export default function CarpetAR() {
//   const containerRef = useRef<HTMLDivElement | null>(null)

//   useEffect(() => {
//     const renderer = new WebGLRenderer({ antialias: true })
//     renderer.setSize(window.innerWidth, window.innerHeight)
//     renderer.xr.enabled = true
//     containerRef.current?.appendChild(renderer.domElement)

//     const scene = new Scene()
//     const camera = new PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     )

//     const light = new AmbientLight(0xffffff, 1)
//     scene.add(light)

//     const loader = new GLTFLoader()
//     loader.load("/persian-carpet.glb", (gltf) => {
//       scene.add(gltf.scene)
//     })

//     const arButton = ARButton.createButton(renderer)
//     document.body.appendChild(arButton)

//     const animate = () => {
//       renderer.setAnimationLoop(() => {
//         renderer.render(scene, camera)
//       })
//     }

//     animate()

//     return () => {
//       containerRef.current?.removeChild(renderer.domElement)
//     }
//   }, [])

//   return <div ref={containerRef}></div>
// }

import { useRef, useEffect } from "react"
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Group,
  Object3DEventMap,
} from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"

export default function CarpetAR() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    const light = new AmbientLight(0xffffff, 1)
    scene.add(light)

    let model: Group<Object3DEventMap> | null = null
    const loader = new GLTFLoader()
    loader.load("/path-to-your-model/carpet.glb", (gltf) => {
      model = gltf.scene
      model.scale.set(1, 1, 1) // Default size
      scene.add(model)
    })

    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

    // Interaction logic
    let isDragging = false
    let lastTouchX: number, lastTouchY: number

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        // Single finger drag
        isDragging = true
        lastTouchX = event.touches[0].clientX
        lastTouchY = event.touches[0].clientY
      } else if (event.touches.length === 2 && model) {
        // Pinch-to-zoom
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        model.userData.initialDistance = Math.sqrt(dx * dx + dy * dy)
        model.userData.initialScale = model.scale.x
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging && event.touches.length === 1 && model) {
        const deltaX = event.touches[0].clientX - lastTouchX
        const deltaY = event.touches[0].clientY - lastTouchY
        model.position.x += deltaX * 0.01 // Adjust multiplier for sensitivity
        model.position.y -= deltaY * 0.01 // Y-axis is inverted
        lastTouchX = event.touches[0].clientX
        lastTouchY = event.touches[0].clientY
      } else if (event.touches.length === 2 && model) {
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const scaleFactor = distance / model.userData.initialDistance
        model.scale.set(
          model.userData.initialScale * scaleFactor,
          model.userData.initialScale * scaleFactor,
          model.userData.initialScale * scaleFactor
        )
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
    }

    renderer.domElement.addEventListener("touchstart", (e) =>
      handleTouchStart(e)
    )
    renderer.domElement.addEventListener("touchmove", (e) => handleTouchMove(e))
    renderer.domElement.addEventListener("touchend", () => handleTouchEnd())

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      containerRef.current?.removeChild(renderer.domElement)
      document.body.removeChild(arButton)
    }
  }, [])

  return <div>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. In repellat totam quae aspernatur corrupti dolor quo similique rem aut architecto pariatur ullam cumque delectus, sint dolorum recusandae deleniti asperiores sequi?
    <div ref={containerRef} className="bg-red-500"></div>
  </div>
}
