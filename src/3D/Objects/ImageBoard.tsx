import { useMemo } from "react";
import { AssetName, getAsset } from "../Stores/useLoaderStore";
import * as THREE from "three";

interface Props {
    image: AssetName;
    meshProps: JSX.IntrinsicElements["mesh"];
    link?: string;
}

const ScreenGeometry = new THREE.PlaneGeometry(1, 1);
export default function ImageBoard({ image, meshProps }: Props) {
    const imageTexture = getAsset(image) as THREE.Texture;
    imageTexture.colorSpace = THREE.SRGBColorSpace;

    const imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture });

    const newRotation = useMemo(() => {
        const rot = [...(meshProps.rotation as [number, number, number])];
        rot[1] += Math.PI;
        rot[2] += Math.PI * 1.5;

        return rot;
    }, [meshProps.rotation]) as [number, number, number];

    return (
        <>
            <mesh
                scale={[1.3, 0.9, 1]}
                position={meshProps.position}
                rotation={newRotation}
                geometry={ScreenGeometry}
                material={imageMaterial}
            />
        </>
    );
}
