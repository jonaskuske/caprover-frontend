import { Tooltip } from 'antd'
import { Component } from 'react'
import { formatToRelativeTime } from '../../utils/Utils'

export default class Timestamp extends Component<{ timestamp: string }, {}> {
	render() {
		const timestamp = this.props.timestamp
		return (
			<Tooltip title={formatToRelativeTime(new Date(timestamp))}>
				<span>{new Date(timestamp).toLocaleString()}</span>
			</Tooltip>
		)
	}
}
