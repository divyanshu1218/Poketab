import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScannerEffectsProps {
    isScanning: boolean;
    onDetection?: boolean;
}

export function ScannerEffects({ isScanning, onDetection }: ScannerEffectsProps) {
    const [scanLinePosition, setScanLinePosition] = useState(0);

    useEffect(() => {
        if (isScanning) {
            const interval = setInterval(() => {
                setScanLinePosition((prev) => (prev + 1) % 100);
            }, 20);
            return () => clearInterval(interval);
        }
    }, [isScanning]);

    return (
        <>
            {/* Scan Line */}
            {isScanning && (
                <motion.div
                    className="absolute left-0 right-0 h-0.5 pointer-events-none"
                    style={{
                        top: `${scanLinePosition}%`,
                        background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
                        boxShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}

            {/* Corner Brackets */}
            <motion.div
                className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary rounded-tl-lg pointer-events-none"
                animate={{
                    scale: onDetection ? [1, 1.2, 1] : isScanning ? [1, 1.05, 1] : 1,
                    opacity: isScanning || onDetection ? 1 : 0.5,
                }}
                transition={{
                    duration: onDetection ? 0.3 : 2,
                    repeat: isScanning ? Infinity : 0,
                }}
            />
            <motion.div
                className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary rounded-tr-lg pointer-events-none"
                animate={{
                    scale: onDetection ? [1, 1.2, 1] : isScanning ? [1, 1.05, 1] : 1,
                    opacity: isScanning || onDetection ? 1 : 0.5,
                }}
                transition={{
                    duration: onDetection ? 0.3 : 2,
                    repeat: isScanning ? Infinity : 0,
                    delay: 0.1,
                }}
            />
            <motion.div
                className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary rounded-bl-lg pointer-events-none"
                animate={{
                    scale: onDetection ? [1, 1.2, 1] : isScanning ? [1, 1.05, 1] : 1,
                    opacity: isScanning || onDetection ? 1 : 0.5,
                }}
                transition={{
                    duration: onDetection ? 0.3 : 2,
                    repeat: isScanning ? Infinity : 0,
                    delay: 0.2,
                }}
            />
            <motion.div
                className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary rounded-br-lg pointer-events-none"
                animate={{
                    scale: onDetection ? [1, 1.2, 1] : isScanning ? [1, 1.05, 1] : 1,
                    opacity: isScanning || onDetection ? 1 : 0.5,
                }}
                transition={{
                    duration: onDetection ? 0.3 : 2,
                    repeat: isScanning ? Infinity : 0,
                    delay: 0.3,
                }}
            />

            {/* Glow Pulse */}
            {isScanning && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{
                        boxShadow: '0 0 40px rgba(0, 217, 255, 0.3), inset 0 0 40px rgba(0, 217, 255, 0.1)',
                    }}
                    animate={{
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
            )}

            {/* Lock-on Glow */}
            {onDetection && (
                <motion.div
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    style={{
                        boxShadow: '0 0 60px rgba(0, 217, 255, 0.8), inset 0 0 60px rgba(0, 217, 255, 0.3)',
                        border: '2px solid rgba(0, 217, 255, 0.8)',
                    }}
                />
            )}

            {/* Camera Shake Container */}
            {onDetection && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        x: [0, -2, 2, -2, 2, 0],
                        y: [0, 2, -2, 2, -2, 0],
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                />
            )}
        </>
    );
}
