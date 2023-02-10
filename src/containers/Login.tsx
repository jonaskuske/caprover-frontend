import { LockOutlined } from '@ant-design/icons'
import {
	Button,
	Card,
	Collapse,
	Form,
	Grid,
	Input,
	Radio,
	Row,
	Space,
	Tooltip,
	TooltipProps,
} from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import ApiManager from '../api/ApiManager'
import StorageHelper from '../utils/StorageHelper'
import Toaster, { CaptainError } from '../utils/Toaster'
import Utils from '../utils/Utils'
import { useApiManager } from './global/ApiComponent'

const Item = Form.Item

enum Persistence {
	None = '1',
	Session = '2',
	Permanent = '3',
}

type LoginData = {
	password: string
	persistence: Persistence
}

export default function Login() {
	const navigate = useNavigate()
	const location = useLocation()

	const apiManager = useApiManager()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const isLoggedIn = ApiManager.isLoggedIn()

	useEffect(() => {
		if (!isLoggedIn) Utils.deleteAllCookies()
	}, [isLoggedIn])

	async function handleSubmit({ password, persistence }: LoginData) {
		try {
			setIsSubmitting(true)
			const token = await apiManager.getAuthToken(password)

			if (persistence === Persistence.Session) {
				StorageHelper.setAuthKeyInSessionStorage(token)
			} else if (persistence === Persistence.Permanent) {
				StorageHelper.setAuthKeyInLocalStorage(token)
			}

			navigate(location.state.from ?? '/', { replace: true })
		} catch (err) {
			setIsSubmitting(false)
			Toaster.toast(err as CaptainError)
		}
	}

	if (isLoggedIn) return <Navigate to={location.state.from ?? '/'} replace />

	const intialData: LoginData = {
		persistence: Persistence.None,
		password: '',
	}

	return (
		<Row align="middle" justify="center" style={{ height: '100%', padding: 8 }}>
			<Card title="CapRover Login" style={{ width: '100%', maxWidth: 380 }}>
				<Form
					disabled={isSubmitting}
					onFinish={(data: LoginData) => handleSubmit(data)}
					initialValues={intialData}
					onFinishFailed={() => Toaster.toast('Password is required.')}
				>
					<Space direction="vertical" size="large" style={{ width: '100%' }}>
						<Item name="password" rules={[{ required: true, message: '' }]}>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder="Password"
								aria-label="Password"
								autoFocus
							/>
						</Item>

						<Row justify="end" style={{ marginTop: -24 }}>
							<Button loading={isSubmitting} type="primary" htmlType="submit">
								Login
							</Button>
						</Row>

						<Collapse>
							<Collapse.Panel header="Remember Me" key="1" forceRender>
								<Item noStyle name="persistence">
									<Radio.Group>
										<Space direction="vertical">
											<RadioTooltip title="Require login every time CapRover loads.">
												<Radio value={Persistence.None}>No persistence</Radio>
											</RadioTooltip>

											<RadioTooltip title="Stay logged in until all CapRover tabs are closed.">
												<Radio value={Persistence.Session}>
													For this session
												</Radio>
											</RadioTooltip>
											<RadioTooltip title="Stay logged in until manually logging out.">
												<Radio value={Persistence.Permanent}>Permanently</Radio>
											</RadioTooltip>
										</Space>
									</Radio.Group>
								</Item>
							</Collapse.Panel>
						</Collapse>
					</Space>
				</Form>
			</Card>
		</Row>
	)
}

function RadioTooltip(props: TooltipProps) {
	const { lg } = Grid.useBreakpoint()

	return (
		<Tooltip
			placement={lg ? 'left' : 'right'}
			autoAdjustOverflow={false}
			color="#1b8ad3"
			overlayStyle={{ marginRight: 15, width: 'auto', pointerEvents: 'none' }}
			{...props}
		/>
	)
}
