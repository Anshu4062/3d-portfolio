import { useTranslation } from "react-i18next";
import useDimensionStore from "../../stores/useDimensionStore";
import playSound from "../Utils/playSound";
import { useLoaderStore } from "../Stores/useLoaderStore";
// import useExperienceStore from "../Stores/useExperienceStore";
import { useEffect, useRef } from "react";
import sleep from "../../util/sleep";
import gsap from "gsap";
interface Props {
    setStarted: (started: boolean) => void;
}

export default function LoadingPage({ setStarted }: Props) {
    const percentage = useLoaderStore((state) => state.percentage);
    const latestLoaded = useLoaderStore((state) => state.latestLoaded);

    const setDimension = useDimensionStore((state) => state.setDimension);

    const { t } = useTranslation();

    const percentageRef = useRef<HTMLHeadingElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const startScreenRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Make percentage number slowly go up instead of just jumping
        const interval = setInterval(() => {
            if (!percentageRef.current) return;

            const currentPercentage = parseInt(percentageRef.current.innerText);
            const nextPercentage = currentPercentage + 1;

            if (currentPercentage < percentage) {
                percentageRef.current.innerText = nextPercentage + "%";
            }

            gsap.to(barRef.current!.style, {
                width: `${currentPercentage}%`,
                duration: 0.1,
            });

            if (currentPercentage >= 100) {
                clearInterval(interval);

                (async () => {
                    // Start animting the loading screen out
                    if (!loadingRef.current) return;
                    if (!startScreenRef.current) return;

                    loadingRef.current.style.opacity = "0%";
                    await sleep(500);

                    loadingRef.current.style.display = "none";
                    startScreenRef.current.style.display = "flex";
                    await sleep(100);

                    startScreenRef.current.style.opacity = "100%";
                })();
            }
        }, 1);

        return () => clearInterval(interval);
    }, [percentage]);

    useEffect(() => {}, [latestLoaded]);

    return (
        <div className="fixed w-full h-full z-20 flex items-center justify-center">
            <section className="text-center duration-500" ref={loadingRef}>
                <h1 className="text-3xl font-bold">{t("Loading market")}...</h1>
                <p className="text-sm mt-2 opacity-50">{latestLoaded}</p>
                <h2 className="mt-2" ref={percentageRef}>
                    0%
                </h2>
                <div className="h-1 bg-white/50 rounded-full mt-4">
                    <div
                        className="h-full bg-white rounded-full"
                        style={{ width: "0%" }}
                        ref={barRef}
                    />
                </div>
                <span
                    className="opacity-25 text-white cursor-pointer text-base block font-mono hover:text-blue-300 duration-300 tracking-widest mt-2"
                    onClick={() => {
                        setDimension("2D");
                    }}
                >
                    {t("2d_instead")}
                </span>
            </section>
            <section
                className="text-center h-full flex-col items-center justify-center duration-500"
                style={{ display: "none", opacity: 0 }}
                ref={startScreenRef}
            >
                <span
                    className="mt-4 text-green-500 font-bold cursor-pointer text-5xl block font-mono hover:text-blue-300 duration-300 tracking-widest"
                    onClick={() => {
                        playSound("clickAudio");
                        // fade the content (1-second)
                        gsap.to(startScreenRef.current, {
                            opacity: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                setTimeout(() => {
                                    setStarted(true);
                                }, 100);
                            },
                        });
                    }}
                >
                    {t("Enter")}
                </span>
                {/* add a checkbox for low-resource mode */}
                <span className="text-base mt-1 opacity-50">
                    {t("3d_warning")}
                </span>
                <hr className="border w-full my-2 border-white/50" />
                <span
                    className="opacity-25 text-white cursor-pointer text-base block font-mono hover:text-blue-300 duration-300 tracking-widest"
                    onClick={() => {
                        setDimension("2D");
                    }}
                >
                    {t("2d_instead")}
                </span>
                <div className="flex-grow h-full flex items-end absolute pointer-events-none mb-8">
                    <ul className="opacity-50 text-sm">
                        <li>{t("credits_1")}</li>
                        <li>{t("credits_2")}</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
