import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
    const ref = useRef<THREE.Points>(null);

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(2000 * 3);

        for (let i = 0; i < 2000; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 30;
        }

        return positions;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.elapsedTime * 0.02;
            ref.current.rotation.y = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#00d9ff"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export function ThreeBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                gl={{ alpha: true, antialias: false }}
            >
                <ParticleField />
            </Canvas>
        </div>
    );
}
