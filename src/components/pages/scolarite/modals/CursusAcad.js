import React from 'react';
import ReactDOM from 'react-dom';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from '../../../formPuce/FormPuce';
import PDFTemplate from '../reports/PDFTemplate';
import StudentCursus from '../reports/StudentCursus';
import BackDrop from '../../../backDrop/BackDrop';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import MsgBox from '../../../msgBox/MsgBox';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import { useFilePicker } from 'use-file-picker';
import {isMobile} from 'react-device-detect';
import {getTodayDate, grey} from '../../../../store/SharedData/UtilFonctions';






var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


var cur_punitionDate='';
var cur_punitionDuree;
var cur_punitionMotif='';


var consignes_data =[];
var exclusions_data =[];
var other_data =[];
var printedETFileName ='';


const LIST_HEIGHT = 20;


var dossierEleve=[];
var studentFolderData = {};


function CursusAcad(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
    const[imageUrl, setImageUrl] = useState('');
    // const [dossierEleve, setDossierEleve] = useState([]);
   
    
    
    useEffect(()=> {
        //getClassStudentList(props.currentClasseId);
        console.log("dossier+eleve", props.dossierEleve,props.eleve);
        dossierEleve = props.dossierEleve;
        // props.eleve.persoData    
        
        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = grey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);
      
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

  
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


    // function getdossierData(){
      
    //     axiosInstance.post(`get-dossier-eleve/`, {

    //         id_eleve      : props.eleve.id,
    //         id_sousetab   : currentAppContext.currentEtab,
    //         est_scolarise : props.est_scolarise

    //     }).then((res)=>{            
    //         setDossierEleve(res.data.dossier_eleve); 
    //         console.log(res.data);       
    //     });        
    // }

    
    function calculAgeEnFonctionDateNaiss(dateNaiss){
        var age = 0;

        return age;
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


    function printDossierEleve(){

        var eleveData = {};
        eleveData.eleveInfo     = {...props.eleve};
        eleveData.dossierEleve  = [...props.dossierEleve];


        var PRINTING_DATA ={
            dateText     : 'Yaounde, le '+getTodayDate(),
            leftHeaders  : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
            centerHeaders       :[currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
            rightHeaders : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
            pageImages          :[imgUrl],
            pageImagesDefault   :[imgUrlDefault],
            classeLabel  : props.dossierEleve[0].classe,
            pageTitle    : t("dossier_academique_of_student") +' '+ props.eleve.nom+' '+props.eleve.prenom,
            eleveData    : eleveData
            //numberEltPerPage:ROWS_PER_PAGE  
        };

        printedETFileName = 'Dossier_academique('+props.eleve.nom+'_'+props.eleve.prenom+').pdf';
        studentFolderData = PRINTING_DATA;
        console.log("ici la",PRINTING_DATA);
        setModalOpen(1);
    }

    function cancelHandler(){
        //MEETING={};
        props.cancelHandler();
    }

    function closePreview(){
        setModalOpen(0);
    }

    /************************************ JSX Code ************************************/
    const LigneResultat=(props)=>{
        return(
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'93%'}}>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"#065386", color:'white', width:'100%', height:"3vh"}}>
                    <div style={{display:'flex', flexDirection:'colunm', justifyContent:'center', width:'37%', fontSize:'0.87vw', borderRight:'solid 1.5px white'}} > {t("academic_history_M")}</div> 
                    <div style={{display:'flex', flexDirection:'colunm', justifyContent:'center', width:'54%', fontSize:'0.87vw', marginLeft:'2vw'}}> {t("disciplin_history_M")}</div>
                </div>
                
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"white", color:'black', width:'100%', height:"3vh", borderLeft:'solid 1px black', borderRight:'solid 1px black', borderBottom:'solid 1px black'}}>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center', width:'17%',fontSize:'0.77vw', borderRight:'solid 1px black', color:'black', fontWeight:"bolder"}}>{t("annual_result")}</div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black', fontWeight:"bolder"}}>{t("exam_result")} </div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'27%',fontSize:'0.77vw', borderRight:'solid 1px black', fontWeight:"bolder"}}>{t("absences")}</div>              
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'36%',fontSize:'0.77vw', borderRight:'solid 1px black', fontWeight:"bolder"}}>{t("sanctions")}</div> 
                    {/* <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'13%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>{t("Excl. temp.")}</div> 
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'10%',fontSize:'0.77vw'}}>{t("Excl. def.")}</div> */}
                </div>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:"white", color:'black', width:'100%',height:"auto", borderLeft:'solid 1px black', borderRight:'solid 1px black', borderBottom:'solid 1px black'}}>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center', width:'17%',fontSize:'0.77vw', borderRight:'solid 1px black', color:'black'}}><div style={props.resultatAnnuel.decision_finale_CCA=="admis"? {color:"green"}:{color:"red"}}>{props.resultatAnnuel.decision_finale_CCA== "admis"? "Admis" : props.resultatAnnuel.decision_finale_CCA}</div> <div>({props.resultatAnnuel.resultat_annuel})</div> </div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'20%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>{props.resultatAnnuel.classe_examen? props.resultatAnnuel.examen+'('+ props.resultatAnnuel.resultat_exam +' '+ props.resultatAnnuel.mention_examen+')' :'R.A.S'}</div>
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'center',width:'27%',fontSize:'0.77vw', borderRight:'solid 1px black',}}>{t("justified")} :  <div style={{color:'green', marginRight:'0.3vw'}}>{props.resultatAnnuel.absences_j}h</div> {t("non_justified")} :  <div style={{color:'red'}}> {props.resultatAnnuel.absences_nj}h</div></div>    
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', paddingLeft:props.resultatAnnuel.sanctions.split("_").length == 1 ? "0vw":"2vw", width:'36%',fontSize:'0.77vw', borderRight:'solid 1px black'}}>
                        {(props.resultatAnnuel.sanctions.split("_")||[]).map((sanction)=>{
                            return(
                                <div style={{display:"flex", flexDirection:"row", justifyContent:"center",  alignSelf:props.resultatAnnuel.sanctions.split("_").length == 1 ? "center":"flex-start"}}>
                                    <div style={{width:"100%"}}>
                                        {sanction} 
                                    </div>
                                </div>
                            );
                        })}
                    </div>          
                 
                </div>
            
            </div>
           
        );
    }

    

    return (
        <div className={'card '+ classes.formContainerP} style={{height:(props.dossierEleve.length*LIST_HEIGHT)+ "vh", justifyContent:"flex-start", maxHeight:"97.3vh", minHeight:"67vh"}}>          
           
            {(modalOpen!=0) && <BackDrop />}
            {(modalOpen==1) &&              
                <PDFTemplate  previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<StudentCursus pageSet={studentFolderData}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height:"87.3vh", width: "120vw" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <StudentCursus pageSet={studentFolderData}/>
                        </PDFViewer>
                    } 
                </PDFTemplate>
            } 

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
                    <img alt='student' className={classes.photoStyleP} src={props.eleve.photo_url.length>0? props.eleve.photo_url : 'images/photo4Fois4P.png'}/>
                </div>   
                
                <div className={classes.studentInfo}  style={{marginRight:'-3.7vw', marginLeft:'1vw', alignSelf:'center', marginTop:'-2vh'}}>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('nom_M')} : </div> <div>{props.eleve.nom+' '+props.eleve.prenom} </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('class_M')} : </div> <div>{props.dossierEleve[0].classe}</div>
                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'4.3vw'}}> {t('matricule_M')}  : </div> <div>{props.eleve.matricule}</div>
                        <div style={{fontWeight:'700', marginLeft:'2vw'}}> {t('age_M')} : </div> <div> {props.eleve.age} {t('years')}</div>
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t("entree_M")} : </div> <div> {props.eleve.date_entree} </div>
                        <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'4.3vw'}}> {t('sortie_M')} : </div> <div> - </div>
                    </div>
                </div>
            
            </div>

            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', marginTop:'1.7vh', /*paddingTop:'27vh',*/ paddingBottom:'7vh', marginBottom:'3vh', height:'auto', overflowY:'scroll'}}>
                {props.dossierEleve.map((resultat,index)=>{
                    return(
                        <div style={{display:'flex', flexDirection:'column',fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', marginBottom:'2.3vh', justifyContent:'center', width:"107%"}}>
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
                    btnClickHandler={printDossierEleve}
                />

            </div>

        </div>
       
    );
 }
 export default CursusAcad;
 