import {Avatar, Divider, Empty, Select} from "antd";
import React, {useState} from "react";
import {globalSearch} from "../../data/searchbar";
import {useHistory} from "react-router-dom";
import {SearchItem, SearchItemType} from "../../data/searchbar/types";
import {useTranslation} from "react-i18next";
import './searchBar.css'
import {IconFA} from "../Common/IconFA";

const {Option} = Select;
const SEARCH_LENGTH_TRIGGER: number = 2;

interface SelectInputProps {
    id?: number
    type?: string
    text: string
    value: string
    thumbURL: string
    status: boolean
}

interface CustomCheckBoxProps {
    title: string
    filterStatus: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: React.FC<CustomCheckBoxProps> = ({title, filterStatus, onChange}) => (
    <>
        <input type="checkbox" className="appearance-none pills"
               id={`switch-${title.toLowerCase()}`}
               onMouseDown={e => e.preventDefault()}
               onChange={onChange} checked={filterStatus}/>
        <label
            className="label-pills inline-flex items-center rounded-full border text-xs
                    border-indigo-500 text-indigo-500 px-2 my-auto mx-1 ml-1 cursor-pointer
                    hover:text-white hover:bg-indigo-700 active:bg-indigo-500 active:text-white"
            htmlFor={`switch-${title.toLowerCase()}`}>{title}</label>
    </>
);

const AvatarSearchType: React.FC<{ props: SelectInputProps }> = ({props}) => {
    let iconType: string = "";
    if (props.type === SearchItemType.STUDENT)
        iconType = "user"
    if (props.type === SearchItemType.EVENT)
        iconType = "calendar-day"
    if (props.type === SearchItemType.CLUB)
        iconType = "users"
    return (
        <>
            <Avatar src={props.thumbURL} size={"small"}
                    shape={"circle"}>
                {props.text.split(" ")[0].slice(0, 1)}
            </Avatar>
            <div className="z-10" style={{fontSize: ".65rem"}}>
                <IconFA
                    className="-ml-2 mt-3 bg-white rounded-full border-4 border-transparent text-gray-600"
                    name={`fa-${iconType}`}/>
            </div>
        </>
    );
};

const SearchBar: React.FC = () => {
    const {t} = useTranslation('search');
    let history = useHistory();
    const [data, setData] = useState<SelectInputProps[]>([]);
    const [currentValue, setCurrentValue] = useState<string>("");
    const [fetching, setFetching] = useState<boolean>(false);

    const [filterStudent, setFilterStudent] = useState<boolean>(true);
    const [filterEvent, setFilterEvent] = useState<boolean>(true);
    const [filterClub, setFilterClub] = useState<boolean>(true);

    /**
     * Call to global search in API
     * @param queryParams
     */
    const updateSearchItems = (queryParams: string) => {
        setFetching(true);
        globalSearch(queryParams, 0).then(res => {
            const searchItems: SearchItem[] = res.data.content;
            const data: SelectInputProps[] = [];
            searchItems.map((searchItem: SearchItem) => {
                return (
                    data.push({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL,
                        status: searchItem.status
                    }));
            });
            setData(data);
        }).finally(() => setFetching(false));
    };

    /**
     * Fires when input change
     * @param value
     */
    const handleSearch = (value: string) => {
        setCurrentValue(value);
        if (!!value && value.length > SEARCH_LENGTH_TRIGGER) {
            if (currentValue !== value) {
                updateSearchItems(value);
            }
        }
    };

    /**
     * Fires when item is selected
     */
    const handleSelect = (value: string) => {
        setCurrentValue("");
        history.push("/" + value);
    };

    const renderOptions = () => {
        return data.map((inputProps: SelectInputProps) => {
            return ((inputProps.type === SearchItemType.STUDENT && filterStudent) || (inputProps.type === SearchItemType.EVENT && filterEvent) || (inputProps.type === SearchItemType.CLUB && filterClub))
                ? (<Option key={inputProps.value}
                           value={`${inputProps.type?.toLowerCase()}/${inputProps.id}`}>
                    <div className="flex justify-between">
                        <div className="inline-flex">
                            <AvatarSearchType props={inputProps}/>
                            <div className="ml-2 font-bold">{inputProps.text}</div>
                        </div>
                        <span style={{fontSize: ".65rem"}}
                              className={`inline-flex items-center font-semibold rounded-full px-2 my-1 ${inputProps.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                        {inputProps.status ? t("status_active") : inputProps.type === SearchItemType.EVENT ? t("status_passed") : t("status_archived")}
                    </span>
                    </div>
                </Option>)
                : null;
        })
    };

    const customDropdownRender = (menu: React.ReactNode) => (
        <>
            <div className="inline-flex flex-no-wrap p-2 mx-auto items-center">
                <CustomCheckbox title={t("student")} filterStatus={filterStudent}
                                onChange={(e) => setFilterStudent(e.target.checked)}/>
                <CustomCheckbox title={t("club")} filterStatus={filterClub}
                                onChange={(e) => setFilterClub(e.target.checked)}/>
                <CustomCheckbox title={t("event")} filterStatus={filterEvent}
                                onChange={(e) => setFilterEvent(e.target.checked)}/>
            </div>
            <Divider className="my-1"/>
            {menu}
        </>
    );

    return (
        <Select showSearch
                showArrow={false}
                filterOption={false}
                defaultActiveFirstOption={false}
                value={!!currentValue ? currentValue : undefined}
                loading={fetching}
                placeholder={t("placeholder")}
                className="my-auto w-4/5 md:w-2/5 lg:w-5/12 xl:w-1/5"
                notFoundContent={<Empty className="flex flex-col items-center"
                                        image={"/img/meme-face.png"}
                                        description={t("funny_empty_message")}/>}
                onSearch={handleSearch}
                onSelect={handleSelect}
                dropdownRender={menu => customDropdownRender(menu)}>
            {renderOptions()}
        </Select>
    );
};

export default SearchBar;