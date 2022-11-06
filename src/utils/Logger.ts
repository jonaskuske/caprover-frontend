export default class Logger {
    static log(s: string) {
        console.log(s)
    }

    static error(s: any) {
        console.error(s)
    }

    static dev(s: string) {
        if (import.meta.env.VITE_IS_DEBUG) {
            console.log('>>> ', s)
        }
    }
}
