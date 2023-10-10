import React from 'react';
import { createContext, useState } from 'react';

var constMsg ={
    visible:false,
    msgType:'info',
    msgTitle:"",
    message:"",    
}

const UiContext = createContext({
    logo :'',
    theme : 'Theme1',
    selectedTab : 'menuLi0',
    firstLoad : true,
    modalOpen : false,
    formInputs : {},
    msgBox     : {},
    
    isDashboardNav:false,
   
    // Emploi de temps Gestion des Matieres
    CURRENT_DROPPED_MATIERE_LIST:{},
    // Emploi de temps Gestion des profs
    CURRENT_DROPPED_PROFS_LIST:{},
    CURRENT_PROFS_LIST:{},
    //Gestion des sections au niveau de la config
    sectionSelected :{},

    // Pour l'emploi du temps
    listMatieres : {},
    listProfs : {},
    TAB_JOURS : {},
    TAB_VALEUR_HORAIRE : {},
    TAB_CRENEAU_PAUSE : {},
    TAB_PERIODES : {},
    matieresSousEtab : {},
    emploiDeTemps : {},
    classeEmploiTemps : {},
    indexClasse :{},
    intervalleMaxTranche :{},
    nbRefreshEmpoiTemps:{},
    currentIdClasseEmploiTemps :{},
    CURRENT_MATIERE_LIST:{},

    //pour le CT
    bookInActivity : false,

    //Pour les MsgBoxes 
    isParentMsgBox : false,

    //Matiere selectionnee dans la liste des matieres
    SELECTED_MATIERE_ID :'', 

    //Prof selectionnee dans la liste des profs
    SELECTED_PROF_ID :'', 

    //booleen pour signaler des modifications dans le l'emplo de temps
    ETDataChanged : false,

    //ID du menu actuel sur lequel on est et de son precedent
    currentSelectedMenuID : '0',
    previousSelectedMenuID: '0',
    prgramCoverSelectedLevel:{},

    //Emploi de temps Matiere et prof principal
    isMatiereEnable : true,

    //Emploi de temps Gestion des profs principaux
    currentPPList : [],

    //gestion du loading lors chargement des formulaires
    formIsloading : false, 





          
    
    updateTheme: (newTheme)=> {},
    updateLogo : (newLogo)=> {},
    updateTab : (newTab) => {},
    updateFirstLoad : (boolVal) => {},
    setModalOpen : (boolVal) => {},
    setFormInputs : (formInputsTable) => {}, 
    setIsDashboardNav: (boolVal) => {},
    

    // Emploi de temps Gestion des Matieres
    addMatiereToDroppedMatiereList : (newMatiere,index) => {},
    removeMatiereFromDroppedMatiereList : (index) => {}, 
    setListMatieres : (liste) => {},
    // Emploi de temps Gestion des profs
    addProfToDroppedProfList: (newProf,index)=> {}, 
    removeProfFromDroppedProfList: (index)=> {},

    //Gestion des sections au niveau de la config
    setSectionselected :(sectionTable) => {},

    //Message Box
    showMsgBox :(msg) => {},

    //pour le CT
    setBookInActivity:(boolVal) => {},

    //Pour les MsgBoxes 
    setIsParentMsgBox:(boolVal) => {},

    //Matiere selectionnee dans la liste des matieres
    setSelectedMatiereId :(idMatiere) => {},

    //Prof selectionnee dans la liste des profs
    setSelectedProfId :(idProf) => {}, 

    //booleen pour signaler des modifications dans le l'emplo de temps
    setETDataChanged : (boolVal) => {},

    //ID du menu actuel sur lequel on est et de son precedent
    setCurrentSelectedMenuID : (idMenu)=>{},
    setPreviousSelectedMenuID: (idMenu)=>{},

    //Emploi de temps Matiere et prof principal
    setIsMatiereEnable : (boolVal) => {}, 

    //Emploi de temps Gestion des profs principaux
    setCurrentPPList   : (tab) => {},

    //gestion du loading lors chargement des formulaires
    setFormIsloading  : (boolVal) => {}, 
    
});

