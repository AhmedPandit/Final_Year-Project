import React from "react";
import  ReactDOM  from "react-dom";

import "./index.css"
import { ContextProvider } from "./context/ContextProvider";
import {Provider} from "react-redux";
import {createStore,applyMiddleware,compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from "./reducers/index"

import App from "./App";

const store=createStore(reducers,compose(applyMiddleware(thunk)))


ReactDOM.render(
                <Provider store={store}>
                        <ContextProvider>
                           <App/>
                        </ContextProvider>
                </Provider>,
                 document.getElementById("root")
        
        );