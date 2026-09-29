import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
} from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { Mode, Paint, Rim, View } from '../data'

const MODEL_URL = '/models/car.glb'
const DRACO_URL = '/draco/'

const PALETTE = {
  night: { bg: '#08080a', floor: '#0b0b0d', mix: 28, env: 1 },
  studio: { bg: '#e8e6e2', floor: '#cfccc6', mix: 6, env: 1.6 },
}

const damp = (dt: number, speed: number) => 1 - Math.exp(-dt * speed)

function Car({ paint, rim }: { paint: Paint; rim: Rim }) {
  const { scene } = useGLTF(MODEL_URL, DRACO_URL)

  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: paint.hex,
        metalness: 0.85,
        roughness: paint.roughness,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.2,
      }),
      rim: new THREE.MeshStandardMaterial({ color: rim.hex, metalness: 1, roughness: rim.roughness }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#0c0d10',
        metalness: 0.3,
        roughness: 0.02,
        transparent: true,
        opacity: 0.55,
        envMapIntensity: 2,
      }),
    }),
    // Materials are created once and then animated toward new targets.
    [],
  )

  const model = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    const assign = (name: string, material: THREE.Material) => {
      root.getObjectByName(name)?.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) mesh.material = material
      })
    }
    assign('body', mats.body)
    assign('glass', mats.glass)
    for (const r of ['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr']) assign(r, mats.rim)
    return root
  }, [scene, mats])

  const target = useRef({
    body: new THREE.Color(paint.hex),
    bodyRough: paint.roughness,
    rim: new THREE.Color(rim.hex),
    rimRough: rim.roughness,
  })

  useEffect(() => {
    target.current.body.set(paint.hex)
    target.current.bodyRough = paint.roughness
  }, [paint])
  useEffect(() => {
    target.current.rim.set(rim.hex)
    target.current.rimRough = rim.roughness
  }, [rim])

  useFrame((_, dt) => {
    const k = damp(dt, 4)
    const t = target.current
    mats.body.color.lerp(t.body, k)
    mats.body.roughness += (t.bodyRough - mats.body.roughness) * k
    mats.rim.color.lerp(t.rim, k)
    mats.rim.roughness += (t.rimRough - mats.rim.roughness) * k
  })

  // The source model faces -Z; turn it so the front matches the camera presets.
  return <primitive object={model} rotation-y={Math.PI} />
}

function Turntable({ mode }: { mode: Mode }) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ring.current) return
    const m = ring.current.material as THREE.MeshBasicMaterial
    m.opacity = 0.55 + Math.sin(clock.elapsedTime * 1.2) * 0.15
  })
  const dark = mode === 'night'
  return (
    <group>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <cylinderGeometry args={[3.3, 3.3, 0.024, 128]} />
        <meshStandardMaterial color={dark ? '#0e0e10' : '#d6d3cd'} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh ref={ring} position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.28, 3.32, 128]} />
        <meshBasicMaterial color={dark ? '#e2b36a' : '#9c5a18'} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Stage({ mode }: { mode: Mode }) {
  const p = PALETTE[mode]
  const small = useThree((s) => s.size.width < 768)
  return (
    <>
      <color attach="background" args={[p.bg]} />
      <fog attach="fog" args={[p.bg, 16, 34]} />

      <ambientLight intensity={mode === 'night' ? 0.15 : 0.5} />
      <spotLight
        position={[0, 9, 0]}
        angle={0.55}
        penumbra={1}
        intensity={mode === 'night' ? 110 : 90}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Cinematic rim lights */}
      <spotLight position={[-7, 2.5, -5]} angle={0.6} penumbra={1} intensity={mode === 'night' ? 45 : 15} color="#ffb870" />
      <spotLight position={[7, 2.5, -4]} angle={0.6} penumbra={1} intensity={mode === 'night' ? 40 : 12} color="#8fb4ff" />


      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={small ? 512 : 1024}
          mixBlur={1}
          mixStrength={p.mix}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={p.floor}
          metalness={0.6}
          mirror={0}
        />
      </mesh>

      <Turntable mode={mode} />
      <ContactShadows position={[0, 0.03, 0]} scale={9} blur={2.4} far={2} opacity={mode === 'night' ? 0.9 : 0.6} resolution={1024} />

      <Environment key={mode} resolution={256} frames={1}>
        <color attach="background" args={[mode === 'night' ? '#050505' : '#bdbab4']} />
        {/* Ceiling light panels */}
        {[-3, -1, 1, 3].map((z) => (
          <Lightformer key={z} form="rect" intensity={2 * p.env} position={[0, 5, z * 1.6]} rotation-x={Math.PI / 2} scale={[8, 0.8, 1]} />
        ))}
        {/* Side softboxes */}
        <Lightformer form="rect" intensity={3 * p.env} position={[-6, 1.5, 0]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} color="#ffe2c4" />
        <Lightformer form="rect" intensity={2.4 * p.env} position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[12, 2, 1]} color="#dfe8ff" />
        <Lightformer form="ring" intensity={4 * p.env} position={[0, 4, -8]} scale={3} />
      </Environment>
    </>
  )
}

