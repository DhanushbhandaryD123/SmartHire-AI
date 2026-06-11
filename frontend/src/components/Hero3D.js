import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1.4, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#f97316"
            attach="material"
            distort={0.45}
            speed={1.8}
            roughness={0.15}
            metalness={0.4}
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={3}>
        <Torus args={[2.4, 0.06, 16, 100]} rotation={[Math.PI / 2.5, 0, 0]}>
          <meshStandardMaterial color="#818cf8" roughness={0.3} metalness={0.6} />
        </Torus>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.2}
      />
    </>
  );
}

function Hero3D() {
  return (
    <div className="w-full h-[320px] md:h-[420px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Hero3D;
