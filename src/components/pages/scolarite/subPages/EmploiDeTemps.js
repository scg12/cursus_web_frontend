import GrilleEmploiTemps from "../../../emploi_de_temps/GrilleEmploiTemps";
import UiContext from "../../../../store/UiContext";
import React from 'react';
import {useEffect, useState, useContext} from "react";

function EmploiDeTemps(props){
    const currentUiContext = useContext(UiContext);
    const [pausecreated, setPauseCreated] = useState(false);

    useEffect(()=> {
       // if(!pausecreated)
        {   //createPauses();
            setPauseCreated(true);
        }    
    },[currentUiContext.TAB_VALEUR_HORAIRE]);

    return(
        <GrilleEmploiTemps formMode={props.formMode}/>
    );
}

export default EmploiDeTemps;


