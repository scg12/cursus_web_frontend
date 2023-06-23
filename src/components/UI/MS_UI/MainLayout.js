import React from 'react';
import classes from './MsLayout.module.css';



function MainLayout(props) {
    // Choix du theme courant
    function getCurrentTheme(){  
        // Choix du theme courant
       return classes.mainContentPosition + ' '+ classes.mainContentStyle;
    }

    return (
        <div className= {getCurrentTheme()}>
            {props.children}
        </div>
    );

}
export default MainLayout; 