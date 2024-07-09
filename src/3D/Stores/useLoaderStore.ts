import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { create } from "zustand";
import numberWithCommas from "../../util/numberWithCommas";
import { ASSETS, AssetType } from "../Data/assetList";

interface LoaderState {
    percentage: number;
    setPercentage: (percentage: number) => void;

    isLoaded: boolean;
    setLoaded: (isLoaded: boolean) => void;

    latestLoaded: string;
    setLatestLoaded: (latestLoaded: string) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
    percentage: 0,
    setPercentage: (percentage: number) => set({ percentage }),

    isLoaded: false,
    setLoaded: (isLoaded: boolean) => set({ isLoaded }),

    latestLoaded: "",
    setLatestLoaded: (latestLoaded: string) => set({ latestLoaded }),
}));

// Helper types for loading
export type AssetName = (typeof ASSETS)[number]["name"];
export type SoundName = Extract<
    (typeof ASSETS)[number],
    { type: AssetType.HtmlAudio }
>["name"];

type AssetReturnType = GLTF | THREE.Texture | HTMLAudioElement | string;

// Asset list where we store all loaded assets
const ASSET_LIST: {
    [key in AssetName]?: AssetReturnType;
} = {};

export function getAsset<T extends AssetReturnType>(name: AssetName): T {
    return ASSET_LIST[name] as T;
}

let startedLoading = false;
export function startLoading(textureSize: number) {
    if (startedLoading) return;
    startedLoading = true;

    // Initiate GLTF loader
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    // Initiate texture loader
    const textureLoader = new THREE.TextureLoader();

    // Handle all loads
    let loadedSizes = 0;
    let loadedCount = 0;
    const totalSizes = ASSETS.reduce((acc, asset) => acc + asset.size, 0);

    const incrementLoaded = (asset: (typeof ASSETS)[number]) => {
        loadedSizes += asset.size;
        loadedCount++;

        const percentage = Math.round((loadedSizes / totalSizes) * 100);
        const isLoaded = loadedSizes === totalSizes;

        console.log(
            `Loaded ${asset.name} (${numberWithCommas(
                loadedSizes
            )} bytes) (${percentage}%)`
        );
        useLoaderStore.setState({
            percentage,
            isLoaded,
            latestLoaded: `${asset.url} (${loadedCount}/${ASSETS.length})`,
        });
    };

    for (const asset of ASSETS) {
        switch (asset.type) {
            case AssetType.Gltf:
                gltfLoader.load(asset.url, (gltf) => {
                    ASSET_LIST[asset.name] = gltf;
                    incrementLoaded(asset);
                });
                break;
            case AssetType.Texture:
                const skipAsset =
                    "textureSize" in asset.data &&
                    asset.data.textureSize !== textureSize;

                // If the texture size isn't good, we skip
                if (skipAsset) {
                    incrementLoaded(asset);
                    break;
                }

                textureLoader.load(asset.url, (texture) => {
                    ASSET_LIST[asset.name] = texture;
                    incrementLoaded(asset);
                });
                break;
            case AssetType.HtmlAudio:
                const audio = new Audio(asset.url);

                const onAudioLoad = () => {
                    ASSET_LIST[asset.name] = audio;
                    incrementLoaded(asset);

                    audio.removeEventListener("canplaythrough", onAudioLoad);
                };

                audio.addEventListener("canplaythrough", onAudioLoad);
                audio.load();
                break;
            case AssetType.HtmlImage:
                fetch(asset.url).then(async (response) => {
                    const blob = await response.blob();

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        ASSET_LIST[asset.name] = reader.result as string;
                        incrementLoaded(asset);
                    };

                    reader.readAsDataURL(blob);
                });

                break;
        }
    }
}
