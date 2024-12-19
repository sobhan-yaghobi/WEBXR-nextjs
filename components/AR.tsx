import { useRef, useEffect } from "react"
import { WebGLRenderer, Scene, PerspectiveCamera, AmbientLight } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"

export default function CarpetAR() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    containerRef.current?.appendChild(renderer.domElement)

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
      scene.add(gltf.scene)
    })

    const arButton = ARButton.createButton(renderer)
    document.body.appendChild(arButton)

    const animate = () => {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
      })
    }

    animate()

    return () => {
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef}></div>
}
