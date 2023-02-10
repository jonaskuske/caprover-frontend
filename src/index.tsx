import React from 'react'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import App from './App'
import * as GlobalActions from './redux/actions/GlobalActions'
import reducers from './redux/reducers'
import CrashReporter from './utils/CrashReporter'
import StorageHelper from './utils/StorageHelper'

CrashReporter.getInstance().init()

const store = createStore(reducers, applyMiddleware(thunk))

window.matchMedia('(min-width: 768px)').addListener(({ matches }) => {
	store.dispatch(GlobalActions.emitSizeChanged(!matches))
})

const dark = import.meta.env.DEV
	? new URL(`./styles/dark-theme.less?direct`, import.meta.url).href
	: `${import.meta.env.BASE_URL}assets/dark-theme.css`
const light = import.meta.env.DEV
	? new URL(`./styles/light-theme.less?direct`, import.meta.url).href
	: `${import.meta.env.BASE_URL}assets/light-theme.css`

const themeMap = { dark, light }

const defaultTheme = StorageHelper.getThemeFromLocalStorage()

ReactDOM.render(
	<React.Suspense fallback={null}>
		<ThemeSwitcherProvider
			themeMap={themeMap}
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
