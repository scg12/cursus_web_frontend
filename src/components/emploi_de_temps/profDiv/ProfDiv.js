import React from 'react';
import { isMobile } from 'react-device-detect';
import { useContext} from "react";
import UiContext from '../../../store/UiContext';
import DraggableDiv from '../../draggableDiv/DraggableDiv';
import {profZoneClickedHandler} from '../ET_Module'

let CURRENT_DROPPED_PROFS_LIST;



function ProfDiv(props){ 
    const currentUiContext = useContext(UiContext);
    CURRENT_DROPPED_PROFS_LIST=currentUiContext.CURRENT_DROPPED_PROFS_LIST;

    function ProfsClickHandler(){
        if(isMobile) currentUiContext.setSelectedProfId(props.id); //On est sur un prof            
        profZoneClickedHandler(CURRENT_DROPPED_PROFS_LIST,props.id);
        /*SELECTED_PROF_ID = props.id;
        var idTab = SELECTED_PROF_ID.split('_');
        var ProfDroppableZone = 'P_'+idTab[3]+'_'+idTab[4]+'_'+idTab[5];
        var index,borderColor, borderWidth, borderStyle;
       
        if (idTab[0]=='DP') {
           
           if(document.getElementById(ProfDroppableZone).style.borderColor !='red') {
                document.getElementById(ProfDroppableZone).style.borderStyle ='solid';
                document.getElementById(ProfDroppableZone).style.borderWidth ='1px';  
                document.getElementById(ProfDroppableZone).style.borderColor ='red';
                COUNT_SELECTED_PROFS++;
                SELECTED_PROF_TAB.push(ProfDroppableZone);
                if(COUNT_SELECTED_PROFS==1) SELECTED_PROF_ID = SELECTED_PROF_TAB[0];
                  else SELECTED_PROF_ID='';
                //alert(COUNT_SELECTED_PROFS+SELECTED_PROF_TAB);
                
           } else{
                document.getElementById(ProfDroppableZone).style.borderStyle = null;
                document.getElementById(ProfDroppableZone).style.borderWidth = null;
                document.getElementById(ProfDroppableZone).style.borderColor = null;
                document.getElementById(ProfDroppableZone).className = classes.ProfDroppableDivstyle;
                
                index = SELECTED_PROF_TAB.findIndex((prof)=>prof==ProfDroppableZone);
                if (index >= 0) 
                { SELECTED_PROF_TAB.splice(index,1);
                  COUNT_SELECTED_PROFS--;
                  if(COUNT_SELECTED_PROFS==1) SELECTED_PROF_ID = SELECTED_PROF_TAB[0];
                  else SELECTED_PROF_ID='';
                }
               
           }
        }*/
      
    }
    return (        
        <DraggableDiv id={props.id} className={props.dragDivClassName} type='profImage' onClick={ProfsClickHandler}>            
            <div id={props.id +'_img'} className={props.profImgStyle}>
                <img  src={props.imgSrc} className={props.imgClass}/>
                <div id={props.id +'_sub'} className={props.profNameStyle}>    
                    {props.children}
                </div>
            </div>      
        </DraggableDiv>                   
    );
}
export default ProfDiv;