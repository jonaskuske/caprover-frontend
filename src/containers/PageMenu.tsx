import * as icon from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { useApiManager } from './global/ApiComponent'

const MENU_ITEMS = [
	{ key: '/dashboard', label: 'Dashboard', icon: <icon.LaptopOutlined /> },
	{ key: '/apps', label: 'Apps', icon: <icon.CodeOutlined /> },
	{
		key: '/monitoring',
		label: 'Monitoring',
		icon: <icon.DashboardOutlined />,
	},
	{ key: '/cluster', label: 'Cluster', icon: <icon.ClusterOutlined /> },
	{ key: '/settings', label: 'Settings', icon: <icon.SettingOutlined /> },
]

const MENU_KEYS = MENU_ITEMS.map((item) => item.key)

const MENU_ITEMS_MOBILE = [
	{
		type: 'divider',
		style: {
			width: '80%',
			margin: 'auto auto 0',
			borderColor: 'rgba(255, 255, 255, 0.65)',
		},
	} as const,
	{
		key: 'https://github.com/caprover/caprover',
		label: 'GitHub',
		icon: <icon.GithubOutlined />,
	},
	{
		key: 'https://caprover.com',
		label: 'Docs',
		icon: <icon.FileTextOutlined />,
	},
	{
		key: '@logout',
		label: 'Logout',
		icon: <icon.LogoutOutlined />,
	},
]
const MENU_ITEM_UPDATE = {
	key: '/settings#updates',
	label: 'Update available!',
	icon: <icon.ExclamationCircleFilled />,
	danger: true,
	style: { marginTop: 'auto' },
}

type Props = MenuProps & { showUpdate?: boolean }

export function PageMenu({ showUpdate, onClick, ...props }: Props) {
	const location = useLocation()
	const navigate = useNavigate()
	const apiManager = useApiManager()
	const isMobile = useSelector((state: any) => state.globalReducer.isMobile)

	const menuItems: ItemType[] = [...MENU_ITEMS]

	if (isMobile) {
		menuItems.push(...MENU_ITEMS_MOBILE)
	} else if (showUpdate) {
		menuItems.push(MENU_ITEM_UPDATE)
	}

	function handleMenuClick(info: MenuInfo) {
		const { key } = info

		if (key === '@logout') {
			apiManager.setAuthToken('')
			navigate('/login', { replace: true, state: { from: location } })
		} else if (key.startsWith('/')) {
			navigate(key)
		} else {
			window.open(key, '_blank', 'noopener,noreferrer')
		}

		onClick?.(info)
	}

	return (
		<Menu
			theme="dark"
			mode="inline"
			items={menuItems}
			selectedKeys={[
				MENU_KEYS.find((key) => location.pathname.startsWith(key)) || '',
			]}
			style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
			onClick={handleMenuClick}
			{...props}
		/>
	)
}
