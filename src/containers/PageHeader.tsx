import * as icon from '@ant-design/icons'
import { Button, ButtonProps, Layout, Space } from 'antd'
import { MouseEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useLinkClickHandler } from 'react-router-dom'
import { useApiManager } from './global/ApiComponent'
import DarkModeSwitch from './global/DarkModeSwitch'
import NewTabLink from './global/NewTabLink'

type Props = { showUpdate?: boolean; toggle(): void }

export function PageHeader(props: Props) {
	const apiManager = useApiManager()
	const location = useLocation()
	const isMobile = useSelector((state: any) => state.globalReducer.isMobile)
	const goToSettings = useLinkClickHandler<HTMLElement>('/settings#updates')
	const goToLogin = useLinkClickHandler<HTMLElement>('/login', {
		replace: true,
		state: { from: location },
	})

	return (
		<Layout.Header style={{ padding: isMobile && '0 15px', display: 'flex' }}>
			{isMobile ? (
				<Hamburger style={{ margin: 'auto 0' }} onClick={props.toggle} />
			) : (
				<span style={{ color: '#fff', fontSize: 16 }}>
					<Logo width="45" height="45" style={{ marginRight: 10 }} />
					CapRover
				</span>
			)}

			<Space size={isMobile ? 12 : 64} style={{ marginLeft: 'auto' }}>
				{!isMobile && (
					<div>
						<NewTabLink url="https://github.com/caprover/caprover">
							GitHub
						</NewTabLink>
						<NewTabLink url="https://caprover.com" style={{ marginLeft: 16 }}>
							Docs
						</NewTabLink>
					</div>
				)}

				<DarkModeSwitch />

				{!isMobile && (
					<Button
						style={{ border: '1px solid #1b8ad3', borderRadius: 5 }}
						type="link"
						icon={<icon.LogoutOutlined />}
						href="/login"
						onClick={(evt) => {
							apiManager.setAuthToken('')
							goToLogin(evt)
						}}
					>
						Logout
					</Button>
				)}

				{props.showUpdate && (
					<Update
						onClick={(evt) => !evt.defaultPrevented && goToSettings(evt)}
					/>
				)}
			</Space>
		</Layout.Header>
	)
}

function Hamburger(props: ButtonProps) {
	return (
		<Button
			ghost
			size="large"
			shape="round"
			icon={<icon.BarsOutlined />}
			aria-label="Toggle menu"
			{...props}
		/>
	)
}

function Logo(props: JSX.IntrinsicElements['img']) {
	return <img alt="" src="/icon-512x512.png" {...props} />
}

type UpdateProps = Omit<ButtonProps, 'onClick'> & {
	onClick: MouseEventHandler<HTMLElement>
}

function Update(props: UpdateProps) {
	return (
		<Button
			ghost
			style={{ margin: 'auto 0 auto auto' }}
			icon={<icon.ExclamationCircleFilled />}
			size="large"
			shape="round"
			danger
			href="/settings"
			{...props}
		>
			Update available!
		</Button>
	)
}
