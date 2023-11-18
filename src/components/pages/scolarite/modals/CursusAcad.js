import React from 'react';
import ReactDOM from 'react-dom';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import { useFilePicker } from 'use-file-picker';




var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;

var cur_punitionDate='';
var cur_punitionDuree;
var cur_punitionMotif='';


var consignes_data =[];
var exclusions_data =[];
var other_data =[];


var CURSUS_SCOLAIRE=[];
var BILAN_ANNUEL={
    /*----donnees generales----*/  
    annee:"",
    classe:"",
    isExamClass:false,
    resultat_final:"",
    moyenne_finale:"",
    
    /*----Examen----*/
    examen:"",
    resultat_examen:"",
    mention_examen:"",

    /*----Conduite----*/
    absences_justifiees:"",
    absences_nonJustifiees:"",
    consignes:"",
    exclusion_temp:"",
    exclusion_definitive:"",
}



var tabResultat=[];

function CursusAcad(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
  
  
    const [gridAbsences, setGridAbsences]= useState([]);
    const [gridConsignes, setGridConsignes]= useState([]);
    const [gridExclusions, setGridExclusions]= useState([]);
    const [gridOther, setGgridOther]= useState([]);
    const[justiViewOpen, setjustifViewOpen]=useState(false);
    
    const [consignes, setConsignes] = useState([]);
    const [exclusions, setExclusion] = useState([]);
    const [autreSanction, setAutreSanction] = useState([]);
    
    
    useEffect(()=> {
        getClassStudentList(props.currentClasseId);
        getdossierData();
      
    },[]);
  
    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);
            //LIST_ELEVES= [...getElevesTab(res.data)];
            //console.log(LIST_ELEVES) ;          
        })  
        return listEleves;     
    }


    function getdossierData(){
        /* var tabResultat=[];
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);
            //LIST_ELEVES= [...getElevesTab(res.data)];
            //console.log(LIST_ELEVES) ;          
        })  */

        return tabResultat;
    }




    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
        }
    }
    
    
    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
    }


    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }

    function cancelHandler(){
        //MEETING={};
        props.cancelHandler();
    }


    /*------------------------------ End Design Fonctions -------------------------------*/

    
    
    function saveStudenFiche(){

    }

    function printStudentFiche(){

    }

    tabResultat =[    
        {   annee:"2018-2019", 
            classe:"6eA", 
            isExamClass:false, 
            resultat_final:"Admis", 

            examen:"",
            resultat_examen:"",
            mention_examen:"",

            moyenne_finale:"11.47",
            absences_justifiees:"12",
            absences_nonJustifiees:"05",
            consignes:"00",
            exclusion_temp:"00",
            exclusion_definitive:false, 

        },

        {   annee:"2019-2020", 
            classe:"5eA", 
            isExamClass:false, 
            resultat_final:"Admis", 

            examen:"",
            resultat_examen:"",
            mention_examen:"",

            moyenne_finale:"12.47",
            absences_justifiees:"20",
            absences_nonJustifiees:"05",
            consignes:"00",
            exclusion_temp:"00",
            exclusion_definitive:false, 

        },

        {   annee:"2020-2021", 
            classe:"4eA", 
            isExamClass:false, 
            resultat_final:"Admis", 

            examen:"",
            resultat_examen:"",
            mention_examen:"",

            moyenne_finale:"14.47",
            absences_justifiees:"20",
            absences_nonJustifiees:"05",
            consignes:"00",
            exclusion_temp:"00",
            exclusion_definitive: false, 

        },

        {   annee:"2021-2022", 
            classe:"3eA", 
            isExamClass:true, 
            resultat_final:"Admis", 

            examen:"BEPC",
            resultat_examen:"Admis",
            mention_examen:"AB",

            moyenne_finale:"13.47",
            absences_justifiees:"20",
            absences_nonJustifiees:"05",
            consignes:"00",
            exclusion_temp:"00",
            exclusion_definitive: false, 

        },

        {   annee:"2022-2023", 
            classe:"2ndC", 
            isExamClass:false, 
            resultat_final:"Echec", 

            examen:"",
            resultat_examen:"",
            mention_examen:"",

            moyenne_finale:"08.47",
            absences_justifiees:"20",
            absences_nonJustifiees:"05",
            consignes:"00",
            exclusion_temp:"00",
            exclusion_definitive: false, 
        }



    ];
  
   

    /************************************ JSX Code ************************************/
    const LigneResultat=(props)=>{
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'93%'}}>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"#065386", color:'white', width:'100%', height:"3vh"}}>
                    <div style={{display:'flex', flexDirection:'colunm', justifyContent:'center', width:'40%', fontSize:'0.87vw', borderRight:'solid 1.5px white'}} > BILAN SCOLAIRES</div> 
                    <div style={{display:'flex', flexDirection:'colunm', justifyContent:'center', width:'54%', fontSize:'0.87vw', marginLeft:'2vw'}}> BILAN DISCIPLINAIRE</div>
                </div>
                
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"white", color:'black', width:'100%', height:"3vh", borderLeft:'solid 1px black', borderRight:'solid 1px black', borderBottom:'solid 1px black'}}>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center', width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black', color:'black'}}>Resultat annuel</div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Resultat examen </div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'30%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Absences</div>              
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Consignes</div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Excl. temp.</div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw'}}>Excl. def.</div>
                </div>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"white", color:'black', width:'100%', height:"3vh", borderLeft:'solid 1px black', borderRight:'solid 1px black', borderBottom:'solid 1px black'}}>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center', width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black', color:'black'}}><div style={props.resultatAnnuel.resultat_final== "Admis"? {color:"green"}:{color:"red"}}>{props.resultatAnnuel.resultat_final}</div> <div>({props.resultatAnnuel.moyenne_finale})</div> </div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>{props.resultatAnnuel.isExamClass? props.resultatAnnuel.examen+'('+ props.resultatAnnuel.resultat_examen +' '+ props.resultatAnnuel.mention_examen+')' :'R.A.S'}</div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'30%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>justifiees:<div style={{color:'green', marginRight:'0.3vw'}}>{props.resultatAnnuel.absences_justifiees}h</div> non justifiees:<div style={{color:'red'}}>{props.resultatAnnuel.absences_nonJustifiees}h</div></div>              
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Total:<div style={{fontWeight:'bolder'}}>{props.resultatAnnuel.consignes}jrs</div></div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>Total:<div style={{fontWeight:'bolder'}}>{props.resultatAnnuel.exclusion_temp}jrs</div></div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw'}}>{props.resultatAnnuel.exclusion_definitive ? 'Oui':'Non'}</div>
                </div>
            
            </div>
           
        );
    }

    

    return (
        <div className={'card '+ classes.formContainerP}>          
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg2} src='images/dossierEleve.png'/>
                </div>
                              
                <div className={classes.formMainTitle} >
                    {t('student_history_M')}
                </div>
            </div>
              
                
               
            <div className={classes.inputRow} style={{marginBottom:'1vh', marginTop:'7.7vh'}}> 
                <div style={{marginLeft:'-4vw'}}>
                    <img alt='student' className={classes.photoStyleP} src={'images/photoHomme2.jpg'}/>
                </div>   
                
                <div className={classes.studentInfo}  style={{marginRight:'-3.7vw', marginLeft:'1vw', alignSelf:'center', marginTop:'-2vh'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('nom_M')} : </div> <div>{props.eleve.nom+' '+props.eleve.prenom} </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('class_M')} : </div> <div> 6eA1</div>
                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'4.3vw'}}> {t('matricule_M')}  : </div> <div>{props.eleve.matricule}</div>
                        <div style={{fontWeight:'700', marginLeft:'2vw'}}> {t('age_M')} : </div> <div> 10 ans</div>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t("entree_M")} : </div> <div> {props.eleve.date_entree} </div>
                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'4.3vw'}}> {t('sortie_M')} : </div> <div> - </div>
                    </div>
                </div>
            
            </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', marginTop:'1.7vh', paddingTop:'23vh', paddingBottom:'7vh', marginBottom:'3vh', height:'auto', overflowY:'scroll'}}>
                {tabResultat.map((resultat,index)=>{
                    return(
                        <div style={{display:'flex', flexDirection:'column',fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', marginBottom:'2.3vh', justifyContent:'space-between'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {resultat.annee+' - '+ resultat.classe}   
                                itemSelected={null}
                                style={{marginBottom:'1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw'}}
                            />   
                            <LigneResultat resultatAnnuel={resultat}/>
                        </div>
                        

                    );

                })}              
                
                
            </div>
               
            <div className={classes.formButtonRowP} style={{backgroundColor:'white'}}>
                <CustomButton
                    btnText= {t('cancel')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}
                    style={{marginRight:'2vw'}}
                />

                {/*<CustomButton
                    btnText={t('save')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveStudenFiche}
                />*/}

                <CustomButton
                    btnText={t('imprimer')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={printStudentFiche}
                />

            </div>

        </div>
       
    );
 }
 export default CursusAcad;
 