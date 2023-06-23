
import React from 'react';
import CsLayout from './components/UI/CS_UI/CsLayout';
import MsLayout from './components/UI/MS_UI/MsLayout';
import { Route, Switch} from 'react-router-dom';
import {isMobile} from 'react-device-detect';

import CommParentPage from './components/pages/commAvecParent/CommParentPage';
import ConfigPage from './components/pages/configuration/ConfigPage';
import EconomatEtFinancePage from './components/pages/economatEtFinance/EconomatEtFinancePage';
import ExtrasPages from './components/pages/extras/ExtrasPages';
import ImpressionPage from './components/pages/impression/ImpressionPage';
import DashBoardPage from './components/pages/dashBoard/DashBoardPage';
import ScolaritePage from './components/pages/scolarite/ScolaritePage';
import StatsEtMonitoringPage from './components/pages/statEtMonitoring/StatsEtMonitoringPage';






import { useState,useContext } from "react";
import { useHistory } from 'react-router-dom';
import AppContext from './store/AppContext';
import LoginForm from '../src/components/pages/login/LoginForm';
import MbLoginForm from './components/pages/login/MbLoginForm';

function App() 
{
    const currentAppContext = useContext(AppContext);
    const usrConnected = currentAppContext.usrIsLogged;
    const history = useHistory();
 
     
  if(isMobile) 
   {
        if(usrConnected)
        {  history.replace('/');
            return (
                <MsLayout> 
                   <Switch>
                        <Route path='/' exact>
                            <DashBoardPage/>
                        </Route>

                        <Route path='/dashBoardPage'>
                            <DashBoardPage />
                        </Route>
                        
                        <Route path='/login' exact>
                            <MbLoginForm/>
                        </Route>
                        
                        <Route path='/scolarite'>
                            <ScolaritePage />
                        </Route>
                        
                        <Route path='/economat-et-financePage'>
                            <EconomatEtFinancePage />
                        </Route>
                        
                        <Route path='/stats-et-monitoringPage'>
                            <StatsEtMonitoringPage />
                        </Route>
                        
                        <Route path='/comm-avec-parentPage'>
                            <CommParentPage />
                        </Route>
                        
                        <Route path='/extrasPages'>
                            <ExtrasPages />
                        </Route>
                        
                        <Route path='/configuration'>
                            <ConfigPage />
                        </Route>
                        
                    </Switch>
                </MsLayout>
            );
        }
        else 
        {  history.replace('/login');
            return (
                <MbLoginForm/>
            );
        }
    }    
    else
    {
        if(usrConnected){
            history.replace('/');
            return (
                <CsLayout> 
                    <Switch>
                        <Route path='/' exact>
                            <DashBoardPage/>
                        </Route>
                        
                        <Route path='/login' exact>
                            <LoginForm />
                        </Route>
                        
                        <Route path='/scolarite'>
                            <ScolaritePage />
                        </Route>
                        
                        <Route path='/economat-et-financePage'>
                            <EconomatEtFinancePage />
                        </Route>
                        
                        <Route path='/stats-et-monitoringPage'>
                            <StatsEtMonitoringPage />
                        </Route>
                        
                        <Route path='/dashBoardPage'>
                            <DashBoardPage />
                        </Route>
                        
                        <Route path='/comm-avec-parentPage'>
                            <CommParentPage />
                        </Route>
                        
                        <Route path='/extrasPages'>
                            <ExtrasPages />
                        </Route>
                        
                        <Route path='/configuration'>
                            <ConfigPage />
                        </Route>
                        
                    </Switch>
                </CsLayout>  
            );
        }
        else 
        {  history.replace('/login');
            return (
                <LoginForm/>
            );
        }
            
    }
    
}
export default App;
