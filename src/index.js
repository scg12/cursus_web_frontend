import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import './index.css';
import App from './App';
import { UiContextProvider } from './store/UiContext';
import { AppContextProvider } from './store/AppContext';

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container);

root.render(
   <AppContextProvider>
        <UiContextProvider>
            <BrowserRouter>
                <App /> 
            </BrowserRouter>
        </UiContextProvider>
   </AppContextProvider>,
    document.getElementById('root')
);

