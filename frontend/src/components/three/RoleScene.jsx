import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';

const scenePalette = {
  admin: ['#7dd3c6', '#f7a072'],
  faculty: ['#70d6ff', '#ffd166'],
  student: ['#a78bfa', '#2dd4bf'],
};

function SceneMesh({ role }) {
  const mesh = useRef(null);
  const [primary, secondary] = scenePalette[role];

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.2;
    mesh.current.rotation.y += delta * 0.35;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.12;
  });

  const geometry = useMemo(() => {
    if (role === 'admin') return <icosahedronGeometry args={[1.2, 1]} />;
    if (role === 'faculty') return <torusKnotGeometry args={[0.9, 0.28, 220, 24]} />;
    return <octahedronGeometry args={[1.25, 0]} />;
  }, [role]);

  return (
    <Float speed={2.2} rotationIntensity={0.9} floatIntensity={1.2}>
      <mesh ref={mesh}>
        {geometry}
        <MeshDistortMaterial color={primary} speed={2} distort={0.35} roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[1.6, -1.25, -0.8]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={secondary} metalness={0.5} roughness={0.15} />
      </mesh>
    </Float>
  );
}

export function RoleScene({ role }) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80">
      <Canvas camera={{ position: [0, 0, 4.6], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 3, 4]} intensity={2} />
        <SceneMesh role={role} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.4} />
      </Canvas>
    </div>
  );
}