function CameraRig({
  view,
  autoRotate,
  onUserInteract,
}: {
  view: { v: View; n: number }
  autoRotate: boolean
  onUserInteract: () => void
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const animating = useRef(true)
  const pos = useRef(new THREE.Vector3())
  const tgt = useRef(new THREE.Vector3())
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Portrait screens need a wider lens and a bit more distance to fit the whole car.
  const aspect = useThree((s) => s.size.width / s.size.height)
  const portrait = aspect < 1
  const reach = portrait ? Math.min(1.2, 0.55 / aspect) : 1
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = portrait ? 42 : 32
    cam.updateProjectionMatrix()
  }, [camera, portrait])

  useEffect(() => {
    tgt.current.set(...view.v.target)
    pos.current.set(...view.v.position).sub(tgt.current).multiplyScalar(Math.max(1, reach)).add(tgt.current)
    if (reduced && controls.current) {
      camera.position.copy(pos.current)
      controls.current.target.copy(tgt.current)
      controls.current.update()
      animating.current = false
    } else {
      animating.current = true
    }
  }, [view, camera, reduced, reach])

  // OrbitControls sets touch-action: none, which would trap touch users inside the
  // full-screen hero. Keep vertical panning for the page; horizontal drags still orbit.
  useEffect(() => {
    gl.domElement.style.touchAction = 'pan-y'
  }, [gl])

  useFrame((_, dt) => {
    const c = controls.current
    if (!animating.current || !c) return
    const k = damp(dt, 2.6)
    camera.position.lerp(pos.current, k)
    c.target.lerp(tgt.current, k)
    c.update()
    if (camera.position.distanceTo(pos.current) < 0.01 && c.target.distanceTo(tgt.current) < 0.01) {
      animating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={2}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2 - 0.04}
      autoRotate={autoRotate && !reduced}
      autoRotateSpeed={0.55}
      onStart={() => {
        if (animating.current) {
          animating.current = false
          onUserInteract()
        }
      }}
    />
  )
}

export function Scene(props: {
  mode: Mode
  paint: Paint
  rim: Rim
  view: { v: View; n: number }
  autoRotate: boolean
  active: boolean
  onUserInteract: () => void
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop={props.active ? 'always' : 'never'}
      camera={{ position: [10, 3.6, 12], fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="Visualização 3D interativa do carro. Arraste para girar; use os botões de câmera para mudar o ângulo."
    >
      <Suspense fallback={null}>
        <Stage mode={props.mode} />
        <Car paint={props.paint} rim={props.rim} />
      </Suspense>
      <CameraRig view={props.view} autoRotate={props.autoRotate} onUserInteract={props.onUserInteract} />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL, DRACO_URL)
