import React, {useContext, useLayoutEffect, useState} from "react"
import {
    Redirect,
    Route,
    Switch,
} from "react-router-dom"
import {getLoggedUser} from "../../data/student"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import LoadingPage from "../../pages/LoadingPage"
import {AppContext} from "../../context/app/context"
import {AppActionType} from "../../context/app/action"
import {Roles} from "../../data/security/types"
import {wsURI} from "../../data/http"
import { getJWT } from "../../data/security"
import { initWebSocket } from "../../realtime/websocket/WSServerClient"


const Template: React.FC = () => {
    const {state, dispatch} = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    useLayoutEffect(() => {
        getLoggedUser().then(res => {
            const socket = initWebSocket(wsURI)

            dispatch({type: AppActionType.SET_LOGGED_USER, user: res.data})
            setIsAdmin(state.payload.roles.includes(Roles.ADMIN))

            socket.connect(getJWT())
        }).finally(() => setLoading(false))
    }, [])

    return loading ?
        <LoadingPage/>
        :
        <Switch>
            <Route path="/admin" render={({location}) =>
                (
                    isAdmin ?
                        <AdminTemplate/> :
                        <Redirect
                            to={{
                                pathname: "/404",
                                state: {from: location}
                            }}
                        />
                )}
            />
            <Route path="/" component={DefaultTemplate}/>
        </Switch>
}

export default Template
