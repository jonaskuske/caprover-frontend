import { lazy, useEffect, useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import { Route, Routes } from 'react-router'
import PageRoot from './containers/PageRoot'

const Login = lazy(() => import('./containers/Login'))
const Dashboard = lazy(() => import('./containers/Dashboard'))
const Apps = lazy(() => import('./containers/apps/Apps'))
const AppDetails = lazy(() => import('./containers/apps/appDetails/AppDetails'))
const Monitoring = lazy(() => import('./containers/monitoring/Monitoring'))
const Cluster = lazy(() => import('./containers/nodes/Cluster'))
const Settings = lazy(() => import('./containers/settings/Settings'))
const CatchAllRoute = lazy(() => import('./containers/CatchAllRoute'))
const OneClickApps = lazy(
	() => import('./containers/apps/oneclick/selector/OneClickAppSelector')
)
const OneClickConfig = lazy(
	() => import('./containers/apps/oneclick/variables/OneClickAppConfigPage')
)
export default function App() {
	const { status } = useThemeSwitcher()
	const [ready, setReady] = useState(false)

	useEffect(() => {
		if (status === 'loaded') setReady(true)
	}, [status])

	if (!ready) return null

	return (
		<div className="full-screen">
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<PageRoot />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="apps" element={<Apps />} />
					<Route path="apps/details/:appName" element={<AppDetails />} />
					<Route path="apps/oneclick" element={<OneClickApps />} />
					<Route path="apps/oneclick/:appName" element={<OneClickConfig />} />
					<Route path="monitoring" element={<Monitoring />} />
					<Route path="cluster" element={<Cluster />} />
					<Route path="settings" element={<Settings />} />
					<Route path="*" element={<CatchAllRoute />} />
					<Route index element={<CatchAllRoute />} />
				</Route>
			</Routes>
		</div>
	)
}
