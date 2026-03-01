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
    const mx = mouse.current.x;
    const my = mouse.current.y;

    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let targetDistort = 0.3;
    let targetSpeed = 1.0;

    // Cinematic Storytelling Sequence
    if (t < 7.0) {
      // Phase 0: Hidden/Waiting for Splash Screen
      targetScale = 0.01;
      targetDistort = 1.0;
      targetSpeed = 4.0;
      targetY = -3; // Start from way below the viewport
    } else if (t < 8.5) {
      // Phase 1: The Birth (7.0s - 8.5s) -> Erupts right as the Yellow Line drops
      const progress = Math.min((t - 7.0) / 1.5, 1);
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      
      targetScale = 0.01 + easeOutQuint * 1.1; // Only swells to 1.1 to avoid excessive shrinking later
      targetDistort = 0.9; // Highly chaotic and fluid
      targetSpeed = 4.0; // Fast boiling effect
      targetY = -3 + easeOutQuint * 3; // Rises to perfect center
    } else if (t < 9.5) {
      // Phase 2: Stabilization (8.5s - 9.5s) -> Calms as the Splash Screen slides away
      const progress = Math.min((t - 8.5) / 1.0, 1);
      const easeInOut = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      targetScale = 1.11 - easeInOut * 0.11; // Barely shrinks back to 1.0 resting size
      targetDistort = 0.9 - easeInOut * 0.6; // Calms down its shape
      targetSpeed = 4.0 - easeInOut * 3.0; // Slows down its boiling
    } else {
      // Phase 3: Interactive Eternity -> Peacefully follows cursor
      targetScale = 1.0;
      const distance = Math.sqrt(mx * mx + my * my);
      targetDistort = 0.3 + (distance * 0.08); // Barely distorts when moused over
      targetSpeed = 1.0 + (distance * 0.5);    // Barely speeds up

      targetX = mx * 0.3; // Gentle parralax follow
      targetY = my * 0.3;
    }

    // Apply the mathematical sequence to the 3D mesh
    if (t < 9.5) {
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
      transition={{ duration: 1.5, delay: 7.0, ease: "easeOut" }}
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
