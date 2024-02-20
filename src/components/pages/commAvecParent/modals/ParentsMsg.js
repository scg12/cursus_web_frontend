import React from 'react';

import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { useContext, useState, useEffect } from "react";
import {isMobile} from 'react-device-detect';
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {getTodayDate, changeDateIntoMMJJAAAA} from '../../../../store/SharedData/UtilFonctions';



var chosenMsgBox;
const MSG_SUCCESS_FP = 1;
const MSG_WARNING_FP = 2;
const MSG_ERROR_FP   = 3;

var CURRENT_COMM;
const MultiSelectId        = "MS_1";
var list_destinataire      = "";
var list_destinataires_ids = "";
var precDest_ids           = ""
var msgTitle               = "";
var msgDesciption          = "";

var tempTable;
var list_initiale_eleves;

var MOUSE_INSIDE_DROPDOWN;

function ParentsMsg(props) {
    const { t, i18n }       = useTranslation();
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme     = currentUiContext.theme;
    const [multiSelectVisible, setMultiSelectVisible] = useState(false);
    const [optClasses, setOptClasses] = useState(false);
    const [listEleves, setListEleves] = useState([]);
    const [listDestinataires, setListDestinataires] = useState("");
    
    

    
 
    useEffect(()=> {
        precDest_ids = "";
        currentUiContext.setIsParentMsgBox(false);   
        getEtabListClasses(); 
    },[]);


    const getEtabListClasses=()=>{
        tempTable=[{value: -1,      label: (i18n.language=='fr') ? ' --- Choisir --- ' : '--- Select ---'  }]
        let classes_user;
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);

        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else {
            classes_user = currentAppContext.infoUser.admin_classes;
            let prof_classes = currentAppContext.infoUser.prof_classes;
            // console.log(pp_classes)
            prof_classes.forEach(classe => {
                if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                    classes_user.push({"id":classe.id,"libelle":classe.libelle})

            });
        }

        let n = classes_user.length;
        let m = classes.length;
        let i = 0;
        let j = 0;

        while(i<n){
            j = 0;
            while(j<m){
                if(classes_user[i].id==classes[j].id_classe){
                    tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                    break;
                }
                j++;
            }
            i++;
        }

        setOptClasses(tempTable);
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

    
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }


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

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
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

   
    /************************************ Handlers ************************************/    
    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
    }
    
    function addDestinataire(e){
        setMultiSelectVisible(true);
    }


    function sendMsg(e){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_COMM);
        getFormData();
        console.log('apres:',CURRENT_COMM);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_COMM);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
           props.actionHandler(CURRENT_COMM);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function getFormData(){
        CURRENT_COMM = {};
        CURRENT_COMM.id_sousetab  = currentAppContext.currentEtab;
        CURRENT_COMM.sujet        = msgTitle;
        CURRENT_COMM.message      = msgDesciption;
        CURRENT_COMM.date         = getTodayDate(); 
        CURRENT_COMM.emetteur     = currentAppContext.infoUser.user_name;
        CURRENT_COMM.id_eleves    = getIdDestinataires(listDestinataires,list_destinataires_ids);
        precDest_ids ="";
    }

    function getIdDestinataires(destinataires, destinatairesId){
        var tabDestinataires   = destinataires.split(',');
        var tabDestinatairesId = destinatairesId.split('_');

        console.log("destinataires", tabDestinatairesId, tabDestinataires);
        var ids_destinataires  = "";

        tabDestinataires.map((elt1, index)=>{
            var dest = tabDestinatairesId.find((elt2)=>elt2.split('*')[1] == elt1)

            if(index <tabDestinataires.length-1){
                ids_destinataires = ids_destinataires + dest.split('*')[0]+'_';
            } else {
                ids_destinataires = ids_destinataires + dest.split('*')[0];
            }

        });

        console.log("destinataires", ids_destinataires);
        return ids_destinataires;
    }


    function formDataCheck1(){
        var errorMsg='';

        if(CURRENT_COMM.id_eleves.length == 0) {
            errorMsg=t("enter_msg_recipient");
            return errorMsg;
        } 
       
        if(CURRENT_COMM.sujet.length == 0) {
            errorMsg=t("enter_msg_subject");
            return errorMsg;
        } 

        if(CURRENT_COMM.message.length == 0) {
            errorMsg=t("enter_correct_msg");
            return errorMsg;
        } 

       
        return errorMsg;
    }

    function getMsgTitle(e){
        msgTitle = e.target.value;
    }

   

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_FP: {
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

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_FP: {
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

    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            list_initiale_eleves = [...listEleves];
            console.log(listEleves);
            setListEleves(listEleves);
        }) 
          
    }

    const formatList=(list) =>{
        var listElt;
        var tabelt=[];
        var formattedList =[{id:-1, label:t('all'), nom:"", prenom:""}]
        list.map((elt)=>{
            listElt={};
            listElt.id     = elt.id;
            listElt.label  = elt.nom +' '+elt.prenom;
            listElt.nom    = elt.nom;
            listElt.prenom = elt.prenom; 
            tabelt.push(false);              
            formattedList.push(listElt);            
        });  

        return formattedList;
    }



    function classChangeHandler(e){
        if(e.target.value > 0){
            getClassStudentList(e.target.value);
        }else{
            setListEleves([]);
            document.getElementById("searchText").value = "";
        }
    }

    function searchTextChangeHandler(e){
        var name = e.target.value;
        var matchedEleves =  list_initiale_eleves.filter((elt)=>elt.label.toLowerCase().includes(name.toLowerCase()));
        setListEleves(matchedEleves);
    }

    function validateSelectionHandler(e){
        precDest_ids           = precDest_ids.length == 0 ? document.getElementById("hidden1_"+MultiSelectId).value: precDest_ids +'_'+document.getElementById("hidden1_"+MultiSelectId).value;
        list_destinataire      = (document.getElementById("destinataireLabel").value.length == 0)  ? document.getElementById("hidden2_"+MultiSelectId).value : document.getElementById("destinataireLabel").value +','+ document.getElementById("hidden2_"+MultiSelectId).value;
        list_destinataires_ids = precDest_ids;
        
        console.log("destinataireIds",  precDest_ids);

        document.getElementById("destinataireId").value    = list_destinataires_ids;
        document.getElementById("destinataireLabel").value = list_destinataire;
        

        setListDestinataires(list_destinataire);
        setListEleves([]);
        setOptClasses(tempTable);
        setMultiSelectVisible(false);
    }

    function checkCharacters(e){       
        var regx = /^[A-Za-z0-9]+$/;
        e = e || window.event;
        if(regx.test(e.key)||e.keyCode==32){
            e.preventDefault();
            return false
        } 
    }

    function recipientChangeHandler(e){
        setListDestinataires(e.target.value);
    }
    
    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainerP4} onClick={()=>{if(!MOUSE_INSIDE_DROPDOWN && listEleves.length>0) {document.getElementById("hidden1_"+MultiSelectId).value = ""; setListEleves([]);}}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/Sms.png'/>
                </div>

                {!(props.formMode == 'consult')?          
                    <div className={classes.formMainTitle} >
                        {t("MSG_parent_M")}
                    </div>  
                    :
                    <div className={classes.formMainTitle} >
                        {t("consult_MSG_parent_M")}
                    </div> 
                }              
            </div>

            <div id='errMsgPlaceHolder'/>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'100vh'}}/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }

            <div style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", position:"absolute", top:"11.7vh", left:"5vw"}}>
                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'4.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("destinataire")}:
                    </div>

                    {(props.formMode=="consult")&&
                        <div> 
                            <input id="msgDestinataire"  type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  disabled={true} defaultValue={currentUiContext.formInputs[2]} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1vw', color:'#898585',textOverflow:"ellipsis"}}/>
                            <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                        </div>
                    }

                    {!(props.formMode=="consult")&&   
                        <div> 
                            <input id="destinataireLabel" onKeyPress={checkCharacters}  onChange={recipientChangeHandler} title={listDestinataires} type="text"  className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-8.3vw', height:'1rem', width:'14.3vw', fontSize:'0.83vw', color:'#898585', textOverflow:"ellipsis"}}/>
                            <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                        </div>
                    }
                    
                    {!(props.formMode=="consult")&&
                        <div>
                            <CustomButton
                                btnText={t("add")} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginLeft:'0.7vw', marginRight:'0.8vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler={addDestinataire}
                            /> 

                        </div>
                    }

                    
                    {multiSelectVisible &&
                        <div>
                            <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optClasses}
                                fetchedData         = {listEleves}
                                selectionMode       = {"multiple"}
                            
                                //-----Handler-----
                                optionChangeHandler     = {classChangeHandler      }
                                searchTextChangeHandler = {searchTextChangeHandler }
                                selectValidatedHandler  = {validateSelectionHandler}
                                mouseLeave              = {()=>{MOUSE_INSIDE_DROPDOWN = false}}
                                mouseEnter              = {()=>{MOUSE_INSIDE_DROPDOWN = true }}
                            
                                //-----Styles-----
                                searchInputStyle    = {{fontSize:"0.8vw"}}
                                comboBoxStyle       = {{width:"7vw", height:"3.7vh", border:"solid 1px #8eb1ec", fontSize:"0.8vw", borderRadius:"3px"}}
                                dataFieldStyle      = {{minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"63vh", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", backgroundColor:"whitesmoke"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ padding:"1vh", marginRight:"1vh"}}
                            />
                        </div>
                    }
                </div>

                {(props.formMode=="consult")&&
                    <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'4.7vh'}}> 
                        <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                            {t("sender")}:
                        </div>

                        {(props.formMode=="consult")&&
                            <div> 
                                <input id="msgSender"  type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  disabled={true} defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1vw', color:'#898585',textOverflow:"ellipsis"}}/>
                            </div>
                        }
                    
                    </div>
                }

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"1vh", marginLeft:"-3vw", height:'2.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg_object")}:
                    </div>

                    {(props.formMode=="consult")&&   
                        <div> 
                            <input id="msgObject" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  disabled={true} defaultValue={currentUiContext.formInputs[3]} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585', textOverflow:"ellipsis"}}/>
                            <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                        </div>
                    }


                    {!(props.formMode=="consult")&&    
                        <div> 
                            <input id="msgObject" type="text"  onChange = {getMsgTitle}  className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'14.3vw', fontSize:'0.83vw', color:'#898585'}}/>
                            <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                        </div>
                    }
                </div>

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'4.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg")}:
                    </div>
                </div> 
                <div style={{marginLeft:"-3vw", marginTop:"0.7vh"}}> 
                    {/* <textarea style={{width:"40vw",height:"auto", minHeight:"33vh"}}/> */}
                    <CKEditor
                        editor  = {ClassicEditor}
                        data    = {props.formMode=="consult"? currentUiContext.formInputs[4]:""}
                        style   = {{with:"50vw", minHeight:"33vh"}}
                        onReady = {editor => {
                            console.log("Editor is ready to use")
                        }}

                        onChange={(event,editor) => {msgDesciption = editor.getData();}}
                    
                    />
                </div>

            </div>

            {/* <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", position:"absolute",  bottom:"6.3vh", left:"1.7vw", height:'4.7vh', color:"#084481"}}> 
                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                    {t("msg_deadline")}:
                </div>

                <div style ={{display:'flex', flexDirection:'row', marginTop:"-1vh", marginLeft:"-0.8vw"}}> 
                    <input id="jour"  type="text"  onChange={getValiditeJour}  Placeholder=' jj'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'-2vw'}} /> <div style={{marginTop:"1vh"}}>/</div>
                    <input id="mois"  type="text"  onChange={getValiditeMois}  Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw',  textAlign:"center", height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  /><div style={{marginTop:"1vh"}}>/</div>
                    <input id="anne"  type="text"  onChange={getValiditeAnnee}  Placeholder='aaaa' onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("lieu_naissance"))}}  maxLength={4}   className={classes.inputRowControl }  style={{width:'2.7vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                </div>
            </div> */}
            
           
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                {!(props.formMode=="consult")&&
                    <CustomButton
                        btnText={t('send')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={sendMsg}
                        //disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }
            </div>

        </div>
       
    );
 }
 export default ParentsMsg;
 