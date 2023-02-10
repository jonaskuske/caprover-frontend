import { message } from 'antd'

export type CaptainError = { captainStatus?: string; captainMessage?: string }

export default class Toaster {
    static toast(error: string | CaptainError) {
        let msg = 'Something bad happened.'

        if (typeof error === 'string') msg = error
        else if (error) {
            msg = error.captainMessage ?? msg
            if (error.captainStatus) msg = `${error.captainStatus} : ${msg}`
        }

        message.error(msg)
        if (!!import.meta.env.VITE_IS_DEBUG) console.error(error)
    }

    static createCatcher(callback?: Function) {
        return function (error: CaptainError) {
            Toaster.toast(error)
            if (callback) callback(error)
        }
    }
}
