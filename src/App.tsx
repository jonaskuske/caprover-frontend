import React, { Component } from 'react'
import {
    ThemeSwitcherProvider,
    useThemeSwitcher,
} from 'react-css-theme-switcher'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import PageRoot from './containers/PageRoot'
import reducers from './redux/reducers'
import CrashReporter from './utils/CrashReporter'
import StorageHelper from './utils/StorageHelper'

const Login = React.lazy(() => import('./containers/Login'))

CrashReporter.getInstance().init()

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(reducers)
type AppState = {
    isDarkMode: boolean
}

const darkTheme = import.meta.env.DEV
    ? new URL(`./styles/dark-theme.less`, import.meta.url).href
    : `${import.meta.env.BASE_URL}themes/dark-theme.css`
const lightTheme = import.meta.env.DEV
    ? new URL(`./styles/light-theme.less`, import.meta.url).href
    : `${import.meta.env.BASE_URL}themes/light-theme.css`

const themes = {
    dark: darkTheme,
    light: lightTheme,
}

const MainComponent = () => {
    const { status } = useThemeSwitcher()

    if (status === 'loading') {
        // Just an empty div until styles load
        return <div></div>
    }

    return (
        <div className="full-screen">
            <HashRouter>
                <React.Suspense fallback="">
                    <Switch>
                        <Route path="/login/" component={Login} />
                        <Route path="/" component={PageRoot} />
                    </Switch>
                </React.Suspense>
            </HashRouter>
        </div>
    )
}

class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isDarkMode: StorageHelper.getDarkModeFromLocalStorage(),
        }
    }

    render() {
        return (
            <ThemeSwitcherProvider
                themeMap={themes}
                defaultTheme={this.state.isDarkMode ? 'dark' : 'light'}
                insertionPoint="styles-insertion-point"
            >
                <Provider store={store}>
                    <MainComponent />
                </Provider>
            </ThemeSwitcherProvider>
        )
    }
}

export default App
