import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

interface GlowBlob {
    id: number;
    color: string;
    size: number;
}

export function GlowNebula() {
    const [blobs] = useState<GlowBlob[]>([
        { id: 1, color: 'rgba(0, 217, 255, 0.3)', size: 600 },
        { id: 2, color: 'rgba(138, 43, 226, 0.25)', size: 500 },
        { id: 3, color: 'rgba(255, 0, 102, 0.2)', size: 550 },
    ]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            {blobs.map((blob, index) => (
                <AnimatedBlob key={blob.id} blob={blob} index={index} />
            ))}
        </div>
    );
}

function AnimatedBlob({ blob, index }: { blob: GlowBlob; index: number }) {
    const props = useSpring({
        from: {
            x: Math.random() * 100,
            y: Math.random() * 100,
        },
        to: async (next) => {
            while (true) {
                await next({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                });
            }
        },
        config: {
            duration: 20000 + index * 5000,
        },
    });

    return (
        <animated.div
            style={{
                position: 'absolute',
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                filter: 'blur(80px)',
                mixBlendMode: 'screen',
                left: props.x.to((x) => `${x}%`),
                top: props.y.to((y) => `${y}%`),
                transform: 'translate(-50%, -50%)',
            }}
        />
    );
}
