import React from 'react';
import ReactDOM from 'react-dom/client';
import './commonStyles/index.css';
import "./commonStyles/null.css"
import "./commonStyles/Input.css"
import "./commonStyles/Button.css"
import App from './components/App/App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store";
import axios from "axios";



const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);