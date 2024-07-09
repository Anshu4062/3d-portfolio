import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

import playSound from "../Utils/playSound";
import useExperienceStore from "../Stores/useExperienceStore";
import { CameraFocus, positions } from "../Data/cameraPositions";

export default function CameraManager() {
    const { camera, controls } = useThree();
    const orbitControls = controls as OrbitControls;

    // Handle camera transitions
    const cameraFocus = useExperienceStore((state) => state.cameraFocus);

    useEffect(() => {
        if (!controls || !camera) return;
        if (cameraFocus === CameraFocus.None) return;

        // When focus changes, disable rotation
        orbitControls.enableRotate = cameraFocus === CameraFocus.Home;
        orbitControls.enableDamping = cameraFocus === CameraFocus.Home;
        orbitControls.enableZoom = cameraFocus === CameraFocus.Home;

        playSound("whooshAudio");

        // Move the camera and target
        gsap.to(camera.position, {
            x: positions[cameraFocus].position[0],
            y: positions[cameraFocus].position[1],
            z: positions[cameraFocus].position[2],
            duration: 1,
            ease: "sine.inOut",
        });

        gsap.to((controls as OrbitControls).target, {
            x: positions[cameraFocus].target[0],
            y: positions[cameraFocus].target[1],
            z: positions[cameraFocus].target[2],
            duration: 1,
            ease: "sine.inOut",
        });
    }, [controls, cameraFocus]);

    return null;
}
