import React, { useContext } from "react"
import {useTranslation} from "react-i18next"
import { Link } from "react-router-dom"
import DiscoverPurpose from "../../../components/Discovery/DiscoveryPurpose"
import { AppContext } from "../../../context/app/context"
import "./Discovery.css"

const Discovery: React.FC = () => {
    const { t } = useTranslation("discovery")
    const { state: { user } } = useContext(AppContext)
    return (<>
        <div className="z-0 pointer-events-none opacity-60">
            <img src="img/icons/floating/square.svg" className="absolute top-[450px] md:top-[400px] left-1/4" />
            <img src="img/icons/floating/camera.svg" className="absolute top-[450px] right-[10%] md:block hidden" />
            <img src="img/icons/floating/triangle.svg" className="absolute top-[550px] right-[40%] translate-x-32" />
            <img src="img/icons/floating/star.svg" className="absolute top-[700px] left-[4%]" />
        </div>

        <div className="container mx-auto px-5 md:px-10 font-bold text-neutral-700">
            <div className="py-40 block md:flex mb-5 md:mb-12">
                <div>
                    <div className="flex text-4xl items-center">
                        Bonjour
                        <img src="/img/icons/hello.svg" className="ml-3 w-11 h-11 mt-1" />
                    </div>
                    <div className="text-indigo-400 text-6xl">{ user.firstName }</div>
                </div>
                <div className="flex gap-5 text-lg ml-auto mr-0 items-center mt-6 md:mt-0 text-center xsgrid">
                    <Link to="/">
                        <div className="bg-indigo-400 text-white rounded-xl w-44 md:w-48 py-[11.5px] grid place-items-center">
                            Mon Feed
                        </div>
                    </Link>
                    <Link to={{pathname: "https://github.com/iseplife"}} target="_blank">
                        <div className="border-indigo-400 text-indigo-400 border-[3.5px] rounded-xl w-44 md:w-48 py-2 grid place-items-center">
                            Voir sur GitHub
                        </div>
                    </Link>
                </div>

            </div>
            <div>
                <div className="bg-indigo-400 rounded-full w-16 h-3"></div>
                <div className="text-2xl mt-2">La vie étudiante simplifiée</div>
            </div>
            <div className="grid gap-y-16 gap-x-10 grid-cols-1 lg:grid-cols-3 pt-20 md:pt-28 px-2 text-lg font-normal text-center">
                <DiscoverPurpose description={t("purposes.2.description")} img="event" />
                <DiscoverPurpose description={t("purposes.0.description")} img="network" />
                <DiscoverPurpose description={t("purposes.1.description")} img="people" />
            </div>
        </div>
        <img src="img/wave.svg" draggable="false" className="mt-5" />
        <div className="bg-indigo-400">
            <div className="container mx-auto px-5 md:px-10 font-bold text-white/[98%]">
                <div className="mb-5">
                    <div className="bg-white rounded-full w-16 h-3"></div>
                    <div className="text-2xl mt-2">Les associations</div>
                </div>

                <div className="mb-5">
                    <div className="bg-white rounded-full w-16 h-3"></div>
                    <div className="text-2xl mt-2">Les élèves</div>
                </div>
                s
            </div>
        </div>
    </>)
}
export default Discovery