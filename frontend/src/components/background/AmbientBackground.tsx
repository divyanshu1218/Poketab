import { GlowNebula } from './GlowNebula';
// import { ThreeBackground } from './ThreeBackground'; // Temporarily disabled
import { LightGrid } from './LightGrid';

export function AmbientBackground() {
    return (
        <>
            <LightGrid />
            <GlowNebula />
            {/* <ThreeBackground /> */}
        </>
    );
}
