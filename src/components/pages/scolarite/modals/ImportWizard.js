import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import ProgressBar from '../../../progressBar/ProgressBar';
import MsgBox from '../../../msgBox/MsgBox';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import * as XLSX_IMPORT from 'xlsx';

var cur_fileToUpload   = undefined;
var cur_fileToDownLoad = undefined
var cur_classeId       = undefined;
var cur_coursId        = undefined;
var cur_coursLabel     = undefined
var selected_file_name ='';
var filename           = '';


var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;
const BARWIDTH = 27;

const SERVER_ADDRESS = 'http://192.168.43.99';

function ImportWizard(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const [fileSelected, setFileSelected] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [percent, setPercent]           = useState(0);
    
   
    const [isDownload,setIsDownload]= useState(false);
    
    //const [formMode,setFormMode] = useState("creation") //creation, modif, consult


    const [optClasse, setOptClasse] = useState([]);
    const [optCours, setOptCours] = useState([]);
    const [inputDataCorrect, setInputDataCorrect] = useState(false);

    useEffect(()=> {
        cur_fileToDownLoad = "export_eleves_"+props.classeLabel;
        selected_file_name = '';
        getEtabListClasses();
        currentUiContext.setIsParentMsgBox(false);        
    },[]);


    const getEtabListClasses=()=>{
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  -- Choisir une classe --  ' : '  --Select Class --  '  }]
        
        if(props.formMode=="special"){
            tempTable=[];
            tempTable.push({value:props.selectedClasse.id, label:props.selectedClasse.label});
            setOptClasse(tempTable);
        }else{

            let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
            console.log(classes)
            let classes_user;
            if(currentAppContext.infoUser.is_prof_only) 
                classes_user = currentAppContext.infoUser.prof_classes;
            else{
                classes_user = currentAppContext.infoUser.censeur_classes;
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

            // axiosInstance.post(`list-classes/`, {
            //     id_sousetab: currentAppContext.currentEtab,
            // }).then((res)=>{                
            //     res.data.map((classe)=>{
            //         tempTable.push({value:classe.id, label:classe.libelle})              
            //     })   
            //     setOptClasse(tempTable);                
            // })
        setOptClasse(tempTable);                

        }       
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        var tabCours;
        
        if(props.formMode=="special"){
            tempTable=[];
            cur_coursId = props.selectedCours.id;
            tempTable.push({value:props.selectedCours.id, label:props.selectedCours.label});
            setOptCours(tempTable);
            setInputDataCorrect(true);
        }else{
            if(classeId!=0){
                if(currentAppContext.infoUser.is_censeur)
                    tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
                    
                else
                    tabCours = currentAppContext.infoUser.prof_cours.filter(cours=>cours.id_classe ==classeId)
        
                tabCours.map((cours)=>{
                tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
                })    
            }       
            console.log('cours',tabCours,tempTable);
            setOptCours(tempTable);
            if(document.getElementById('optCours').options[0]!= undefined)
            document.getElementById('optCours').options[0].selected=true;
        }     
     
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
    
    function classeChangeHandler(e){
       
        if(e.target.value != optClasse[0].value){
            cur_classeId = e.target.value;
            getCoursClasse(currentAppContext.currentEtab, cur_classeId);
        }else{
            cur_classeId = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
        }
        setInputDataCorrect(false);
    }


    function coursChangeHandler(e){
        if(e.target.value != optCours[0].value){
            cur_coursId    = e.target.value;
            cur_coursLabel = optCours.find((elt)=>elt.value == cur_coursId).label
            setInputDataCorrect(true);
            
        } else {
            cur_coursId    = undefined;
            cur_coursLabel = undefined
            setInputDataCorrect(false);
        }

    }
    

    

    function downloadHandler(e){
        if(window.location.hostname==="localhost" || window.location.hostname==="127.0.0.1"){
            var downloadUrl = 'http://localhost:3000/fiches/FicheProgression.xlsx';
            // var downloadUrl = 'http://localhost:3000/fiches/FicheProgression'+'___'+currentAppContext.idUser+'___'+cur_coursId;
        } else var downloadUrl = SERVER_ADDRESS + ':3000/fiches/FicheProgression.xlsx';


        fetch(downloadUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'blob'
            },
            responseType:'arraybuffer'
        })
        .then(response =>{
            response.blob().then(blob=> {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download ='FicheProgression.xls';
                a.click();
            })
            //window.location.href=response.url;
        })

        /*axios.post('http://localhost:3000/fiches', {
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
        });*/
        

    }


    function fileChangeHandler(e){
        cur_fileToUpload = e.target.files[0];
        if(cur_fileToUpload!=undefined){
            selected_file_name = cur_fileToUpload.name;
            setFileSelected(true);
        }else{
            selected_file_name = '';
            setFileSelected(false); 
        }
        console.log('file data',cur_fileToUpload);
        console.log("msgParents:", currentUiContext.isParentMsgBox);
        
    }   


    function storeFicheProgress(coursId){
        //currentUiContext.setIsParentMsgBox(false);
        axiosInstance.post(`sauvegarder-fiche-progression/`, {
            id_cours      : coursId,
            id_classe     : cur_classeId,
            libelle_cours : cur_coursLabel,
            id_sousetab   : currentAppContext.idEtabInit,
            filename      : filename,
            id_user       : currentAppContext.idUser
           
        }).then((res)=>{
            console.log("cours, sous etab:", coursId, currentAppContext.idEtabInit);
            console.log("fiche cree:",res.data);
            
           //ici il faut ajouter un if si l'operation se passe bien afficher ceci
           
            chosenMsgBox = MSG_SUCCESS_FP;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })
           
            //sinon afficher ceci
            /*chosenMsgBox = MSG_ERROR;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })*/
                
        })

    }

    function saveFicheProgressChanges(e){
        uploadFile(cur_fileToUpload);
    }

    function uploadFile(){
        var form_data= new FormData();

        form_data.append('desciption','Fiche de progression par classe' );
        form_data.append('file_type','fiche-progression' );
        form_data.append('timestamp','' );
        form_data.append('file',cur_fileToUpload);
        form_data.append('id_cours',cur_coursId);
        form_data.append('id_user',currentAppContext.idUser);

        axios.post(`http://127.0.0.1:8000/api/upload-fiche-progression/`,form_data, {
            header:{
                'Content-type': 'multipart/form-data'
            }
                 
        }).then((res)=>{
            console.log(res.data);
            filename = res.data.filename;
            storeFicheProgress(cur_coursId);  
           // setFileUploaded(true);           
        })

    }


    function exportOrImport(e){   
        if(props.isImport) importData(cur_fileToUpload);
        else {
            exportData(props.dataToExport,cur_fileToDownLoad);
        }
    }

    function exportTemplate(e){
        exportData(props.importTemplate,cur_fileToDownLoad);
    }

    function importData(file){
        const reader = new FileReader();
        reader.onload = (event) => {
            const workbook   = XLSX_IMPORT.read(event.target.result,{type:'binary'});
            const sheetName  = workbook.SheetNames[0];
            const sheet      = workbook.Sheets[sheetName];
            const sheetData  = XLSX_IMPORT.utils.sheet_to_json(sheet);

            props.actionHandler(sheetData)
        }
        reader.readAsBinaryString(file);
    }



    const  exportData = async(dataToExport, fileName) =>{
        const filetype      = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws            = XLSX.utils.json_to_sheet(dataToExport);
        const wb            = {Sheets:{'data':ws}, SheetNames:['data']};
        const excelBuffer   = XLSX.write(wb,{bookType:'xlsx', type:'array'});
        const data          = new Blob([excelBuffer],{type:filetype});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formImpExp}>
            <div className={getCurrentHeaderTheme()}>
                {props.isImport ?
                    <div className={classes.formImageContainer}>
                        <img alt='add student' className={classes.formHeaderImg1}  src='images/import.png'/>
                    </div>
                    :
                    <div className={classes.formImageContainer}>
                        <img alt='add student' className={classes.formHeaderImg1}  src='images/export.png'/>
                    </div>
                }

               
                <div className={classes.formMainTitleP} >
                    {t("import_wizard")}
                </div>  

            </div>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'47vh'}}/>}
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
            
            <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", position:"absolute", top:"19vh", left:"3vw"}}>

                <div style={{marginTop:"-7vh", marginBottom:"-2vh"}}>
                    <img src="images/import.gif" style={{width:"20vw", height:"9vh", transform:"rotate(180deg)"}}/>
                </div>
                <ProgressBar 

                    pgBarWidth    = {BARWIDTH+"vw"}
                    rate          = {percent+'%'}
                    rateTextStyle = {{fontSize:"0.9vw", marginBottom:"-0.53vh", color:"white", textAlign:"center"}}
                    rateStyle     = {{justifyContent:"center", alignItems:"center", width:(percent*BARWIDTH)/100+'vw', /*backgroundColor:"#065386"*/ backgroundColor:"#0f68a4"}}
                    showRate      = {true}
                    ratePosition  = {"inside"}

                    barContainerStyle={{
                        marginTop:"2.3vh"
                    }}

                    barStyle={{
                        height           :"3.3vh", 
                        borderRadius     :"1vh", 
                        backgroundColor  :"white",
                        border           :"solid 1px #3b4f78",
                        marginTop        :"0vh"
                    }}

                />
                               
            </div>
            
            <div className={classes.formButtonRowP}>
                {props.isImport &&
                    <CustomButton
                        btnText={t('ok')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={exportOrImport}
                        disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }

                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
            </div>

        </div>
       
    );
 }
 export default ImportWizard;
 