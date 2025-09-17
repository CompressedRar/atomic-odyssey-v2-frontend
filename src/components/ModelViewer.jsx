import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { div } from "three/tsl";

function Model({ url }) {
  const { scene } = useGLTF(url); // Load the .glb file
  return <primitive object={scene} scale={1} />;
}

export default function ModelViewer(props) {
  return (
    <div className="model-container">
        <Canvas camera={{ position: [0, 1, 3], fov: 10}} resize={{ scroll: true, offsetSize: true }}
  >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <Suspense fallback={null}>
                <Model url={props.link}/> 
            </Suspense>
            <OrbitControls />
        </Canvas>
    </div>
  );
}
