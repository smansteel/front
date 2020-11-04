import React, {useEffect} from "react"
import Calendar from "react-calendar"
import {useTranslation} from "react-i18next"
import {useRecoilState} from "recoil/dist"
import {filterState} from "../../pages/default/calendar"
import { Checkbox, Switch} from "antd"
import {isAdmin} from "../../data/security"
import "./SideCalendar.css"
import FeedFilter from "../Feed/FeedFilter"

type SideCalendarProps = {
    date: Date
    handleDate: (d: Date) => void
};
const SideCalendar: React.FC<SideCalendarProps> = ({date, handleDate}) => {
    const {t, i18n} = useTranslation("event")
    const [filter, setFilter] = useRecoilState(filterState)

    const handleChange = (type: string, name: string | number) => {
        setFilter(prev => {
            switch (type) {
                case "TOGGLE_TYPE":
                    return ({
                        ...prev,
                        types: {
                            ...prev.types,
                            [name]: !prev.types[name]
                        }
                    })
                case "TOGGLE_PUBLISHED":
                    return ({
                        ...prev,
                        publishedOnly: !prev.publishedOnly
                    })
                case "TOGGLE_ADMIN":
                    return ({
                        ...prev,
                        adminVision: !prev.adminVision
                    })
                default:
                    return prev
            }
        })
    }

    return (
        <div id="side-cal" className="md:w-1/5 w-full shadow bg-white p-4">
            <div className="sticky w-full" style={{top: "1rem"}}>
                <Calendar
                    locale={i18n.language}
                    value={date}
                    onChange={(d) => handleDate(Array.isArray(d) ? d[0] : d)}
                />
                <hr className="my-1"/>
                <div className="mt-2">
                    {isAdmin() &&
                    <>
                        <div className="flex items-center">
                            <h3 className="text-gray-600 font-dinotcb uppercase mb-0">{t("admin_view")} :</h3>
                            <Switch className="ml-4" size="small" checked={filter.adminVision} onChange={() => handleChange("TOGGLE_ADMIN", "")}/>
                        </div>
                        <div className="flex items-center">
                            <h3 className="text-gray-600 font-dinotcb uppercase mb-0">{t("published_only")} :</h3>
                            <Switch className="ml-4" size="small" checked={filter.publishedOnly} onChange={() => handleChange("TOGGLE_PUBLISHED", "")}/>
                        </div>
                    </>
                    }
                    <hr className="my-1"/>
                    <h3 className="text-gray-600 font-dinotcb uppercase mt-2">Feed :</h3>
                    <FeedFilter onChange={() => null} />
                    <h3 className="text-gray-600 font-dinotcb uppercase mt-2">Types :</h3>
                    <div id="types-filter" className="flex flex-wrap">
                        {Object.entries(filter.types).map(([type, visible]) => (
                            <Checkbox className="w-1/2 mx-0 text-black" key={type} onChange={() => handleChange("TOGGLE_TYPE", type)} checked={visible}>
                                {t(`type.${type}`)}
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideCalendar