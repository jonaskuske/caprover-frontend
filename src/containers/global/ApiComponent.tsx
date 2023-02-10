import { Component, useEffect, useState } from 'react'
import ApiManager from '../../api/ApiManager'

export function useApiManager() {
	const [apiManager] = useState(() => new ApiManager())

	useEffect(() => {
		return () => apiManager.destroy()
	}, [])

	return apiManager
}

export default class ApiComponent<P = {}, S = {}> extends Component<P, S> {
	protected willUnmountSoon: boolean
	protected apiManager: ApiManager

	constructor(props: any) {
		super(props)
		this.willUnmountSoon = false
		this.apiManager = new ApiManager()
	}

	componentWillUnmount() {
		this.willUnmountSoon = true
		this.apiManager.destroy()
	}

	render(): React.ReactNode {
		return null
	}
}
