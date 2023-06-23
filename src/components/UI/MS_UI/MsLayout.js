import React from 'react';
import HeadAndNav from '../../layout/ms_layout/headAndNav/HeadAndNav';
import FooterContent from '../../layout/ms_layout/footer/FooterContent';
import MainContentLayout from '../MS_UI/MainContentLayout';

import TopLayout from './TopLayout';
import MainLayout from './MainLayout';
import FooterLayout from './FooterLayout';


import classes from './MsLayout.module.css';

import MediaQuery from 'react-responsive';

 
//Template pour affichage sur ecran d'ordinateur.
function MsLayout(props) {
    return (
        <div className={classes.flexLayoutConf}>
           
            <TopLayout>
                <HeadAndNav/>                
            </TopLayout>
            
            <MainLayout>
                <MainContentLayout>
                    {props.children}
                </MainContentLayout>
            </MainLayout>
            
            <FooterLayout>
                <FooterContent/>
            </FooterLayout>
        
        </div>
    );
}

export default MsLayout;