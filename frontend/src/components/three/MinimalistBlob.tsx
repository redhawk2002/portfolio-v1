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

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;

    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Calculate distance from center to mouse
    const distance = Math.sqrt(mx * mx + my * my);

    // 1. Magnetic pull towards the cursor (very subtle movement)
    const targetX = mx * 0.2; // Extremely reduced
    const targetY = my * 0.2;
    
    // Smoothly interpolate current position towards target position
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;

    // 2. Increase distortion and speed the closer the mouse is
    const targetDistort = 0.3 + (distance * 0.05); // Barely distorts when moused over
    const targetSpeed = 1.2 + (distance * 0.4);    // Barely speeds up

    // Smoothly animate the material properties
    materialRef.current.distort += (targetDistort - materialRef.current.distort) * 0.02;
    materialRef.current.speed += (targetSpeed - materialRef.current.speed) * 0.02;
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 3, delay: 7.5, ease: "easeOut" }}
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
