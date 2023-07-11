import React from 'react';
import classes from "./Book.module.css";
import CustomButton from '../customButton/CustomButton';
import MenuItemList from '../layout/cs_layout/menuItemList/MenuItemList';
import FormPuce from '../formPuce/FormPuce'
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import {TAB_MODULES, TAB_CHAPITRE, TAB_LESSON, CURRENT_SELECTED_COURS_ID} from './CT_Module';
import {gotoLesson, createCTStructure} from './CT_Module';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import axiosInstance from '../../axios';



function TableOfContents(props){

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [curentMenuItemId,setMenuItemId]=useState(0);

    const [MODULES, setModules] = useState([]);
    const [CHAPITRES, setChapitres]= useState([]);
    const [LESSONS, setLessons]= useState([]);

    useEffect(()=> {

        setModules([]);
        setChapitres([]);
        setLessons([]);
        createFicheProgression(CURRENT_SELECTED_COURS_ID);
        setModules(TAB_MODULES);
        setChapitres(TAB_CHAPITRE);
        setLessons(TAB_LESSON);
       
    },[CURRENT_SELECTED_COURS_ID]);
 

    

    const createFicheProgression=(coursId)=>{  
        let cts = [];
        let mods = [];
        let chaps = [];
        // axiosInstance.post(`get-fiche-progression/`, {
        axiosInstance.post(`get-cahier-texte/`, {
            id_cours: coursId,
        }).then((res)=>{
            // console.log('fiche progress:', res.data);
            res.data.cts.map(item=>cts.push(item));
            res.data.mods.map(item=>mods.push(item));
            res.data.chaps.map(item=>chaps.push(item));

            console.log("cts: ",cts);
            console.log("mods: ",mods);
            console.log("chaps: ",chaps);
            createCTStructure(coursId,cts);   
            /*currentAppContext.setEtatLesson(TAB_ETATLESSONS)
            console.log('etats', currentAppContext.etatLesson)*/                     
        }) 
    }
    const selectedTheme = currentUiContext.theme;
  
    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    function getDetailSectionBlankTheme()
    { 
      return classes.MenuItemSectionDetails_BLANK
    }

    function getDetailSectionTheme()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_MenuItemSectionDetails ;
        case 'Theme2': return classes.Theme2_MenuItemSectionDetails ;
        case 'Theme3': return classes.Theme3_MenuItemSectionDetails ;
        default: return classes.Theme1_MenuItemSectionDetails ;
      }
    }

    function getCurrentContaintTheme()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_mainContentPosition ;
        case 'Theme2': return classes.Theme2_mainContentPosition ;
        case 'Theme3': return classes.Theme3_mainContentPosition ;
        default: return classes.Theme1_mainContentPosition ;
      }
    }
    
    return(     
        <div id={props.id} className={classes.preface}>
            <div className={classes.pageTitle}> {t("table_of_contentM")} </div>
            { (MODULES||[]).map((module) => {
                return (
                    <MenuItemList minWtdhStyle={classes.size27Vw}  libelle= {module.libelleModule} theme={selectedTheme} banStyle={{height:'18.7px'}} puceTextStyle={{fontSize:'0.8rem', display:'flex', alignItems:"center", paddingBottom:'0px'}}>
                        {(CHAPITRES[module.moduleId]||[]).map((chapitre) => {
                            return (
                                <div>
                                    <FormPuce menuItemId ='1' 
                                        isSimple={true} 
                                        noSelect={true} 
                                        imgSource={'images/' + getPuceByTheme()} 
                                        withCustomImage={true} 
                                        imageStyle={classes.PuceStyle}    
                                        libelle = {chapitre.libelleChapitre}   
                                        itemSelected={null}
                                        puceLabelStyle={{fontSize:'0.9rem !important'}}
                                    />
                                    {(LESSONS[chapitre.chapitreId]||[]).map((lesson,index)=>{
                                        if(lesson.etat==1){ //lecon en cours
                                            return (
                                                <div id={lesson.lessonId+'_li'} style={{display:'flex', flexDirection:'row', marginLeft:'2vw', cursor:'pointer'}} onClick={()=>gotoLesson(lesson.lessonId, props.id)}>
                                                    <img id={lesson.lessonId+'_img'} src ='images/pending_trans.png' style={{width:'0.8vw', height:'0.8vw', alignSelf:'center', marginRight:'0.67vw'}}/>
                                                    <div id={lesson.lessonId+'_libelle'} style={{fontSize:'0.9vw', color:'#dc900b'}}>{lesson.libelleLesson}</div>
                                                </div>                                                
                                            );

                                        } else if(lesson.etat==2){  //lecon cloturee
                                            return (
                                                <div id={lesson.lessonId+'_li'} style={{display:'flex', flexDirection:'row', marginLeft:'2vw', cursor:'pointer'}} onClick={()=>gotoLesson(lesson.lessonId, props.id)}>
                                                    <img id={lesson.lessonId+'_img'} src ='images/check_trans.png' style={{width:'0.8vw', height:'0.8vw', marginRight:'0.67vw'}}/>
                                                    <div id={lesson.lessonId+'_libelle'} style={{fontSize:'0.9vw',color:'rgb(167 164 164)'}}>{lesson.libelleLesson}</div>
                                                </div>      
                                            );

                                        } else {
                                            return (  //lecon non debutee
                                                <div id={lesson.lessonId+'_li'} style={{display:'flex', flexDirection:'row', marginLeft:'2vw', cursor:'pointer'}} onClick={()=>gotoLesson(lesson.lessonId, props.id)}>
                                                    <img id={lesson.lessonId+'_img'} src='images/puceCarreau.png' alt='.' style={{width:'0.3vw', height:'0.3vw', marginRight:'0.67vw', marginTop:'1vh'}}/>
                                                    <div id={lesson.lessonId+'_libelle'} style={{fontSize:'0.9vw'}}>{lesson.libelleLesson}</div>
                                                </div> 
                                            );

                                        }                                       
                                       
                                    })}  
                                                                           
                                </div> 
                                
                            );
                                
                        })}                      
                    </MenuItemList>
                );                
               
            })} 
                
        </div>
    );
}
export default TableOfContents;