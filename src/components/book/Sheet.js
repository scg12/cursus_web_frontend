import React from 'react';
import classes from "./Book.module.css";
import CustomButton from '../customButton/CustomButton';
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';
import AddContent from './AddContent'
import { useContext, useState, useEffect } from "react";
import {LISTE_LECONS,TAB_LESSON, CURRENT_SELECTED_COURS_ID,} from './CT_Module';
import {gotoPreface, getNextHandler, getPreviousHandler, createCTStructure,updateInitialState} from './CT_Module';
import {isMobile} from 'react-device-detect';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import BackDrop from '../backDrop/BackDrop';
import MsgBox from '../msgBox/MsgBox'
import AddLessonNote from './modals/AddLessonNote';
import axiosInstance from '../../axios';

var lesson_begining_date = '';
const EN_COURS = 1;
const CLOTURE = 2;

var chosenMsgBox;
const MSG_SUCCESS_CT =11;
const MSG_WARNING_CT =12;
const MSG_ERROR_CT   =13;


function Sheet(props){
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const { t, i18n } = useTranslation();

    const [isValid, setIsValid] = useState(false);
    const [bookOpen, setBookOpen] = useState(false);
    const [devoirOpen, setDevoirOpen] = useState(1); //0->Ferme, 1->Devoir ouvert, 2-> Resumer ouvert
    const [modalOpen, setModalOpen] = useState(false);
    const [resumeOpen, setResumeOpen] = useState(false);
    // const [devoirTab, setDevoirTab]= useState([]);
    // const [resumeTab, setResumeTab]= useState([]);
    //const [etatLesson, setEtaLesson] = useState(0);

    
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        //setEtaLesson(props.etat);
        //getLessonData(props.bd_id);
       
        console.log("props.contenu.tabDevoirs: ",props.contenu.tabDevoirs)       
    },[CURRENT_SELECTED_COURS_ID]);

    


    function attachFileHandler(){
       
    }


    function updateTableOfContent(ligneId,status){
        switch(status){
            case 1: {
                document.getElementById(ligneId+'_img').setAttribute('src',"images/pending_trans.png");
                document.getElementById(ligneId+'_img').style.width = '0.8vw' ;
                document.getElementById(ligneId+'_img').style.height = '0.8vw' ;
                document.getElementById(ligneId+'_img').style.marginRight = '0.67vw' ;
                document.getElementById(ligneId+'_libelle').style.color="#dc900b";   
                return 1;            
            };
           

            case 2: {
                document.getElementById(ligneId+'_img').setAttribute('src',"images/check_trans.png");
                document.getElementById(ligneId+'_libelle').style.color="rgb(167 164 164)";   
                return 1;       
            } ;
            
        }
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_CT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_CT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);               
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_CT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_CT :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }



    function updateLesson(status){
        var lesson = {...currentAppContext.currentLesson};
        var errorCode = checkData();
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        if(errorCode==0){
            var devoirs = createString(lesson.devoirs);
            var resumes = createString(lesson.resumes);
            axiosInstance.post(`update-lesson/`, {
                id_lesson : lesson.id,
                status  : status, 
                devoirs : devoirs,
                resumes : resumes
            }).then((res)=>{
                lesson.etat = status;
                updateTableOfContent(props.id, status);
                currentAppContext.setCurrentLesson(lesson);
               
                chosenMsgBox = MSG_SUCCESS_CT;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("success_operation_M"), 
                    message:t("success_operation")
                })              
                
            })

        } else{
            if(errorCode==1){              
                errorDiv.className = classes.formErrorMsg;
                errorDiv.textContent = t("enter_meeting_date");               
            }
            
            if(errorCode==2){
                errorDiv.className = classes.formErrorMsg;
                errorDiv.textContent = t("lesson_empty_error");
            }
        }      

    }

    function checkData(){
        var errorCode = 0
        if(!((isNaN(lesson_begining_date) && (!isNaN(Date.parse(lesson_begining_date)))))){
            errorCode=1;  ///code 1 => erreur au niveau de la date
            return errorCode;
        }

        if(currentAppContext.currentResumeTab.length==0 && currentAppContext.currentDevoirTab==0){
            errorCode=2;  ///code 2 => erreur de type contenu vide 
            return errorCode;
        }

        return errorCode;
    }

    function createString(tab){
        var chaine = ''
        tab.map((elt, index)=>{
            if(index==0) chaine = elt.date+"&&"+elt.libelle;
            else chaine = chaine + "²²" + elt.date+"&&"+elt.libelle;
        })
        return chaine;
    }

  

    function addDevoir(devoir){        
        var lesson = {...currentAppContext.currentLesson};
       
        if(devoir.length >0){
            lesson.devoirs.push({
                libelle :devoir,
                date : new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear()
            });

            currentAppContext.setCurrentLesson(lesson);
            setModalOpen(false);      
            currentUiContext.setBookInActivity(false);      
        }
    }


    function addResumer(resumer){
        var lesson = {...currentAppContext.currentLesson};
        if(resumer.length >0){
            lesson.resumes.push({
                libelle :resumer,
                date : new Date().getDate()+'/'+ (new Date().getMonth()+1)+'/'+new Date().getFullYear()
            });

            currentAppContext.setCurrentLesson(lesson);
            setModalOpen(false);  
            currentUiContext.setBookInActivity(false);     
        }

    }

    function getLessonBeginDate(e){
        lesson_begining_date = e.target.value;

    }

