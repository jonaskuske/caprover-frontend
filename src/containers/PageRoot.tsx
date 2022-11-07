import {
	BarsOutlined,
	ClusterOutlined,
	CodeOutlined,
	DashboardOutlined,
	FileTextOutlined,
	GiftTwoTone,
	GithubOutlined,
	LaptopOutlined,
	LogoutOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import React, { Fragment, RefObject } from 'react'
import { connect } from 'react-redux'
import {
	Navigate,
	NavigateFunction,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router'
import ApiManager from '../api/ApiManager'
import { IVersionInfo } from '../models/IVersionInfo'
import * as GlobalActions from '../redux/actions/GlobalActions'
import StorageHelper from '../utils/StorageHelper'
import ApiComponent from './global/ApiComponent'
import ClickableLink from './global/ClickableLink'
import DarkModeSwitch from './global/DarkModeSwitch'
import NewTabLink from './global/NewTabLink'

const Dashboard = React.lazy(() => import('./Dashboard'))
const AppDetails = React.lazy(() => import('./apps/appDetails/AppDetails'))
const Apps = React.lazy(() => import('./apps/Apps'))
const Monitoring = React.lazy(() => import('./monitoring/Monitoring'))
const Cluster = React.lazy(() => import('./nodes/Cluster'))
const Settings = React.lazy(() => import('./settings/Settings'))
const LoggedInCatchAll = React.lazy(() => import('./LoggedInCatchAll'))
const OneClickAppConfigPage = React.lazy(
	() => import('./apps/oneclick/variables/OneClickAppConfigPage'),
)
const OneClickAppSelector = React.lazy(
	() => import('./apps/oneclick/selector/OneClickAppSelector'),
)

const { Header, Content, Sider } = Layout

const MENU_ITEMS = [
	{
		key: '/dashboard',
		label: 'Dashboard',
		icon: <LaptopOutlined />,
	},
	{
		key: '/apps',
		label: 'Apps',
		icon: <CodeOutlined />,
	},
	{
		key: '/monitoring',
		label: 'Monitoring',
		icon: <DashboardOutlined />,
	},
	{
		key: '/cluster',
		label: 'Cluster',
		icon: <ClusterOutlined />,
	},
	{
		key: '/settings',
		label: 'Settings',
		icon: <SettingOutlined />,
	},
]

interface RootPageInterface {
	rootElementKey: string
	emitSizeChanged: () => void
	isMobile: boolean
	location: Location
	navigate: NavigateFunction
}

class PageRoot extends ApiComponent<
	RootPageInterface,
	{
		versionInfo: IVersionInfo | undefined
		collapsed: boolean
	}
> {
	private mainContainer: RefObject<HTMLDivElement>

	constructor(props: any) {
		super(props)
		this.mainContainer = React.createRef()
		this.state = {
			versionInfo: undefined,
			collapsed: false,
		}
	}

	updateDimensions = () => this.props.emitSizeChanged()

	componentWillUnmount() {
		// @ts-ignore
		if (super.componentWillUnmount) super.componentWillUnmount()
		this.updateDimensions()
		window.removeEventListener('resize', this.updateDimensions)
	}

	componentDidUpdate(prevProps: any) {
		// Typical usage (don't forget to compare props):
		if (
			this.props.location.pathname !== prevProps.location.pathname &&
			this.props.isMobile
		) {
			this.setState({ collapsed: true })
		}
	}

	componentDidMount() {
		const self = this
		this.updateDimensions()

		window.addEventListener('resize', this.updateDimensions)

		if (ApiManager.isLoggedIn()) {
			this.apiManager
				.getVersionInfo()
				.then(function (data) {
					self.setState({ versionInfo: data })
				})
				.catch((err) => {
					// ignore error
				})
			this.setState({
				collapsed: StorageHelper.getSiderCollapsedStateFromLocalStorage(),
			})
		}
	}

	goToLogin() {
		this.props.navigate('/login', {
			replace: true,
			state: { from: this.props.location },
		})
	}

	createUpdateAvailableIfNeeded() {
		const self = this

		if (!self.state.versionInfo || !self.state.versionInfo.canUpdate) {
			return undefined
		}

		return (
			<Fragment>
				<ClickableLink onLinkClicked={() => self.props.navigate('/settings')}>
					<GiftTwoTone
						style={{
							marginLeft: 50,
						}}
					/>
					<GiftTwoTone
						style={{
							marginRight: 10,
							marginLeft: 3,
						}}
					/>
					Update Available!
					<GiftTwoTone
						style={{
							marginLeft: 10,
						}}
					/>
					<GiftTwoTone
						style={{
							marginLeft: 3,
						}}
					/>
				</ClickableLink>
			</Fragment>
		)
	}

	toggleSider = () => {
		StorageHelper.setSiderCollapsedStateInLocalStorage(!this.state.collapsed)
		this.setState({ collapsed: !this.state.collapsed })
	}

	render() {
		const self = this

		if (!ApiManager.isLoggedIn()) {
			return (
				<Navigate to="/login" replace state={{ from: this.props.location }} />
			)
		}

		return (
			<Layout className="full-screen">
				<Header
					className="header"
					style={{
						padding: `0 ${this.props.isMobile ? 15 : 50}px`,
					}}
				>
					<div>
						<Row>
							{this.props.isMobile && (
								<Col span={4}>
									<Button
										ghost
										icon={<BarsOutlined />}
										onClick={this.toggleSider}
									/>
								</Col>
							)}
							{(this.props.isMobile &&
								self.createUpdateAvailableIfNeeded()) || (
								<Col lg={{ span: 12 }} xs={{ span: 20 }}>
									<div>
										<h3 style={{ color: '#fff' }}>
											<img
												alt="logo"
												src="/icon-512x512.png"
												style={{
													height: 45,
													marginRight: 10,
												}}
											/>
											CapRover
											{self.createUpdateAvailableIfNeeded()}
										</h3>
									</div>
								</Col>
							)}
							{!self.props.isMobile && (
								<Col span={12}>
									<Row justify="end">
										<NewTabLink url="https://github.com/caprover/caprover">
											<span style={{ marginRight: 20 }}>GitHub</span>
										</NewTabLink>

										<span
											style={{
												marginRight: 70,
											}}
										>
											<NewTabLink url="https://caprover.com">Docs</NewTabLink>
										</span>
										<span
											style={{
												marginRight: 70,
											}}
										>
											<DarkModeSwitch />
										</span>
										<span>
											<span
												style={{
													border: '1px solid #1b8ad3',
													borderRadius: 5,
													padding: 8,
												}}
											>
												<ClickableLink
													onLinkClicked={() => {
														self.apiManager.setAuthToken('')
														self.goToLogin()
													}}
												>
													Logout <LogoutOutlined />
												</ClickableLink>
											</span>
										</span>
									</Row>
								</Col>
							)}
						</Row>
					</div>
				</Header>

				<Layout>
					<Sider
						breakpoint="lg"
						trigger={this.props.isMobile && undefined}
						collapsible
						collapsed={this.state.collapsed}
						width={200}
						collapsedWidth={self.props.isMobile ? 0 : 80}
						style={{ zIndex: 2 }}
						onCollapse={this.toggleSider}
					>
						<Menu
							selectedKeys={[this.props.location.pathname]}
							theme="dark"
							mode="inline"
							defaultSelectedKeys={['dashboard']}
							style={{ borderRight: 0 }}
							onClick={({ key }) => {
								if (key === 'logout') {
									this.apiManager.setAuthToken('')
									this.goToLogin()
								} else if (/https?:\/\//.test(key)) {
									window.open(key, '_blank', 'noopener,noreferrer')
								} else {
									this.props.navigate(`${key}`)
								}
							}}
							items={
								this.props.isMobile
									? [
											...MENU_ITEMS,
											{ type: 'divider' },
											{
												key: 'https://github.com/caprover/caprover',
												label: 'GitHub!',
												icon: <GithubOutlined />,
											},
											{
												key: 'https://caprover.com',
												label: 'Docs',
												icon: <FileTextOutlined />,
											},
											{
												key: 'logout',
												label: 'Logout',
												icon: <LogoutOutlined />,
											},
									  ]
									: MENU_ITEMS
							}
						></Menu>
					</Sider>
					<Content>
						<div
							key={self.props.rootElementKey}
							ref={self.mainContainer}
							style={{
								paddingTop: 12,
								paddingBottom: 36,
								height: '100%',
								overflowY: 'scroll',
								marginRight: self.state.collapsed
									? 0
									: self.props.isMobile
									? -200
									: 0,
								transition: 'margin-right 0.3s ease',
							}}
							id="main-content-layout"
						>
							<React.Suspense fallback={null}>
								<Routes>
									<Route path="/dashboard/" element={<Dashboard />} />
									<Route
										path="/apps/details/:appName"
										element={<AppDetails mainContainer={self.mainContainer} />}
									/>
									<Route
										path="/apps/oneclick/:appName"
										element={<OneClickAppConfigPage />}
									/>
									<Route
										path="/apps/oneclick"
										element={<OneClickAppSelector />}
									/>
									<Route path="/apps/" element={<Apps />} />
									<Route path="/monitoring/" element={<Monitoring />} />
									<Route path="/cluster/" element={<Cluster />} />
									<Route path="/settings/" element={<Settings />} />
									<Route path="/*" element={<LoggedInCatchAll />} />
								</Routes>
							</React.Suspense>
						</div>
					</Content>
				</Layout>
			</Layout>
		)
	}
}

function mapStateToProps(state: any) {
	return {
		rootElementKey: state.globalReducer.rootElementKey,
		isMobile: state.globalReducer.isMobile,
	}
}

function RoutedPageRoot(props: any) {
	const location = useLocation()
	const navigate = useNavigate()
	return <PageRoot location={location} navigate={navigate} {...props} />
}

export default connect(mapStateToProps, {
	emitSizeChanged: GlobalActions.emitSizeChanged,
})(RoutedPageRoot)
