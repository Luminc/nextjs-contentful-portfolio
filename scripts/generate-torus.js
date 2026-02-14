const fs = require('fs');
const path = require('path');

// --- Configuration matching various default props in TorusLogo.tsx ---
const CONFIG = {
    lineCount: 30,
    tubeRadius: 3.45,
    torusRadius: 3.5,
    rotationX: 80, // degrees
    rotationY: -45, // degrees
    lineColor: '#333333',
    strokeWidth: 1.0,
    viewBoxSize: 50 // arbitrary viewport size, will scale to fit
};

const CAMERA = {
    fov: 60,
    position: [0, 0, 10]
};

// --- Math Helpers ---
function toRad(deg) {
    return deg * Math.PI / 180;
}

function rotateX(point, angleRad) {
    const [x, y, z] = point;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return [
        x,
        y * cos - z * sin,
        y * sin + z * cos
    ];
}

function rotateY(point, angleRad) {
    const [x, y, z] = point;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return [
        x * cos + z * sin,
        y,
        -x * sin + z * cos
    ];
}

function project(point, camera) {
    // Simple perspective projection
    // Camera is at (0,0,10) looking at (0,0,0)
    // x_screen = x / (z_dist) * f
    const [x, y, z] = point;
    const camZ = camera.position[2];

    // Z distance from camera (camera is at +10, point is at approx 0)
    // In Three.js, closer z is larger value? No, camera looks down -Z usually or object is at 0.
    // Three.js coord system: +Y up, +X right, +Z towards viewer.
    // Camera at +10. Point at 0. Dist = 10 - z.
    const dist = camZ - z;

    if (dist <= 0) return null; // Behind camera

    // Scale factor based on FOV
    // field of view is vertical.
    // tan(fov/2) = (height/2) / dist
    // we want to map this to arbitrary SVG units.
    const fovRad = toRad(camera.fov);
    const scale = 1 / (Math.tan(fovRad / 2) * dist);

    // Let's create an arbitrary scale to generally fit typical view
    // Project to Normalized Device Coordinates (-1 to 1)
    const xNDC = x * scale;
    const yNDC = y * scale;

    return [xNDC, yNDC];
}

// --- Generator ---
function generateSVG() {
    const lines = [];
    const rotX = toRad(CONFIG.rotationX);
    const rotY = toRad(CONFIG.rotationY);

    // Initial opacity logic from TorusLogo:
    // fadeStart: 0.15, fadeEnd: 0.55
    const fadeStart = 0.15;
    const fadeEnd = 0.55;

    for (let i = 0; i < CONFIG.lineCount; i++) {
        // Calculate ring properties
        const initialU = (i / CONFIG.lineCount) * Math.PI * 2;
        // At time=0, u = initialU
        let u = initialU;

        const cosU = Math.cos(u);
        const z_local = CONFIG.tubeRadius * Math.sin(u);
        const currentR = CONFIG.torusRadius + CONFIG.tubeRadius * cosU;

        // Calculate opacity based on "progress"
        const progress = (cosU + 1) / 2;
        let opacity = 0;
        if (progress < fadeStart) opacity = 1;
        else if (progress > fadeEnd) opacity = 0;
        else {
            const range = fadeEnd - fadeStart;
            opacity = range > 0.0001 ? 1 - (progress - fadeStart) / range : 0;
        }
        opacity = Math.pow(opacity, 2);

        if (opacity < 0.01) continue;

        // Generate points for this ring
        const ringPoints = [];
        const segments = 128; // Increased resolution for smoothness
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            // Unit circle point
            let px = Math.cos(theta);
            let py = Math.sin(theta);
            let pz = 0;

            // Scale by currentR
            px *= currentR;
            py *= currentR;

            // Translate to z_local
            pz += z_local;

            // Apply Group Rotation
            let p = [px, py, pz];
            p = rotateX(p, rotX);
            p = rotateY(p, rotY);

            // Project
            const projected = project(p, CAMERA);
            if (projected) {
                ringPoints.push(projected);
            }
        }

        // Create SVG Path
        let d = "";
        ringPoints.forEach((pt, idx) => {
            // Map NDC to SVG Viewbox
            // Viewbox -10 to 10?
            // Let's map -1..1 to 0..100
            const sx = (pt[0] * 50) + 50;
            const sy = (-pt[1] * 50) + 50; // Invert Y for SVG
            d += (idx === 0 ? "M" : "L") + `${sx.toFixed(3)},${sy.toFixed(3)} `;
        });

        lines.push({ d, opacity: opacity });
    }

    // Build SVG File
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <style>
      path { vector-effect: non-scaling-stroke; }
    </style>`;

    lines.forEach(line => {
        // Opacity of 1 in the 3D model looks solid, but they are transparent lines.
        // We'll use the calculated opacity.
        // Note: The 3D line width is '1.0'. In ThreeJS line width is typically pixels (screen space) or world units depending on implementation.
        // Drei Line usually uses world units if lineWidth is set, or pixels.
        // Default Line is often screen-space 1px.
        // Let's try a stroke-width of 0.5% of viewbox.
        svgContent += `
  <path d="${line.d}" stroke="${CONFIG.lineColor}" stroke-opacity="${line.opacity.toFixed(3)}" stroke-width="1.0" />`;
    });

    svgContent += "\n</svg>";

    const outputPath = path.join(__dirname, '../public/placeholder-torus.svg');
    fs.writeFileSync(outputPath, svgContent);
    console.log(`Generated SVG to ${outputPath}`);
}

generateSVG();