export function UiContextProvider(props)
{    
    const [ChangedTheme, setTheme]= useState('Theme1');
    const [ChangedLogo, setLogo] = useState();
    const [ChangedTab, setTab] = useState('menuLi0');
    const [ChangedFirstLoad, setFirstLoad] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [inputTable, setInputTable] = useState([]);
    const [matiereBoard, setMatiereBoard] = useState([]);
    const [sectionSelected, setSectionSelected] = useState([0,0,0,0,0]);
    const [indexClasse, setIndexClasse] = useState();
    const [intervalleMaxTranche, setIntervalleMaxTranche] = useState("");
    const [nbRefreshEmpoiTemps, setNbRefreshEmpoiTemps] = useState(0);
    const [currentIdClasseEmploiTemps, setCurrentIdClasseEmploiTemps] = useState();
    const [msgBox, showMsgBox]= useState({constMsg});
    const [isDashboardNav, setIsDashboardNav]= useState(false);

    // Emploi de temps Gestion des Matieres
    const [CURRENT_DROPPED_MATIERE_LIST, setDroppedMatiereList] = useState([]);

    // Emploi de temps Gestion des profs
    const [CURRENT_DROPPED_PROFS_LIST, setDroppedProfList] = useState([]);
    const [CURRENT_PROFS_LIST, setCurrentProfList] = useState([]);
    const [listMatieres, setListMatieres] = useState([]);
    const [listProfs, setListProfs] = useState([]);
    const [TAB_JOURS, setTAB_JOURS] = useState([]);
    const [CURRENT_MATIERE_LIST, setCURRENT_MATIERE_LIST] = useState([]);
    const [emploiDeTemps, setEmploiDeTemps] = useState([]);
    const [classeEmploiTemps, setClasseEmploiTemps] = useState([]);
    const [TAB_VALEUR_HORAIRE, setTAB_VALEUR_HORAIRE] = useState([]);
    const [TAB_CRENEAU_PAUSE, setTAB_CRENEAU_PAUSE] = useState([]);
    const [TAB_PERIODES, setTAB_PERIODES] = useState([]);
    const [matiereSousEtab, setMatiereSousEtab] = useState([]);
    
    const [prgramCoverSelectedLevel, setPrgramCoverSelectedLevel]= useState({label:'Tous'  , id:0});

    //pour le CT
    const [bookInActivity, setBookInActivity] = useState(false);

    //Pour les MsgBoxes 
    const[isParentMsgBox,setIsParentMsgBox] = useState(false);

    //Pour garder la matiere stockee
    const[selectedMatiere, setSelectedMatiere] = useState('');

    //Pour garder le prof stocke
    const[selectedProf, setSelectedProf] = useState('');

    //booleen pour signaler des modifications dans le l'emplo de temps
    const [ETDataChanged, setETDataChanged]  = useState(false);

    //ID du menu actuel sur lequel on est et de son precedent
    const [currentSelectedMenuID, setCurrentSelectedMenuID]    = useState('0');
    const [previousSelectedMenuID, setPreviousSelectedMenuID]  = useState('0');

    //Emploi de temps Matiere et prof principal
    const [isMatiereEnable, setIsMatiereEnable] = useState(true);

    //Emploi de temps Gestion des profs principaux
    const [currentPPList, setCurrentPPList] = useState([]);

    //gestion du loading lors chargement des formulaires
    const [formIsloading, setFormIsloading] = useState(false);
      
   

    
    


    function updateThemeHandler(newTheme){
        setTheme(newTheme) 
    }

    function updateLogoHandler(newLogo){
        setLogo(newLogo)
    }
    
    function updateTabHandler(newTab){
        setTab(newTab)
    }

    function updateFirstLoadHandler(boolVal){
        setFirstLoad(boolVal)
    }

    function updateModalHandler(boolVal){
        setModalOpen(boolVal)
    }

    function updateInputsTableHandler(inputTable) {
        setInputTable(inputTable)
    }

    function setPrgramCoverSelectedLevelHandler(msg){
        setPrgramCoverSelectedLevel(msg);
    }

     // Emploi de temps Gestion des Matieres
    function addMatiereToDroppedMatiereListHandler(newMatiere, index){
        // -2 on update toute la liste newMAtiere represente dans ce cas une liste
        if(index==-2) setDroppedMatiereList(newMatiere);
        else
            if(index!=-1){
                var droppedMatiereTab = [...CURRENT_DROPPED_MATIERE_LIST];
                droppedMatiereTab.splice(index,1);
                droppedMatiereTab.splice(index,0,newMatiere);
                setDroppedMatiereList(droppedMatiereTab);
            }
            else{
                setDroppedMatiereList(newMatiere);
                //setDroppedMatiereList((CURRENT_DROPPED_MATIERE_LIST)=>[...CURRENT_DROPPED_MATIERE_LIST, newMatiere]);
                // console.log(CURRENT_DROPPED_MATIERE_LIST);
            }
    }

    function setListMatieresHandler(listMatieres){
        var liste = [...listMatieres];
        setListMatieres(liste);
    }
    function setListProfsHandler(listProfs){
        var liste = [...listProfs];
        setListProfs(liste);
    }
    function setClasseEmploiTempsHandler(items){
        setClasseEmploiTemps([...items]);
    }
    function setTAB_JOURSHandler(liste){
        setTAB_JOURS(liste);
    }
    function setCURRENT_MATIERE_LISTHandler(liste){
        setCURRENT_MATIERE_LIST(liste);
    }
    function setEmploiDeTempsHandler(liste){
        setEmploiDeTemps(liste);
    }
    function setTAB_VALEUR_HORAIREHandler(liste){
        setTAB_VALEUR_HORAIRE(liste);
    }
    function setTAB_CRENEAU_PAUSEHandler(liste){
        setTAB_CRENEAU_PAUSE(liste);
    }
    function setTAB_PERIODESHandler(liste){
        setTAB_PERIODES(liste);
    }
    function setMatiereSousEtabHandler(matieres){
        var liste = [...matieres];
        setMatiereSousEtab(liste);
    }

    function removeMatiereFromDroppedMatiereListHandler(index){
        var droppedMatiereTab = [...CURRENT_DROPPED_MATIERE_LIST];
        droppedMatiereTab.splice(index,1);        
        setDroppedMatiereList(droppedMatiereTab);       
    }

    // Emploi de temps Gestion des profs
    function addProfToDroppedProfListHandler(newProf, index){
        if(index!=-1){
            var droppedProfTab = [...CURRENT_DROPPED_PROFS_LIST];
            droppedProfTab.splice(index,1);
            droppedProfTab.splice(index,0,newProf);
            setDroppedProfList(droppedProfTab);
        }
        else{
            //setDroppedProfList((CURRENT_DROPPED_PROFS_LIST)=>[...CURRENT_DROPPED_PROFS_LIST, newProf]);
            //setDroppedProfList(newProf);
            setDroppedProfList(newProf);
        }
    }

    function removeProfFromDroppedProfListHandler(index){
        var droppedProfTab = [...CURRENT_DROPPED_PROFS_LIST];
        droppedProfTab.splice(index,1);       
        setDroppedProfList(droppedProfTab);        
    }

    function setIndexClasseHandler(classe){
        setIndexClasse(classe);
    }
    function setIntervalleMaxTrancheHandler(intervalle){
        setIntervalleMaxTranche(intervalle);
    }
    function setNbRefreshEmpoiTempsHandler(reinit){
        if(reinit==1) setNbRefreshEmpoiTemps(0)
        else
            setNbRefreshEmpoiTemps(nbRefreshEmpoiTemps+1);
    }
    function setCurrentProfListHandler(items){
        setCurrentProfList(items);
    }
    function setCurrentIdClasseEmploiTempsHandler(classe){
        setCurrentIdClasseEmploiTemps(classe);
    }
    
    //Gestion des sections au niveau de la config
    function updateSection(sectionTab){
        setSectionSelected(sectionTab);
    }


    //Message Box
    function setMessageBox(msg){
        showMsgBox(msg);
    }

    //dashboard Nav
    function enableDashboardNav(boolVal){
        setIsDashboardNav(boolVal);
    }

    //pour le CT
    function setBookInActivityHandler(boolVal){
        setBookInActivity(boolVal);
    }

    //Pour les MsgBoxes 
    function setIsParentMsgBoxHandler(boolVal){
        setIsParentMsgBox(boolVal)
    }


    //Matiere selectionnee dans la liste des matieres
    function setSelectedMatiereHandler(idMatiere) {
        setSelectedMatiere(idMatiere);
    }

    //Prof selectionnee dans la liste des profs
    function setSelectedProfeHandler(idProf) {
        setSelectedProf(idProf);
    }


    //booleen pour signaler des modifications dans le l'emplo de temps
    function ETDataChangeHandler(boolval){
        setETDataChanged(boolval);
    }

    //ID du menu actuel sur lequel on est et de son precedent
    function currentSelectedMenuIDHandler(idMenu){
        setCurrentSelectedMenuID(idMenu)
    }

    function previousSelectedMenuIDHandler(idMenu){
        setPreviousSelectedMenuID(idMenu)
    }

    //Emploi de temps Matiere et prof principal
    function ETMatiereEnableHandler(boolval){
        setIsMatiereEnable(boolval)
    }

    //Emploi de temps Gestion des profs principaux
    function currentPPlistHandler(tab){
        setCurrentPPList(tab)
    }

    //gestion du loading lors chargement des formulaires
    function formIsloadingHandler(boolVal){
        setFormIsloading(boolVal)
    }
   
     


    const UI_Ctx = {
        logo : ChangedLogo,
        theme : ChangedTheme,
        selectedTab : ChangedTab,
        firstLoad : ChangedFirstLoad,
        modalOpen : modalOpen,
        formInputs: inputTable,
       

        CURRENT_DROPPED_MATIERE_LIST:CURRENT_DROPPED_MATIERE_LIST,
        CURRENT_DROPPED_PROFS_LIST:CURRENT_DROPPED_PROFS_LIST,
        CURRENT_PROFS_LIST:CURRENT_PROFS_LIST,
        listMatieres: listMatieres,
        listProfs: listProfs,
        TAB_JOURS: TAB_JOURS,
        CURRENT_MATIERE_LIST: CURRENT_MATIERE_LIST,
        emploiDeTemps: emploiDeTemps,
        classeEmploiTemps: classeEmploiTemps,
        TAB_VALEUR_HORAIRE: TAB_VALEUR_HORAIRE,
        TAB_CRENEAU_PAUSE: TAB_CRENEAU_PAUSE,
        TAB_PERIODES: TAB_PERIODES,
        matiereSousEtab: matiereSousEtab,

        //Gestion des sections au niveau de la config
        sectionSelected : sectionSelected,
        indexClasse : indexClasse,
        intervalleMaxTranche:intervalleMaxTranche,
        nbRefreshEmpoiTemps:nbRefreshEmpoiTemps,
        currentIdClasseEmploiTemps:currentIdClasseEmploiTemps,
       
        //Message Box
        msgBox: msgBox,
        isDashboardNav:isDashboardNav,

        //pour le CT
        bookInActivity : bookInActivity,

        //Pour les MsgBoxes 
        isParentMsgBox : isParentMsgBox,

        //Matiere selectionnee dans la liste des matieres
        SELECTED_MATIERE_ID : selectedMatiere,

        //Prof selectionne dans la liste des profs
        SELECTED_PROF_ID : selectedProf,

        //booleen pour signaler des modifications dans le l'emplo de temps
        ETDataChanged : ETDataChanged,

        //ID du menu actuel sur lequel on est et de son precedent
        currentSelectedMenuID : currentSelectedMenuID,
        previousSelectedMenuID : previousSelectedMenuID,

        prgramCoverSelectedLevel : prgramCoverSelectedLevel,

        //Emploi de temps Matiere et prof principal
        isMatiereEnable : isMatiereEnable,

        //Emploi de temps Gestion des profs principaux
        currentPPList : currentPPList,

        //gestion du loading lors chargement des formulaires
        formIsloading : false,



       
       

        updateTheme: updateThemeHandler,
        updateLogo : updateLogoHandler,
        updateTab : updateTabHandler,
        updateFirstLoad: updateFirstLoadHandler,
        setModalOpen: updateModalHandler,
        setFormInputs: updateInputsTableHandler, 
        
        // Emploi de temps Gestion des Matieres
        addMatiereToDroppedMatiereList : addMatiereToDroppedMatiereListHandler,
        removeMatiereFromDroppedMatiereList:removeMatiereFromDroppedMatiereListHandler,
        setListMatieres : setListMatieresHandler,
        setClasseEmploiTemps : setClasseEmploiTempsHandler,
        setListProfs : setListProfsHandler,
        setTAB_JOURS : setTAB_JOURSHandler,
        setCURRENT_MATIERE_LIST : setCURRENT_MATIERE_LISTHandler,
        setEmploiDeTemps : setEmploiDeTempsHandler,
        setTAB_VALEUR_HORAIRE : setTAB_VALEUR_HORAIREHandler,
        setTAB_CRENEAU_PAUSE : setTAB_CRENEAU_PAUSEHandler,
        setTAB_PERIODES : setTAB_PERIODESHandler,
        setMatiereSousEtab : setMatiereSousEtabHandler,
        setCurrentProfList : setCurrentProfListHandler,

        
        // Emploi de temps Gestion des profs
        addProfToDroppedProfList : addProfToDroppedProfListHandler,
        removeProfFromDroppedProfList : removeProfFromDroppedProfListHandler,

        //Gestion des sections au niveau de la config
        setSectionselected : updateSection,
        setIndexClasse : setIndexClasseHandler,
        setIntervalleMaxTranche : setIntervalleMaxTrancheHandler,
        setNbRefreshEmpoiTemps: setNbRefreshEmpoiTempsHandler,
        setCurrentIdClasseEmploiTemps:setCurrentIdClasseEmploiTempsHandler,

        //Message Box
        showMsgBox : setMessageBox,

        //Dashboard Nav
        setIsDashboardNav : enableDashboardNav,

        //pour le CT
        setBookInActivity : setBookInActivityHandler,

        //Pour les MsgBoxes 
        setIsParentMsgBox : setIsParentMsgBoxHandler,

        //Matiere selectionnee dans la liste des matieres
        setSelectedMatiereId : setSelectedMatiereHandler,

        //Prof selectionnee dans la liste des profs
        setSelectedProfId : setSelectedProfeHandler,

        //booleen pour signaler des modifications dans le l'emplo de temps
        setETDataChanged: ETDataChangeHandler,

        //ID du menu actuel sur lequel on est et de son precedent
        setCurrentSelectedMenuID :currentSelectedMenuIDHandler,
        setPreviousSelectedMenuID : previousSelectedMenuIDHandler,

        //pour Dashboard
        setPrgramCoverSelectedLevel:setPrgramCoverSelectedLevelHandler,

        //Emploi de temps Matiere et prof principal
        setIsMatiereEnable:ETMatiereEnableHandler,

        //Emploi de temps Gestion des profs principaux
        setCurrentPPList:currentPPlistHandler,

        //gestion du loading lors chargement des formulaires
        setFormIsloading:formIsloadingHandler

    };

    return (
        <UiContext.Provider value ={UI_Ctx}>
            {props.children}
        </UiContext.Provider>
    );

}

export default UiContext;