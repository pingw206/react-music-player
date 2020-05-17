import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||compose; //为了用chrome插件

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
));

export default store;