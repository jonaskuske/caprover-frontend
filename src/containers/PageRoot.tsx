import { Grid, Layout } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
import ApiManager from '../api/ApiManager'
import { IVersionInfo } from '../models/IVersionInfo'
import StorageHelper from '../utils/StorageHelper'
import { ContentContext } from '../utils/Utils'
import { useApiManager } from './global/ApiComponent'
import { PageHeader } from './PageHeader'
import { PageMenu } from './PageMenu'

export default function PageRoot() {
	const location = useLocation()
	const contentElement = useRef<HTMLDivElement | null>(null)

	const isMobile: boolean = useSelector(
		(rootState: any) => rootState.globalReducer.isMobile
	)
	const rootKey: string = useSelector(
		(rootState: any) => rootState.globalReducer.rootElementKey
	)

	const isLarge = Grid.useBreakpoint().lg
	const collapsedPref = StorageHelper.getSiderCollapsedStateFromLocalStorage()
	const getCollapsed = (val: boolean) => isMobile || (collapsedPref ?? val)
	const [collapsed, setCollapsed] = useState(getCollapsed(!isLarge))

	const apiManager = useApiManager()
  const [versionInfo, setVersionInfo] = useState<IVersionInfo | undefined>()

	useEffect(() => {
		let cancelled = false

		apiManager.getVersionInfo().then(
			(data) => !cancelled && setVersionInfo(data),
			(err) => {}
		)

		return () => void (cancelled = true)
	}, [apiManager])

	const onCollapse = (val: boolean, type: 'responsive' | 'clickTrigger') => {
		if (type === 'clickTrigger') {
			StorageHelper.setSiderCollapsedStateInLocalStorage(val)
			setCollapsed(val)
			return
		}

		setCollapsed(getCollapsed(val))
	}

	useEffect(() => {
		if (isLarge != null) setCollapsed(getCollapsed(!isLarge))
	}, [isMobile, isLarge])

	if (!ApiManager.isLoggedIn()) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	return (
		<Layout className="full-screen">
			<PageHeader
				showUpdate={versionInfo?.canUpdate && isMobile}
				toggle={() => setCollapsed(!collapsed)}
			/>

			<Layout hasSider>
				<Layout.Sider
					breakpoint="lg"
					trigger={isMobile && null}
					collapsible
					collapsed={collapsed}
					width={200}
					collapsedWidth={isMobile ? 0 : 80}
					style={{ zIndex: 2 }}
					onCollapse={onCollapse}
				>
					<PageMenu showUpdate={versionInfo?.canUpdate && !isMobile} />
				</Layout.Sider>

				<Layout.Content id="content-element" ref={contentElement} key={rootKey}>
					<React.Suspense fallback={null}>
						<ContentContext.Provider value={contentElement.current}>
							<Outlet />
						</ContentContext.Provider>
					</React.Suspense>
				</Layout.Content>
			</Layout>
		</Layout>
	)
}
