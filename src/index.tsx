import React from 'react'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import App from './App'
import reducers from './redux/reducers'
import CrashReporter from './utils/CrashReporter'
import StorageHelper from './utils/StorageHelper'

CrashReporter.getInstance().init()

const store = createStore(reducers, applyMiddleware(thunk))

const dark = import.meta.env.DEV
	? new URL(`./styles/dark-theme.less?direct`, import.meta.url).href
	: `${import.meta.env.BASE_URL}assets/dark-theme.css`
const light = import.meta.env.DEV
	? new URL(`./styles/light-theme.less?direct`, import.meta.url).href
	: `${import.meta.env.BASE_URL}assets/light-theme.css`

const defaultTheme = StorageHelper.getDarkModeFromLocalStorage()
	? 'dark'
	: 'light'

ReactDOM.render(
	<React.Suspense fallback={null}>
		<ThemeSwitcherProvider
			themeMap={{ dark, light }}
			defaultTheme={defaultTheme}
			insertionPoint="styles-insertion-point"
		>
			<Provider store={store}>
				<HashRouter>
					<App />
				</HashRouter>
			</Provider>
		</ThemeSwitcherProvider>
	</React.Suspense>,
	document.getElementById('root')!,
)
