import { BulbFilled, BulbOutlined } from '@ant-design/icons'
import { Switch, SwitchProps } from 'antd'
import { useThemeSwitcher } from 'react-css-theme-switcher'
import StorageHelper from '../../utils/StorageHelper'

export default function DarkModeSwitch(props: SwitchProps) {
	const { switcher, themes } = useThemeSwitcher()

	const onSwitchChange = (checked: boolean) => {
		StorageHelper.setDarkModeInLocalStorage(checked)
		switcher({ theme: checked ? themes.dark : themes.light })
	}

	const checked = StorageHelper.getThemeFromLocalStorage() === 'dark'

	return (
		<Switch
			checkedChildren={<BulbOutlined />}
			unCheckedChildren={<BulbFilled />}
			checked={checked}
			onChange={onSwitchChange}
			style={{
				backgroundColor: checked ? 'rgb(27, 138, 211, 0.6)' : undefined,
			}}
			{...props}
		/>
	)
}
