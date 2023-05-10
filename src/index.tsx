import React from 'react';
import ReactDOM from 'react-dom/client';
import './commonStyles/index.css';
import "./commonStyles/null.css"
import "./commonStyles/Input.css"
import "./commonStyles/Button.css"
import App from "./components/App/App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);