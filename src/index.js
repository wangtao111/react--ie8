import './jquery.min';
import 'es5-shim';
import 'es5-shim/es5-sham';
import 'console-polyfill';
import React from 'react';
import Router from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'antd/lib/index.css';
import routes from './routes';
import './less/normalize.css';
import './less/main.less';
import configureStore from './store/configureStore';

require('es6-promise').polyfill();
Object.assign = require('object-assign');

const store = configureStore();
window.console = window.console || (function() {
  const c = {};
  c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
      = c.clear = c.exception = c.trace = c.assert = function() {};
  return c;
}());
Router.run(routes, (Handler) => {
  render(
    <Provider store={store}>
      <Handler />
    </Provider>,
    document.getElementById('app'));
});
