import {
    DocumentDuplicateIcon,
    GlobeAltIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import { GiJourney } from "react-icons/gi";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import scrollTo from "../util/scrollTo";
import Button from "./ui/Button";
import useScrolling from "../hooks/useScrolling";

interface NavLinkProps {
    divId: string;
    name: string;
    active: boolean;
    icon: ReactNode;
}

function NavLink({ divId, name, active, icon }: NavLinkProps) {
    const { t } = useTranslation();
    return (
        <li
            className={`text-center duration-300 text-xs lg:text-base ${
                active
                    ? "text-indigo-400 font-semibold hover:text-indigo-600 hover:font-bold"
                    : "hover:text-indigo-300 hover:font-semibold "
            }`}
        >
            <span onClick={() => scrollTo(divId)} className="cursor-pointer">
                {icon}
                <div className="hidden lg:inline mx-1" />
                <span className="hidden lg:inline">{t(name)}</span>
            </span>
        </li>
    );
}

function LanguageSelector() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("LOCALE", lang);
    };

    return (
        <div className="flex gap-4 justify-between bg-black/80 px-4 rounded-lg shadow-md">
            <Button
                color="black"
                className="w-full text-center flex gap-4"
                onClick={() =>
                    changeLanguage(i18n.language === "en" ? "fr" : "en")
                }
            >
                <GlobeAltIcon className="h-6 w-6" />
                {i18n.language === "en" ? "English" : "Français"}
            </Button>
        </div>
    );
}

export default function Nav() {
    const [activeDiv, setActiveDiv] = useState("home-div");
    const isScrolling = useScrolling();

    useEffect(() => {
        const divIds = [
            ["home-div", "home-div"],
            ["about-div-header", "about-div"],
            ["projects-div-header", "projects-div"],
            ["journey-div-header", "journey-div"],
            ["contact-div-header", "contact-div"],
        ];

        const observerOptions = {
            root: null,
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionDiv = divIds.find(
                        (id) => id[0] === entry.target.id
                    );
                    return setActiveDiv(
                        sectionDiv ? sectionDiv[1] : "home-div"
                    );
                }
            });
        }, observerOptions);

        divIds.forEach((id) => {
            const div = document.getElementById(id[0]);
            if (div) {
                observer.observe(div);
            }
        });

        return () => {
            divIds.forEach((id) => {
                const div = document.getElementById(id[0]);
                if (div) {
                    observer.unobserve(div);
                }
            });
        };
    }, []);

    return (
        <header
            className={`flex items-center justify-center w-full fixed top-0 lg:px-8 py-4 duration-300 shadow-lg z-10 h-[72px] ${
                isScrolling ? "bg-indigo-900" : "bg-indigo-950"
            }`}
            id="navbar-container"
        >
            <span
                className="hidden lg:block font-bold text-2xl text-center lg:text-4xl cursor-pointer"
                onClick={() => scrollTo("home-div")}
            >
                <span className="text-indigo-600 xl:hidden">J</span>
                <span className="text-indigo-600 hidden xl:inline">
                    Jia Xuan
                </span>{" "}
                <span className="hidden xl:inline">Li</span>
            </span>
            <div className="hidden lg:block lg:mx-8" />
            <ul className="grid grid-cols-5 gap-4 w-full max-w-3xl">
                <NavLink
                    divId="home-div"
                    name="home"
                    active={activeDiv === "home-div"}
                    icon={<HomeIcon className="w-6 h-6 inline" />}
                />
                <NavLink
                    divId="about-div"
                    name="about"
                    active={activeDiv === "about-div"}
                    icon={<QuestionMarkCircleIcon className="w-6 h-6 inline" />}
                />
                <NavLink
                    divId="projects-div"
                    name="projects"
                    active={activeDiv === "projects-div"}
                    icon={<DocumentDuplicateIcon className="w-6 h-6 inline" />}
                />
                <NavLink
                    divId="journey-div"
                    name="journey"
                    active={activeDiv === "journey-div"}
                    icon={<GiJourney className="w-6 h-6 inline" />}
                />
                <NavLink
                    divId="contact-div"
                    name="contact"
                    active={activeDiv === "contact-div"}
                    icon={<UserPlusIcon className="w-6 h-6 inline" />}
                />
            </ul>
            <div className="hidden lg:block lg:flex-grow" />
            <div className="fixed bottom-[10px] left-[10px] right-[10px] lg:relative lg:bottom-auto lg:left-auto lg:right-auto">
                <LanguageSelector />
            </div>
        </header>
    );
}
