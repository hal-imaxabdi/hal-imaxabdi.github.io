import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, PerformanceMonitor, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const palette = {
  light: { studio: "#a3a3a6", body: "#2a2a2e", shackle: "#d6d6da", hole: "#050505", net: "#0b0b0c", packet: "#111113", scan: "#0b0b0c", spark: "#0b0b0c" },
  dark: { studio: "#3a3a40", body: "#5a5a62", shackle: "#e6e6ea", hole: "#000000", net: "#e9e9ea", packet: "#e9e9ea", scan: "#ffffff", spark: "#ffffff" },
};

const SHACKLE_R = 0.5;
const LEG = 0.55;

// A chrome padlock. Hovering or clicking unlocks it: the shackle lifts and swings open.
function Padlock({ colors, reduced }) {
  const shackle = useRef();
  const body = useRef();
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const unlocked = hovered || open;

  useFrame((_, delta) => {
    const s = shackle.current;
    s.position.y = THREE.MathUtils.damp(s.position.y, 0.62 + (unlocked ? 0.38 : 0), 7, delta);
    s.rotation.y = THREE.MathUtils.damp(s.rotation.y, unlocked ? -Math.PI * 0.55 : 0, 6, delta);
    if (!reduced) body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, unlocked ? 0.35 : 0, 4, delta);
  });

  const metal = { metalness: 1, roughness: 0.16, envMapIntensity: 1.5 };

  return (
    <group
      ref={body}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true), (document.body.style.cursor = "pointer"))}
      onPointerOut={() => (setHovered(false), (document.body.style.cursor = ""))}
      onClick={(e) => (e.stopPropagation(), setOpen((o) => !o))}
    >
      {/* Body */}
      <RoundedBox args={[1.7, 1.35, 0.6]} radius={0.14} smoothness={6} position={[0, -0.35, 0]}>
        <meshStandardMaterial color={colors.body} {...metal} />
      </RoundedBox>
      {/* Keyhole */}
      <group position={[0, -0.28, 0.305]}>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 40]} />
          <meshStandardMaterial color={colors.hole} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.1, 0.32, 0.02]} />
          <meshStandardMaterial color={colors.hole} roughness={0.6} />
        </mesh>
      </group>
      {/* Engraved band across the body */}
      <mesh position={[0, -0.86, 0.302]}>
        <boxGeometry args={[1.3, 0.025, 0.01]} />
        <meshStandardMaterial color={colors.hole} roughness={0.6} />
      </mesh>
      {/* Shackle pivots on its right leg */}
      <group ref={shackle} position={[SHACKLE_R, 0.62, 0]}>
        <group position={[-SHACKLE_R, 0, 0]}>
          <mesh position={[0, LEG / 2, 0]}>
            <torusGeometry args={[SHACKLE_R, 0.12, 32, 64, Math.PI]} />
            <meshStandardMaterial color={colors.shackle} {...metal} />
          </mesh>
          {[-SHACKLE_R, SHACKLE_R].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, LEG, 32]} />
              <meshStandardMaterial color={colors.shackle} {...metal} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// Wireframe globe of nodes and links: the network the lock is protecting.
function Network({ colors, reduced }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.IcosahedronGeometry(2.25, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useFrame((_, delta) => {
    if (reduced) return;
    ref.current.rotation.y += delta * 0.06;
    ref.current.rotation.x += delta * 0.02;
  });
  return (
    <group ref={ref}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={colors.net} transparent opacity={0.16} />
      </lineSegments>
      <points geometry={geo}>
        <pointsMaterial color={colors.net} size={0.07} sizeAttenuation transparent opacity={0.55} />
      </points>
    </group>
  );
}

// A flat ring that sweeps up and down through the lock like a scanner.
function ScanRing({ colors, reduced }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y = reduced ? -0.2 : Math.sin(t * 0.9) * 1.05 - 0.1;
    ref.current.material.opacity = 0.25 + 0.2 * Math.abs(Math.cos(t * 0.9));
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[1.35, 1.4, 96]} />
      <meshBasicMaterial color={colors.scan} transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

// Thin orbit line with a small data packet travelling along it.
function Orbit({ radius, tilt, speed, offset, colors, size = 0.08 }) {
  const packet = useRef();
  const geometry = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2).getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame((state) => {
    const a = state.clock.elapsedTime * speed + offset;
    packet.current.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    packet.current.rotation.set(a, a * 1.3, 0);
  });

  return (
    <group rotation={tilt}>
      <line geometry={geometry}>
        <lineBasicMaterial color={colors.net} transparent opacity={0.3} />
      </line>
      <mesh ref={packet}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={colors.packet} metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

// Follows the pointer and reacts to page scroll (progress is a framer-motion MotionValue 0..1).
function Rig({ children, progress, reduced }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const p = progress?.get() ?? 0;
    const g = ref.current;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.5 + p * Math.PI * 0.8, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.25 + p * 0.5, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 1.2, 4, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1 - p * 0.25, 4, delta));
  });
  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ theme = "light", progress, reduced = false }) {
  const colors = palette[theme] ?? palette.light;
  const [quality, setQuality] = useState(1);

  return (
    <Canvas
      dpr={[1, 1.75 * quality]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setQuality(0.5)} onIncline={() => setQuality(1)} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />

      <Rig progress={progress} reduced={reduced}>
        <Network colors={colors} reduced={reduced} />
        <Float speed={reduced ? 0 : 1.4} rotationIntensity={0.35} floatIntensity={0.6}>
          <group rotation={[0.08, -0.35, 0]}>
            <Padlock colors={colors} reduced={reduced} />
          </group>
        </Float>
        <ScanRing colors={colors} reduced={reduced} />
        <Orbit radius={2.7} tilt={[1.25, 0.3, 0]} speed={0.35} offset={0} colors={colors} />
        <Orbit radius={3.05} tilt={[1.8, -0.5, 0.2]} speed={-0.25} offset={2} colors={colors} size={0.07} />
        {!reduced && <Sparkles count={28} scale={[6, 4, 3]} size={1.5} speed={0.25} opacity={0.45} color={colors.spark} />}
      </Rig>

      <ContactShadows position={[0, -2.3, 0]} opacity={theme === "dark" ? 0.6 : 0.3} blur={2.8} scale={9} far={4} color="#000000" />

      {/* Procedural studio lighting: no HDR file to download. */}
      <Environment resolution={256}>
        <color attach="background" args={[colors.studio]} />
        <Lightformer intensity={3} position={[0, 4, -6]} scale={[10, 2, 1]} />
        <Lightformer intensity={2} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer intensity={2} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer intensity={1} position={[0, -5, 2]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="ring" intensity={4} position={[2, 2, 5]} scale={1.5} />
      </Environment>
    </Canvas>
  );
}
