import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export const Camera = ({ onCapture, onClose }: CameraProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCaptured, setIsCaptured] = useState(false);

    // Start camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Use back camera on mobile
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                    setIsLoading(false);
                }
            } catch (err: any) {
                console.error('Camera access error:', err);
                setError(
                    err.name === 'NotAllowedError'
                        ? 'Camera access denied. Please allow camera permissions.'
                        : 'Failed to access camera. Please check your device settings.'
                );
                setIsLoading(false);
            }
        };

        startCamera();

        // Cleanup
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                onCapture(file);
                setIsCaptured(true);

                // Stop camera after capture
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                }
            }
        }, 'image/jpeg', 0.95);
    }, [stream, onCapture]);

    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur-sm"
                >
                    <X className="w-4 h-4" />
                </Button>

                {/* Camera view */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border-2 border-primary/20">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-muted-foreground">Starting camera...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6">
                                <CameraIcon className="w-16 h-16 text-destructive mx-auto mb-4" />
                                <p className="text-destructive font-semibold mb-2">Camera Error</p>
                                <p className="text-muted-foreground text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {!error && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Camera overlay corners */}
                            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary rounded-br-lg" />

                            {/* Center crosshair */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-32 h-32 border-2 border-primary/50 rounded-full" />
                            </div>
                        </>
                    )}
                </div>

                {/* Capture button */}
                {!error && !isLoading && !isCaptured && (
                    <div className="flex justify-center mt-6">
                        <Button
                            variant="hero"
                            size="xl"
                            onClick={capturePhoto}
                            className="gap-3"
                        >
                            <CameraIcon className="w-5 h-5" />
                            Capture Photo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
