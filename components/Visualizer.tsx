"use client";

// import { ComponentPropsWithoutRef, Suspense, useEffect, useState } from "react";
// import { useTexture } from "@react-three/drei/core/useTexture";
// import { useSpring } from "@react-spring/three";
// import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
// import { useRef, useState } from "react";
import { Shader } from "react-shaders";
// import type * as THREE from "three";
import fragmentShader from "./eyebleed.glsl";

/*
function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
    </mesh>
  );
}

function Inner() {
  const meshRef = useRef<THREE.Mesh>();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const texture = useTexture(
    "https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/08/09/10/coco-cola.jpg",
    // "/headshot.avif",
  );

  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 80, friction: 30 },
  }));

  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
    setLastPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handlePointerMove = (event) => {
    if (isDragging) {
      const deltaX = (event.clientX - lastPosition.x) * 0.01;
      const deltaY = (event.clientY - lastPosition.y) * 0.01;

      meshRef.current.rotation.y += deltaX;
      meshRef.current.rotation.x += deltaY;

      setLastPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handlePointerUp = (event) => {
    if (isDragging) {
      setIsDragging(false);
      const velocityX = (event.clientX - lastPosition.x) * 0.01;
      const velocityY = (event.clientY - lastPosition.y) * 0.01;

      // Apply momentum using springs
      api.start({
        from: {
          rotation: [meshRef.current.rotation.x, meshRef.current.rotation.y, 0],
        },
        to: {
          rotation: [
            meshRef.current.rotation.x + velocityY * 2,
            meshRef.current.rotation.y + velocityX * 2,
            0,
          ],
        },
      });
    }
  };

  useFrame((state, delta) => {
    if (!isDragging) {
      // meshRef.current.rotation.x += delta * 0.3; // top-over-bottom
      // meshRef.current.rotation.y += delta * 0.5; // right-over0-left
      meshRef.current.rotation.x = spring.rotation[0]?.get();
      meshRef.current.rotation.y = spring.rotation[1]?.get();
    }
  });

  return (
    <mesh
      ref={meshRef}
      // onPointerOver={() => setHovered(true)}
      // onPointerOut={() => setHovered(false)}
      // onPointerDown={handlePointerDown}
      // onPointerMove={handlePointerMove}
      // onPointerUp={handlePointerUp}
      // onPointerLeave={handlePointerUp}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        emissive={hovered ? "#0000ff" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
        wireframe={hovered}
      />
      <shaderMaterial fragmentShader={fragmentShader} />
    </mesh>
  );
}
*/

export function Visualizer() {
  // return (
  //   <Canvas>
  //     {/* <ambientLight intensity={Math.PI / 2} />
  //     <spotLight
  //       position={[10, 10, 10]}
  //       angle={0.15}
  //       penumbra={1}
  //       decay={0}
  //       intensity={Math.PI}
  //     />
  //     <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
  //     <Box position={[-1.2, 0, 0]} />
  //     <Box position={[1.2, 0, 0]} /> */}
  //     <Inner />
  //   </Canvas>
  // );

  return (
    <Shader
      devicePixelRatio={
        typeof window === "undefined" ? undefined : window.devicePixelRatio
      }
      fs={fragmentShader}
    />
  );
}
