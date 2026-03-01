"use client";

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function BlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  
  // Track mouse coordinates globally so foreground DOM elements don't block pointer events
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;

    const t = clock.elapsedTime;
    const mx = mouse.current.x, my = mouse.current.y;
    let targetScale = 1, targetDistort = 0.3, targetSpeed = 1.0, targetX = 0, targetY = 0;

    // Fast-loading cinematic sequence
    if (t < 3.5) {
      targetScale = 0.01; targetDistort = 1.0; targetSpeed = 4.0; targetY = -3;
    } else if (t < 5.0) {
      const p = Math.min((t - 3.5) / 1.5, 1);
      const ease = 1 - Math.pow(1 - p, 5);
      targetScale = 0.01 + ease * 1.05;
      targetDistort = 0.9; targetSpeed = 4.0;
      targetY = -3 + ease * 3;
    } else if (t < 6.0) {
      const p = Math.min((t - 5.0) / 1.0, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetScale = 1.06 - ease * 0.06;
      targetDistort = 0.9 - ease * 0.6;
      targetSpeed = 4.0 - ease * 3.0;
    } else {
      const d = Math.sqrt(mx * mx + my * my);
      targetDistort = 0.3 + d * 0.08;
      targetSpeed = 1.0 + d * 0.5;
      targetX = mx * 0.3; targetY = my * 0.3;
    }

    // Apply the mathematical sequence to the 3D mesh
    if (t < 6.0) {
      // Hard frame-by-frame lock during cinematic sequences
      meshRef.current.scale.set(targetScale, targetScale, targetScale);
      meshRef.current.position.x = targetX;
      meshRef.current.position.y = targetY;
    } else {
      // Smooth springy physics during interactive phase
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
    }

    // Always smoothly interpolate material properties for gorgeous visual transitions
    materialRef.current.distort += (targetDistort - materialRef.current.distort) * 0.05;
    materialRef.current.speed += (targetSpeed - materialRef.current.speed) * 0.05;
  });

  return (
    <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[2.2, 128, 128]} position={[0, 0, -1]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#ffffff"
          attach="material"
          distort={0.3}
          speed={1.0}
          roughness={0.02}    // Lower roughness for higher gloss/glow
          metalness={0.15}
          clearcoat={1}      // Maximum clearcoat
          clearcoatRoughness={0.05} // Very shiny clearcoat
        />
      </Sphere>
    </Float>
  );
}

export default function MinimalistBlob() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 3.5, ease: "easeOut" }}
      className="absolute inset-0 z-0 pointer-events-none fade-in"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Increased light intensities for a stronger 'glow' */}
        <ambientLight intensity={1.8} />
        <directionalLight position={[10, 10, 5]} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-10, 10, -5]} intensity={1.0} color="#f8fafc" />
        <pointLight position={[0, 0, 3]} intensity={1.5} color="#ffffff" />
        <BlobMesh />
      </Canvas>
      <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[1px] z-10 pointer-events-none" />
    </motion.div>
  );
}
