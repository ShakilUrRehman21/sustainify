"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function SustainableSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.25, 0.2, 0]}>
      <icosahedronGeometry args={[1.85, 2]} />
      <meshStandardMaterial
        color="#047857"
        wireframe
        transparent
        opacity={0.32}
      />
    </mesh>
  );
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-transparent" />;
  }

  return (
    <div className="w-full h-full opacity-70 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} color="#059669" />
        <SustainableSphere />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
