import { createStore, applyMiddleware } from 'redux';
// import { createLogger } from "redux-logger";
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';
import rootReducer from 'reducers';

const middleware = [thunk];

// if (process.env.NODE_ENV === "development") {
//   middleware.push(createLogger());
// }

export default function configureStore(initialState) {
  const composeEnhancers = composeWithDevTools({});
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
  return store;
}
