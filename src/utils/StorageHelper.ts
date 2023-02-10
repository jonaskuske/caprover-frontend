const fallbackNoOps = {
    getItem(k: string) {
        return ''
    },
    setItem(k: string, v: string) {},
}
const localStorage = window.localStorage ? window.localStorage : fallbackNoOps
const sessionStorage = window.sessionStorage
    ? window.sessionStorage
    : fallbackNoOps

const AUTH_KEY = 'CAPROVER_AUTH_KEY'
const SIDER_COLLAPSED_STATE = 'CAPROVER_SIDER_COLLAPSED_STATE'
const DARK_MODE = 'CAPROVER_DARK_MODE'
class StorageHelper {
    getAuthKeyFromStorage() {
        const localStorageAuth = localStorage.getItem(AUTH_KEY)
        return localStorageAuth
            ? localStorageAuth
            : sessionStorage.getItem(AUTH_KEY) || ''
    }

    clearAuthKeys() {
        localStorage.setItem(AUTH_KEY, '')
        sessionStorage.setItem(AUTH_KEY, '')
    }

    setAuthKeyInSessionStorage(authKey: string) {
        sessionStorage.setItem(AUTH_KEY, authKey)
        localStorage.setItem(AUTH_KEY, '')
    }

    setAuthKeyInLocalStorage(authKey: string) {
        localStorage.setItem(AUTH_KEY, authKey)
        sessionStorage.setItem(AUTH_KEY, '')
    }

    setSiderCollapsedStateInLocalStorage(value: boolean) {
        localStorage.setItem(SIDER_COLLAPSED_STATE, JSON.stringify(value))
    }

    getSiderCollapsedStateFromLocalStorage() {
        const value = localStorage.getItem(SIDER_COLLAPSED_STATE)
        return value ? (JSON.parse(value) as boolean) : null
    }

    setDarkModeInLocalStorage(isDarkMode: boolean) {
        localStorage.setItem(DARK_MODE, JSON.stringify(isDarkMode))
    }

    getThemeFromLocalStorage(): 'dark' | 'light' {
        const stored = localStorage.getItem(DARK_MODE)
        // If not preference exists, return DarkMode based on users colorScheme

        const isDarkMode = stored
            ? JSON.parse(stored)
            : window?.matchMedia('(prefers-color-scheme: dark)').matches

        return isDarkMode ? 'dark' : 'light'
    }
}

const instance = new StorageHelper()
export default instance
