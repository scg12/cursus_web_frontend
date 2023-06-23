import React from 'react';
import HeadAndNav from '../../layout/cs_layout/headAndNav/HeadAndNav';
import SideContent from '../../layout/cs_layout/sideContent/SideContent';
import FooterContent from '../../layout/cs_layout/footer/FooterContent';

import TopLayout from './TopLayout';
import LeftLayout from './LeftLayout';
import MainLayout from './MainLayout';
import FooterLayout from './FooterLayout';
import MainContentLayout from './MainContentLayout';
import UiContext from '../../../store/UiContext';
import { useContext } from 'react';

import classes from './CsLayout.module.css';
 
//Template pour affichage sur ecran d'ordinateur.
function CsLayout(props) {
  

    return (
        <div className={classes.gridLayoutDashBoard }>
           {/*-------------- Header --------------*/}
            <TopLayout>
                <HeadAndNav/>
            </TopLayout>
            
           {/*----------- Main Content -----------*/}
            <MainLayout>
                <LeftLayout>
                    <SideContent/>
                </LeftLayout>
                
                <MainContentLayout>
                    {props.children}
                </MainContentLayout>
            </MainLayout>
            {/*-------------- Footer  -----------*/}
            <FooterLayout>
                <FooterContent/>
            </FooterLayout>
        </div>
    );
}

export default CsLayout;