/*--------------------------------- Theming functions ---------------------------------*/

    
    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
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

    function getChapitreTextColor()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return 'rgb(47 87 180)' ;
        case 'Theme2': return 'rgb(29 95 2)' ;
        case 'Theme3': return '#5d5a5a' ;
        default: return 'rgb(47 87 180)' ;
      }
    }

    function getLessonTextColor()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return 'rgb(115 149 194)' ;
        case 'Theme2': return 'rgb(82 146 58)' ;
        case 'Theme3': return '#aca4a4' ;
        default: return 'rgb(115 149 194)' ;
      }
    }

/*--------------------------------- JSX Code  ---------------------------------*/    
    return(        
        <div id={props.id} className={classes.page}>
            <div id='errMsgPlaceHolder'/> 
            <div className={classes.dateZone}>
                <div className={classes.inputRow}>
                    <div style={{marginRight:'-1vw', fontWeight:'700', fontSize:'1vw', width:'4vw'}}>
                        {t("date")} :                
                    </div>
                        
                    <div style={{marginTop:isMobile&&window.matchMedia("screen and (max-height: 420px)").matches ? '-2vh':null}}> 
                        <input id="date" type="text" onChange={getLessonBeginDate}  defaultValue={currentAppContext.currentLesson.date} style={{fontSize:'1vw', height: isMobile? '0.7vw':'1.3vw', width:'5.3vw', borderBottom:'1px dotted rgb(195 189 189)'}}/>
                    </div>
                </div>
            </div>

            <div className={classes.lessonTitleZone}>
                <div className={classes.inputRow}>
                    <div  style={{width:'5vw', fontSize:'1vw', fontWeight:'700', color:'black'}}>
                        {t("chapter")} :                
                    </div>
                        
                    <div style={{marginTop:isMobile&&window.matchMedia("screen and (max-height: 420px)").matches ? '-2vh':null}}> 
                        <input id="chapitre" type="text"  defaultValue={props.contenu.libelleChapitre} style={{fontSize:'1vw', fontWeight:'700', height:'1vw', width:'22.3vw', color:'rgb(136 138 140)', borderBottom:'1px dotted rgb(195 189 189)'}} />
                    </div>
                </div>

                <div className={classes.inputRow}>
                    <div style={{width:'5vw', fontSize:'1vw', fontWeight:'700', color:'black'}}>
                        {t("lesson_title")}:                
                    </div>
                        
                    <div style={{marginTop:isMobile&&window.matchMedia("screen and (max-height: 420px)").matches ? '-2vh':null}}>  
                        <input id="lecon" type="text"  className={classes.inputRowControl} defaultValue={props.contenu.libelleLesson} style={{fontSize:'1vw', fontWeight:'700', height:'1vw', width:'22.3vw', color:'rgb(136 138 140)', borderBottom:'1px dotted rgb(195 189 189)'}}/>
                    </div>
                </div>
                
            </div>

            {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }

            <div className={classes.inputRow} style={{marginBottom:'2.3vh', marginTop:'1.3vh'}}>
                
                <div className={classes.inputRow}>
                        <input type='checkbox'  checked={devoirOpen==1} name='bookDetails'  style={{width:'0.77vw'}}  onClick={()=>{(devoirOpen!=1)? setDevoirOpen(1) : setDevoirOpen(2);}}/>
                        <div  style={{marginLeft:'0.3vw', fontSize: isMobile ?'1.3vw':'0.9vw', fontWeight:'800'}}>
                            {t("given_homework")}             
                        </div>
                </div>

                <div className={classes.inputRow}>
                    <input type='checkbox' checked={devoirOpen==2} name='bookDetails'  style={{width:'0.77vw'}}  onClick={()=>{(devoirOpen!=2) ? setDevoirOpen(2) : setDevoirOpen(1);}} />
                    <div style={{marginLeft:'0.3vw', fontSize: isMobile ?'1.3vw':'0.9vw', fontWeight:'800'}}>
                        {t("lesson_summary")}               
                    </div>
                </div>
                                            
            </div>
         
            <div className={classes.inputRowSimple +' '+classes.BoldMedium +' '+classes.paddingHorizontal}>
                <div className={classes.inputRowLeft+' '+classes.textStyleP}>
                    {(devoirOpen==2) ? t("summary_list") : (devoirOpen==1) ? t("homework_list"):null}
                </div>

                <div className={classes.inputRowRight}>
                    <CustomButton
                        btnText= {t("add")}  
                        buttonStyle={classes.btnAdd}
                        btnTextStyle = {classes.btnTextStyle}
                        hasIconImg= {false}
                        btnClickHandler={()=>{currentUiContext.setBookInActivity(true); setModalOpen(true); console.log('activite',currentUiContext.bookInActivity)}}
                        disable={(currentAppContext.currentLesson.etat==CLOTURE)}
                    /> 
                </div>           
            </div>
            
            <div style={{width:'93%', height:'45vh', borderStyle:'solid', borderWidth:"2px", borderColor:'gray', borderRadius:'7px', alignSelf:'center', padding:7, marginBottom:'-2vh'}}>
                {(modalOpen) && <BackDrop/>}
                {(modalOpen) && <AddLessonNote isDevoir ={(devoirOpen==1)} cancelHandler={()=>{setModalOpen(false); currentUiContext.setBookInActivity(false);}} addNote={(devoirOpen==1) ? addDevoir:addResumer}/>}

              
                <div  style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'center', width:'97%', height:'93%', overflowX:'scroll', overflowY:'scroll', backgroundColor:'#d4deee'}}> 
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', width:'100%', height:'10%', backgroundColor:"gray"}}>
                        <div style={{width:'80%'}}>
                            <label className={classes.textStyle+' '+classes.BoldMediumP}>Titre</label>
                        </div>

                        <div style={{width:'20%'}}>
                            <label className={classes.textStyle+' '+classes.BoldMediumP}>Date</label>
                        </div>                            
                    </div>
                                        
                    {(devoirOpen==1) ? 
                        (currentAppContext.currentLesson.devoirs||[]).map((devoir)=>{
                            return(  
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'97%'}}>
                                    <div style={{width:'80%', borderBottom:"1px solid black"}}>
                                        <div className={classes.textStyleP}> {devoir.date}</div>
                                    </div> 
                                    <div style={{width:'20%', borderBottom:"1px solid black"}}>
                                        <div className={classes.textStyleP}> {devoir.libelle}</div>
                                    </div>                                        
                                </div>                     
                            );
                        })
                        :
                        (devoirOpen==2) ?
                        (currentAppContext.currentLesson.resumes||[]).map((resume)=>{
                                return(  
                                    <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', width:'97%'}}>
                                        <div style={{width:'80%', borderBottom:"1px solid black"}}>
                                            <div className={classes.textStyleP}> {resume.date}</div>
                                        </div>
                                        <div style={{width:'20%',borderBottom:"1px solid black"}}>
                                            <div className={classes.textStyleP}> {resume.libelle}</div>
                                        </div>                                        
                                    </div>                     
                                );
                            }) 
                        :
                        null                      
                    }
                    
                </div>
                
            </div>
           
            <div className={classes.attachFileZone} >
                <CustomButton
                    btnText={t("join_file")} 
                    buttonStyle={getSmallButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    hasIconImg= {true}
                    imgSrc='images/trombone2.png'
                    imgStyle = {classes.imgStyleP}
                    btnClickHandler={attachFileHandler}
                    style={{paddingRight:'3px',width: isMobile? '8vw':'7vw'}}
                    disable={(currentAppContext.currentLesson.etat==CLOTURE)}
                />
                <CustomButton
                    btnText={t("save")} 
                    buttonStyle={getSmallButtonStyle()}
                    style={{width:'7vw'}}
                    btnTextStyle = {classes.btnSmallTextStyle}
                    btnClickHandler={()=>{updateLesson(EN_COURS)}}
                    disable={(currentAppContext.currentLesson.etat==CLOTURE)}
                /> 


                <CustomButton
                    btnText={t("close_lesson")} 
                    buttonStyle={getSmallButtonStyle()}
                    style={{width:'7vw'}}
                    btnTextStyle = {classes.btnSmallTextStyle}
                    btnClickHandler={()=>{updateLesson(CLOTURE)}}
                    disable={(currentAppContext.currentLesson.etat==CLOTURE)}
                /> 

                       
            </div>

            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', alignSelf:'center', width:'97%' }}>
                <CustomButton
                    btnText= {'< '+t("previous")}
                    buttonStyle={getSmallButtonStyle()}
                    btnTextStyle = {classes.btnSmallTextStyle}
                    style={{width:isMobile? '6vw':'5vw'}}
                    btnClickHandler={()=>getPreviousHandler(props.id,props.contenu)}

                />

                <CustomButton
                    btnText={t("table_of_content")} 
                    buttonStyle={getSmallButtonStyle()}
                    btnTextStyle = {classes.btnSmallTextStyle}
                    style={{width:isMobile? '7vw':'6.3vw'}}
                    btnClickHandler={()=>{gotoPreface();}}
                />


                {(LISTE_LECONS[LISTE_LECONS.length-1].lessonId != props.id) ?
                    <CustomButton
                        btnText={t("next")+' >'}
                        buttonStyle={getSmallButtonStyle()}
                        btnTextStyle = {classes.btnSmallTextStyle}
                        style={{width:'5vw'}}
                        btnClickHandler={()=>getNextHandler(props.id)}
                        //disable={(isValid == false)}
                    />  
                    :
                    null  
                }
                          
            </div>
            <input id={props.contenu.lessonId +"_previousSheet"} type="hidden"  value={props.contenu.previousId} />
            
        </div>            
    );
}
export default Sheet;