import { Navigate } from 'react-router'
import ApiManager from '../api/ApiManager'
import AppConstants from '../utils/AppConstants'

export default function LoggedInCatchAll() {
    const loggedIn = ApiManager.isLoggedIn()

    return (
        <Navigate
            to={
                loggedIn
                    ? `/dashboard?${AppConstants.REDIRECT_TO_APPS_IF_READY_REQ_PARAM}=true`
                    : `/login`
            }
        />
    )
}
