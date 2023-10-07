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

var totalAbsences      = 0;
var totalJustifiees    = 0;
var totalNonJustifiees = 0;



function FicheDisciplinaire(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
  
  
    const [gridAbsences, setGridAbsences]= useState([]);
    const [gridSanctions, setGridSanctions]= useState([]);
   
    const[justiViewOpen, setjustifViewOpen]=useState(false);
    
    
    
    useEffect(()=> {
        setGridAbsences(props.absences);
        setGridSanctions(props.sanctions);
        getTotauxAbsence();
        console.log("absences,sanctions",props.absences, props.sanctions);
        getClassStudentList(props.currentClasseId);
      
    },[]);

    const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        limitFilesConfig: { max: 1 },
        // minFileSize: 0.1, // in megabytes
        maxFileSize: 50,
        imageSizeRestrictions: {
          maxHeight: 500, // in pixels
          maxWidth: 500,
          minHeight: 32,
          minWidth: 32,
        },
    });
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (errors.length) {
        getUploadError();
        console.log(errors);
    }

    function getUploadError(){
        var errorMsg;
        if(errors.length){
            if(errors[0].fileSizeTooSmall)  {
                errorMsg = 'Le fichier selectionne est trop lourd! la taille du fichier ne doit pas exceder 50Mo !!!';
                return errorMsg;
            }
            
            if(errors[0].fileSizeToolarge)  {
                errorMsg = 'Le fichier selectionne est tres petit! la taille du fichier doit depasser 0.5ko !!!';
                return errorMsg;
            }

            if(errors[0].imageHeightTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }    

            if(errors[0].imageHeightTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            }            
        }       
    }

    const getTotauxAbsence = ()=>{
        var tabAbsences = [...props.absences];    
        totalAbsences = 0;   totalJustifiees = 0;  totalNonJustifiees = 0;       
        
        if(tabAbsences.length>0){
            tabAbsences.map((elt)=>{
                totalAbsences      += totalAbsences      + elt.nb_heures;
                totalJustifiees    += totalJustifiees    + elt.justifie;
                totalNonJustifiees += totalNonJustifiees + elt.non_justifie
            })
        }

    }
    
    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);  
        })  
        return listEleves;     
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

    function printStudentFiche(){
        props.printFDHandler();
    }


    /*------------------------------ End Design Fonctions -------------------------------*/

    const absences_data =[
        {id:1, date:'12/05/2023', nbre_heure:'3', heure_justifie:'1', heure_nonJustifie:'2' },
        {id:2, date:'08/07/2023', nbre_heure:'7', heure_justifie:'2', heure_nonJustifie:'5' },
        {id:3, date:'18/07/2023', nbre_heure:'3', heure_justifie:'2', heure_nonJustifie:'1' },
    ];
 

    /************************************ JSX Code ************************************/
    const LigneAbsence=(props)=>{
        return(
            <div style={{display:'flex', color:props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'10vw', fontWeight:'bold'}}>{props.date}</div>
                <div style={{width:'7vw',  fontWeight:'bold'}}>{props.nbreHeures}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'green', fontWeight:'700'}}>{props.nbreJustifie}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'red', fontWeight:'700'  }}>{props.nonJustifie}</div>
            </div>
        );
    }

    const LigneTotauxAbsences=(props)=>{
        return(
            <div style={{display:'flex', color:'black', alignSelf:'flex-end', marginRight:'2.83vw', backgroundColor:'lightgray', flexDirection:'row', height:'3vh', width:'30vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'10vw', fontWeight:'700'}}>{t('totaux')}</div>
                <div style={{width:'7vw',  fontWeight:'700'}}>{t('hours')} :{props.totalHeures}</div>
                <div style={{width:'7vw',  color:props.isHeader?'white':'green', fontWeight:'700'}}>{t('justify')}     : {props.totalJustifie}   </div>
                <div style={{width:'10vw',  color:props.isHeader?'white':'red',   fontWeight:'700'}}>{t('not_justify')} : {props.totalNonjustife} </div>
            </div>
        );
    }

    const LignePunitionHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw'}}>{t('date')}   </div>
                <div style={{width:'15vw'}}> {t('libelle')}</div>
                <div style={{width:'5vw'}}>  {t('duree')}  </div>                
                {/* <div style={{width:'7vw'}}>{t('etat_actuel')} </div> */}
            </div>
        );
    }
  
    const LignePunition=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw', height:'1.4rem', fontSize:'0.87vw', fontWeight:"bold", color:'#075588'}}>{props.date}</div>
                <div style={{width:'15vw',  height:'1.4rem', fontSize:'0.87vw', fontWeight:"bold", color:'#075588'}}>{(props.libelle.length==0)? "R.A.S":props.libelle}</div>
                <div style={{width:'5vw',   height:'1.4rem', fontSize:'0.87vw', fontWeight:"bold", color:'black'}}>{props.duree} {props.unite}</div>
                {/* <div style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}}>{props.motif}</div> */}
            </div>
        );
    }

   

    return (
        <div className={'card '+ classes.formContainerP}>          
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/Studentprofile.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                :
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                
                }
                
                <div className={classes.etapeP} style={{overflowY:'scroll', height:'75vh'}}>
                    <div className={classes.inputRow} style={{marginBottom:'1.3vh'}}> 
                        <div style={{marginLeft:'-4vw'}}>
                            <img alt='student' className={classes.photoStyleP} src={'images/photoHomme2.jpg'}/>
                        </div>   
                       
                        <div className={classes.studentInfo}  style={{marginRight:'-3.7vw', marginLeft:'1vw'}}>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                               <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('nom_M')} : </div> <div>{props.eleve.nom+' '+props.eleve.prenom}</div>
                            </div>

                            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('class_M')} : </div> 
                                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('age_M')} : </div> 
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                        <div>{props.currentClasseLabel}</div>
                                        <div>{props.eleve.age}</div>
                                    </div>

                                </div>

                                <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'10vw'}}> {t('matricule_M')}  :    </div> 
                                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'10vw'}}> {t('redoublant_M')} : </div> 
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                        <div> {props.eleve.matricule}</div>
                                        <div> {(props.eleve.redouble==false)? t('no'):t('yes')}</div>
                                    </div>
                                </div>
                            </div>
  
                        </div>                       
                 
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', color:'#01263f', fontWeight:'bold', marginTop:'-5.7vh'}}>
                        <div>{t('from')} :</div>
                        <div>{props.dateDeb} </div>
                        <div style={{marginLeft:"0.7vw"}}>{  t('to')} :</div>
                        <div> {props.dateFin}</div>

                    </div>

                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}>
                        <div style={{display:'flex', flexDirection:'row',fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', justifyContent:'space-between'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('absences')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw'}}
                            />   

                            {(justiViewOpen)&&
                                <div style={{width:'17vw', height:'7vh', marginTop:'-2vh', borderStyle:'solid', borderColor:'black', borderWidth:'1px', borderRadius:7, display:'flex', flexDirection:'row', justifyContent:'center',marginRight:'4.3vw'}}>

                                </div>
                            }

                        </div>
                        
                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw',overflowY:'scroll', justifyContent:'center'}}>
                            <LigneAbsence date={t('date')} nbreHeures={t('nbre_hour')} nbreJustifie={t('justify')} nonJustifie={t('not_justify')} isHeader={true}/>
                            {(gridAbsences||[]).map((absence)=>{
                                return <LigneAbsence date={absence.date} nbreHeures={absence.nb_heures} nbreJustifie={absence.justifie} nonJustifie={absence.non_justifie} isHeader={false}/>
                                })
                            }
                            <LigneTotauxAbsences totalHeures={totalAbsences} totalJustifie={totalJustifiees} totalNonjustife={totalNonJustifiees}/>
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('sanction_list')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                            />  
                            {/* <CustomButton
                                btnText={t('add')} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginRight:'4.3vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler = {() => {addConsigneRow()}}
                            />                       */}
                        </div>

                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', width:'93%',overflowY:'scroll', justifyContent:'center'}}>
                            <LignePunitionHeader punitionCode={0}/>
                            {(gridSanctions||[]).map((sanction,index)=>{
                                return <LignePunition punitionId={sanction.id} rowIndex={index} date={sanction.date} libelle={sanction.libelle} duree={sanction.duree} unite={sanction.unite}  isHeader={false} /*EnregPunition={EnregConsigne} doPunition={doConsigne} deletePunition={deleteConsigne}*//>
                                })
                            }
                        </div>

                    </div>                    
                    
                </div>
                       
            </div>
               
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText= {t('cancel')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}
                />

                {/* <CustomButton
                    btnText={t('save')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveStudenFiche}
                /> */}

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
 export default FicheDisciplinaire;
 