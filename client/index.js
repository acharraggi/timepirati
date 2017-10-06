/*
    ./client/index.js
    which is the webpack entry file
*/
import android_chrome_192x192 from './favicons/android-chrome-192x192.png'
import android_chrome_256x256 from './favicons/android-chrome-256x256.png'
import apple_touch_icon from './favicons/apple-touch-icon.png'
import browserconfig_xml from './favicons/browserconfig.xml'
import favicon from './favicons/favicon.ico'
import favicon_16x16 from './favicons/favicon-16x16.png'
import favicon_32x32 from './favicons/favicon-32x32.png'
import manifest_json from './favicons/manifest.json'
import mstile_150x150 from './favicons/mstile-150x150.png'
import safari_pinned_tab from './favicons/safari-pinned-tab.svg'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Route
} from 'react-router-dom'
import App from './components/App.jsx'
import {RootStore} from './RootStore'
import {useStrict} from 'mobx'
import { TransportLayer } from './TransportLayer'
useStrict(true)

const transportLayer = new TransportLayer()
const rootStore = new RootStore(transportLayer)

ReactDOM.render(
  <BrowserRouter>
    <Route path='/' render={routeProps => <App {...routeProps} rootStore={rootStore} />} />
  </BrowserRouter>,
  document.getElementById('root')
)
