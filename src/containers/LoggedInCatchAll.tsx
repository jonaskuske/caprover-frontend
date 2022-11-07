import { Navigate, useLocation } from 'react-router'
import ApiManager from '../api/ApiManager'

export default function LoggedInCatchAll() {
	const location = useLocation()
	const loggedIn = ApiManager.isLoggedIn()

	return (
		<Navigate
			to={loggedIn ? `/dashboard` : `/login`}
			state={{ from: location, redirectToAppsIfReady: true }}
			replace
		/>
	)
}
