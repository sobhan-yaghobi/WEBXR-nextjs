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

//   return (
//     <div>
//       salam
//       <div ref={containerRef} className="bg-red-500"></div>
//     </div>
//   )
// }

import { useEffect, useRef, useState } from "react"
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default function ARPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isARSessionActive, setIsARSessionActive] = useState(false)

  useEffect(() => {
    // Check for AR support on the device
    if (navigator.xr) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((supported) => setIsSupported(supported))
        .catch(() => setIsSupported(false))
    } else {
      setIsSupported(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupported || !containerRef.current) return

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true

    const scene = new Scene()
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const light = new AmbientLight(0xffffff, 1)
    scene.add(light)

    const loader = new GLTFLoader()
    loader.load("/persian-carpet.glb", (gltf) => {
      const model = gltf.scene
      scene.add(model)
    })

    containerRef.current.appendChild(renderer.domElement)

    // Start the render loop
    renderer.setAnimationLoop(() => {
      if (isARSessionActive) {
        // Only render if AR session is active
        renderer.render(scene, camera)
      }
    })

    return () => {
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [isSupported, isARSessionActive])

  const startARSession = async () => {
    if (!navigator.xr) return

    // Create the renderer for AR
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.xr.enabled = true

    // Request AR session
    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        optionalFeatures: ["dom-overlay"],
      })

      // Set AR session to renderer
      renderer.xr.setSession(session)

      // Set the AR session active
      setIsARSessionActive(true)

      // Hide the button and show the AR view
      const mainElement: HTMLElement = document.querySelector(".main")!
      if (mainElement) {
        mainElement.style.display = "none" // Hide the button
      }

      // Optionally, go full-screen if you want the AR session to take up the entire screen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      }
    } catch (err) {
      console.error("Error starting AR session:", err)
    }
  }

  return (
    <div className="ar-page">
      <header className="header">
        <h1>View Carpet in AR</h1>
      </header>

      <main className="main" ref={containerRef}>
        {isSupported ? (
          <button className="custom-ar-button" onClick={startARSession}>
            Launch AR
          </button>
        ) : (
          <p>AR is not supported on this device.</p>
        )}
      </main>
    </div>
  )
}
