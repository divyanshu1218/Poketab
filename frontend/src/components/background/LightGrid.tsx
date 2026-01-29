import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

export function LightGrid() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const props = useSpring({
        x: mouse.x,
        y: mouse.y,
        config: { mass: 5, tension: 350, friction: 40 },
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <animated.div
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 0,
                transform: props.x.to((x) => `translate(${x}px, ${props.y.get()}px)`),
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '100px 100px',
                    maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
                }}
            />
            {/* Light rays */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse at 30% 20%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(138, 43, 226, 0.08) 0%, transparent 50%)
          `,
                }}
            />
        </animated.div>
    );
}
