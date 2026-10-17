"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HOTSPOTS, HotspotId } from "@/lib/hotspots";

type V3 = [number, number, number];

const BANK1: V3[] = [[-3.2, 0.2, 0.6], [-2.6, 0, 0.5], [-2.0, -0.05, 0.95], [-1.2, -0.05, 1.05], [-0.6, -0.05, 0.5], [0, 0, 0], [0.8, 0, -0.35], [2.2, 0, -0.4]];
const BANK2: V3[] = [[-3.2, 0.2, -0.6], [-2.6, 0, -0.5], [-1.6, 0, -0.4], [-0.8, 0, -0.25], [0, 0, 0], [0.8, 0, 0.35], [2.2, 0, 0.4]];
const JPIPE_A: V3[] = [[0.7, -0.05, 0.3], [0.7, -0.45, 0.3], [0.45, -0.68, 0.3]];
const JPIPE_B: V3[] = [[0.7, -0.05, -0.3], [0.7, -0.45, -0.3], [0.45, -0.68, -0.3]];
const TIPS: V3[] = [[3.65, 0.17, 0.42], [3.65, -0.17, 0.42], [3.65, 0.17, -0.42], [3.65, -0.17, -0.42]];

function Pipe({ pts, r = 0.075, lit = false }: { pts: V3[]; r?: number; lit?: boolean }) {
  const geo = useMemo(
    () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.4), 160, r, 24, false),
    [pts, r]
  );
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#b9ab8d" metalness={1} roughness={0.32} emissive="#C9A86A" emissiveIntensity={lit ? 0.45 : 0} />
    </mesh>
  );
}

function Tip({ pos, lit }: { pos: V3; lit: boolean }) {
  return (
    <group position={pos}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.45, 48, 1, true]} />
        <meshStandardMaterial color="#c9b995" metalness={1} roughness={0.25} side={THREE.DoubleSide} emissive="#C9A86A" emissiveIntensity={lit ? 0.45 : 0} />
      </mesh>
      <mesh position={[0.225, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.1, 0.014, 16, 48]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  );
}

const SPOTS: Record<HotspotId, V3> = {
  loop: [-1.6, 0.2, 1.05],
  xpipe: [0, 0.3, 0],
  jpipe: [0.55, -0.75, 0.3],
  tips: [3.95, 0.3, 0],
};

export default function ModelScene({ active, onSelect }: { active: HotspotId | null; onSelect: (id: HotspotId | null) => void }) {
  return (
    <Canvas camera={{ position: [4.5, 2.4, 5.2], fov: 38 }} dpr={[1, 2]}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.25} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 0]} scale={[10, 4, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} scale={[6, 2, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.5} position={[5, 1, -2]} scale={[6, 2, 1]} rotation-y={-Math.PI / 2} />
      </Environment>

      <group position={[-0.3, 0, 0]}>
        <Pipe pts={BANK1} lit={active === "loop"} />
        <Pipe pts={BANK2} />
        <Pipe pts={JPIPE_A} r={0.05} lit={active === "jpipe"} />
        <Pipe pts={JPIPE_B} r={0.05} lit={active === "jpipe"} />

        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} visible={active === "xpipe"}>
          <torusGeometry args={[0.28, 0.012, 16, 64]} />
          <meshBasicMaterial color="#C9A86A" />
        </mesh>

        <group position={[2.8, 0, 0]} scale={[1, 1, 1.9]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 1.3, 64]} />
            <meshStandardMaterial color="#8d8576" metalness={1} roughness={0.4} />
          </mesh>
        </group>

        {TIPS.map((p, i) => <Tip key={i} pos={p} lit={active === "tips"} />)}

        {HOTSPOTS.map((h) => (
          <Html key={h.id} position={SPOTS[h.id]} center zIndexRange={[10, 0]}>
            <button
              onClick={() => onSelect(active === h.id ? null : h.id)}
              aria-label={h.label}
              className={`h-5 w-5 rounded-full border-2 transition ${active === h.id ? "scale-125 border-black bg-sand" : "border-black bg-gold hover:scale-110"}`}
            />
          </Html>
        ))}
      </group>

      <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={14} blur={2.5} far={2.5} />
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} minDistance={3} maxDistance={11} maxPolarAngle={Math.PI * 0.62} />
    </Canvas>
  );
}
