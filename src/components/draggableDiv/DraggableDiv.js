import React from 'react';
import {useDrag} from 'react-dnd';
import { isMobile } from 'react-device-detect';
import UiContext from '../../store/UiContext';
import { useContext} from "react";

function DraggableDiv(props){
    const currentUiContext = useContext(UiContext);
    const [{isDragging},drag] = useDrag(()=>({

        type: props.type,

        item:{id:props.id},

        collect: (monitor) => ({
            isDragging:!!monitor.isDragging(),
        })
    }));

    function clickHandler(){
       //alert(props.id)
        if(props.id[0]=="m") currentUiContext.setSelectedMatiereId(props.id); //On est sur une matiere
        else  currentUiContext.setSelectedProfId(props.id); //On est sur un prof        
        props.onClick();
    }

    return(
        <div id={props.id} title={props.title} className={props.className} ref={drag} style={props.style} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default DraggableDiv;
