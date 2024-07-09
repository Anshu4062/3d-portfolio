import { useTranslation } from "react-i18next";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import {
    PropsWithChildren,
    forwardRef,
    useEffect,
    useRef,
    useState,
} from "react";
import gsap from "gsap";
import playSound from "../Utils/playSound";
import useExperienceStore from "../Stores/useExperienceStore";
import { CameraFocus } from "../Data/cameraPositions";
import { FaGear } from "react-icons/fa6";

interface CornerProps {
    position: [0 | 1, 0 | 1];
    ref: React.RefObject<HTMLDivElement>;
    events: boolean;
}

const Corner = forwardRef<HTMLDivElement, PropsWithChildren<CornerProps>>(
    function ({ position, children, events }, ref) {
        let x = "left-0";
        if (position[0] === 1) x = "right-0";

        let y = "top-0";
        if (position[1] === 1) y = "bottom-0";

        return (
            <div
                className={`absolute ${x} ${y} m-4 ${
                    events ? "pointer-events-auto" : "pointer-events-none"
                } max-w-lg`}
                ref={ref}
            >
                {children}
            </div>
        );
    }
);

export default function Overlay() {
    const { t, i18n } = useTranslation();
    const cameraFocus = useExperienceStore((state) => state.cameraFocus);
    const isReady = useExperienceStore((state) => state.isReady);
    const [detailLevel, setDetailLevel] = useExperienceStore((state) => [
        state.detailLevel,
        state.setDetailLevel,
    ]);

    const [isAudioPaused, setIsAudioPaused] = useExperienceStore((state) => [
        state.isAudioPaused,
        state.setIsAudioPaused,
    ]);

    const [settingsOpened, setSettingsOpened] = useState(false);

    const [hideWelcome, setHideWelcome] = useState(false);
    const welcomeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        gsap.to(containerRef.current, {
            backgroundColor: "rgba(0, 0, 0, 0)",
            duration: 0.2,
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed w-full h-full pointer-events-none duration-1000"
            style={{
                zIndex: 100000000,
                backgroundColor: "rgba(0, 0, 0, 1)",
            }}
        >
            {/* One UI at the corner to indicate music that is playing */}
            {isReady &&
                (cameraFocus === CameraFocus.Home ||
                    cameraFocus === CameraFocus.None) && (
                    <>
                        {!hideWelcome && (
                            <Corner
                                position={[0, 1]}
                                ref={welcomeRef}
                                events={true}
                            >
                                <div className="bg-zinc-900/75 shadow-lg rounded-lg px-4 py-3 ms-2 me-4 hidden lg:block">
                                    <span className="font-semibold w-full flex justify-between items-center">
                                        {t("welcome_portfolio")}
                                        <span
                                            className="font-mono text-red-500 font-bold cursor-pointer hover:text-red-300 duration-300"
                                            onClick={() => {
                                                // move the div to the side
                                                playSound("whooshAudio");
                                                gsap.to(welcomeRef.current, {
                                                    xPercent: -100,
                                                    duration: 0.5,
                                                    ease: "power2.in",
                                                    onComplete: () => {
                                                        setHideWelcome(true);
                                                    },
                                                });
                                            }}
                                        >
                                            x
                                        </span>
                                    </span>
                                    <span className="text-xs font-semibold text-blue-400 block mb-1">
                                        {t("welcome_portfolio_sub")}
                                    </span>
                                    <ul className="list-disc ms-4 text-sm text-blue-100/50">
                                        <li
                                            dangerouslySetInnerHTML={{
                                                __html: t("welcome_list_2"),
                                            }}
                                        />
                                        <li
                                            dangerouslySetInnerHTML={{
                                                __html: t("welcome_list_1"),
                                            }}
                                        />
                                        <li>
                                            <span className="font-semibold">
                                                {t("Hint")}
                                            </span>
                                            {": "}
                                            {t("welcome_list_3")}
                                        </li>
                                    </ul>
                                </div>
                            </Corner>
                        )}
                        {settingsOpened && (
                            <div className="absolute w-full h-full flex items-center justify-center cursor pointer-events-none">
                                <div className="pointer-events-auto rounded-lg bg-slate-800/75 w-full max-w-sm px-4 py-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">
                                            Settings Menu
                                        </p>
                                        <p
                                            className="text-red-500 font-bold cursor-pointer"
                                            onClick={() =>
                                                setSettingsOpened(false)
                                            }
                                        >
                                            x
                                        </p>
                                    </div>

                                    <hr className="opacity-50 mb-2" />
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">
                                            {t("Language")}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                className={`${
                                                    i18n.language === "en"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() => {
                                                    i18n.changeLanguage("en");
                                                    localStorage.setItem(
                                                        "LOCALE",
                                                        "en"
                                                    );
                                                }}
                                            >
                                                English
                                            </button>
                                            <button
                                                className={`${
                                                    i18n.language === "fr"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() => {
                                                    i18n.changeLanguage("fr");
                                                    localStorage.setItem(
                                                        "LOCALE",
                                                        "fr"
                                                    );
                                                }}
                                            >
                                                Français
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm">
                                            {t("Detail Level")}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                className={`${
                                                    detailLevel === 1
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() =>
                                                    setDetailLevel(1)
                                                }
                                            >
                                                1
                                            </button>
                                            <button
                                                className={`${
                                                    detailLevel === 2
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() =>
                                                    setDetailLevel(2)
                                                }
                                            >
                                                2
                                            </button>
                                            <button
                                                className={`${
                                                    detailLevel === 3
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() =>
                                                    setDetailLevel(3)
                                                }
                                            >
                                                3
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm">
                                            {t("Background Track")}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                className={`${
                                                    isAudioPaused
                                                        ? "bg-gray-500"
                                                        : "bg-blue-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() =>
                                                    setIsAudioPaused(false)
                                                }
                                            >
                                                {t("On")}
                                            </button>
                                            <button
                                                className={`${
                                                    isAudioPaused
                                                        ? "bg-blue-500"
                                                        : "bg-gray-500"
                                                } text-white px-4 py-2 rounded-lg text-sm font-semibold w-full`}
                                                onClick={() =>
                                                    setIsAudioPaused(true)
                                                }
                                            >
                                                {t("Off")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Corner position={[1, 0]} events={false}>
                            <img
                                src="/images/mouse.webp"
                                width={128}
                                height={128}
                                className="opacity-25 pointer-events-none animate-pulse"
                            />
                        </Corner>
                        <Corner position={[0, 0]} events={true}>
                            <div className="bg-zinc-900/75 shadow-lg rounded-lg p-4 gap-4 hidden lg:flex">
                                <div className="flex items-center justify-center">
                                    {isAudioPaused ? (
                                        <PlayCircleIcon
                                            className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-300 duration-300"
                                            onClick={() => {
                                                playSound("clickAudio");
                                                setIsAudioPaused(false);
                                            }}
                                        />
                                    ) : (
                                        <PauseCircleIcon
                                            className="w-8 h-8 text-red-500 cursor-pointer hover:text-red-300 duration-300"
                                            onClick={() => {
                                                playSound("clickAudio");
                                                setIsAudioPaused(true);
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <a
                                        className="text-red-500 text-sm block font-semibold hover:text-red-400 duration-300"
                                        href="https://www.youtube.com/watch?v=jmrvDx4okis"
                                        target="_blank"
                                    >
                                        Beautiful Soft Piano Music
                                    </a>
                                    <span className="text-white/50 text-xs block">
                                        {t("by")}{" "}
                                        <a
                                            className="text-blue-300 hover:text-blue-200 duration-300"
                                            href="https://www.youtube.com/channel/UCHJVYelCXpsV8P4EVWBgj0A"
                                            target="_blank"
                                        >
                                            Jonny Easton
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <FaGear
                                className="text-gray-400/50 w-6 h-6 mt-2 cursor-pointer duration-300 hover:brightness-150 hover:rotate-45"
                                onClick={() =>
                                    setSettingsOpened(!settingsOpened)
                                }
                            />
                        </Corner>
                        <Corner position={[1, 1]} events={true}>
                            {t("source_code_found")}{" "}
                            <a
                                href="https://github.com/Jxl-s/portfolio-2024"
                                target="_blank"
                                className="underline"
                            >
                                {t("here")}
                            </a>
                        </Corner>
                    </>
                )}
        </div>
    );
}
