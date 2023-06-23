import LookEmploTemps from "../../../emploi_de_temps/LookEmploTemps";
import UiContext from "../../../../store/UiContext";
import React from 'react';
import {useEffect, useState, useContext} from "react";

function ConsultEmploiTemps(props){
    const currentUiContext = useContext(UiContext);
    const [pausecreated, setPauseCreated] = useState(false);

    useEffect(()=> {
       // if(!pausecreated)
        {   //createPauses();
            setPauseCreated(true);
        }    
    },[currentUiContext.TAB_VALEUR_HORAIRE]);

    return(
        <LookEmploTemps/>
    );
}

export default ConsultEmploiTemps;


