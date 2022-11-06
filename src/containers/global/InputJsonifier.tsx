import { Input } from 'antd'
import React, { Component, Fragment } from 'react'

async function ensureStringifiedJson(raw: string) {
    raw = (raw || '').trim()
    if (!raw.length) {
        return ''
    }

    if (raw.startsWith('{') || raw.startsWith('[')) {
        return raw
    }

    try {
        const { parse } = await import('yaml')
        return JSON.stringify(parse(raw))
    } catch (err) {
        console.log(err)
    }
    return ''
}

export default class InputJsonifier extends Component<
    {
        placeholder?: string
        defaultValue?: string
        onChange: (jsonStringified: string) => void
    },
    {}
> {
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        const self = this
        return (
            <Fragment>
                {' '}
                <Input.TextArea
                    className="code-input"
                    placeholder={self.props.placeholder}
                    rows={10}
                    defaultValue={self.props.defaultValue}
                    onChange={(e) => {
                        ensureStringifiedJson(e.target.value).then((json) => {
                            self.props.onChange(json)
                        })
                    }}
                />
            </Fragment>
        )
    }
}
