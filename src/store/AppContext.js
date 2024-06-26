import React from 'react';
import { createContext, useState } from 'react';
import FeaturesCode from '../components/Features/FeaturesCode';

const AppContext = createContext({
    usrLogin         :'',
    usrIsLogged      : false,
    isDataLoaded     : false,
    userProfile      : '',
    enableProfiles   : {},
    idUser           : {},
    idEtabInit       : {},
    activatedYear    : {},
    currentYear      : {},
    currentEtab      : {},
    currentCycle     : {},
    infoAnnees       : {},
    infoSetabs       : {},
    infoUser         : {},
    infoCycles       : {},
    infoNiveaux      : {},
    infoClasses      : {},
    infoMatieres     : {},
    infoCours        : {},
   
    /*---------- Gestion des lecons -----------*/
    etatLesson       : 0,
    currentLesson    : {},

    /*---------- Gestion des messages -----------*/
    tabNotifs        : {},

    /*---------- Infos Etablissement en cours -----------*/
    currentEtabInfos : {},
    



    setUsrLogin        : (givenLogin, givenProfile) => {},
    setUsrConnected    : ()=> {},
    logOut             :() => {},
    setIsDataLoaded    :(boolValue) => {},
    setUserProfile     :(userProfile) => {},
    setEnableProfiles  :(profilecodeMap) => {},
    setCurrentEtab     :(givenEtab) => {},
    setCurrentCycle    :(givenCycle) => {},
    setCurrentYear     :(givenYear) => {},
    setIdUser          :(givenIdUser) => {},
    setIdEtabInit      :(givenIdEtab) => {},
    setActivatedYear   :(givenYear) => {},
    setInfoAnnees      :(givenAnnee) => {},
    setInfoSetabs      :(infoSetab) => {},
    setInfoUser        :(infoUser) => {},
    setInfoCycles      :(infoCycle) => {},
    setInfoNiveaux     :(infoNiveau) => {},
    setInfoClasses     :(infoClasse) => {},
    setInfoMatieres    :(infoMatiere) => {},
    setInfoCours       :(infoCours) => {},

    /*---------- Gestion des lecons -----------*/
    setEtatLesson      :(etat) => {},
    setCurrentLesson   :(lecon)=>{},

    /*---------- Gestion des messages -----------*/
    setTabNotifs       :(listNotifs) => {},

    /*---------- Infos Etablissement en cours -----------*/
    setCurrentEtabInfos:(etabInfos) => {},
    
});

export function AppContextProvider(props)
{    
    const [isUsrLogged, setConnected]= useState(false);
    const [usrLogin, setUserLogin]= useState('');
    const [isDataLoaded,setIsDataLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState('');
    // const [enableProfiles, setEnableProfiles] = useState(FeaturesCode);
    const [enableProfiles, setEnableProfiles] = useState([]);
    const [idUser, setIdUser] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);
    const [currentEtab, setCurrentEtab] = useState(0);
    const [currentCycle, setCurrentCycle] = useState(0);
    const [idEtabInit, setIdEtabInit] = useState(0);
    const [activatedYear, setActivatedYear] = useState();
    const [infoAnnees, setInfoAnnees] = useState();
    const [infoSetabs, setInfoSetabs] = useState([]);
    const [infoUser, setInfoUser] = useState([]);
    const [infoCycles, setInfoCycles] = useState([]);
    const [infoNiveaux, setInfoNiveaux] = useState([]);
    const [infoClasses, setInfoClasses] = useState([]);
    const [infoMatieres, setInfoMatieres] = useState([]);
    const [infoCours, setInfoCours] = useState([]);

    /*---------- Gestion des lecons -----------*/
    const [etatLesson, setEtatLesson] = useState(0);
    const [currentLesson, setCurrentLesson] = useState({});

    /*---------- Gestion des messages -----------*/
    const [tabNotifs, setTabNotifs] = useState([]);

    /*---------- Infos Etablissement en cours -----------*/
    const [currentEtabInfos, setCurrentEtabInfos] = useState({});
   
    
  
    
    function connectHandler(givenLogin, givenProfile){
        setConnected(true);
        setUserLogin(givenLogin);
        setUserProfile(givenProfile); 
    }

    function connectedUserHandler(givenLogin){
        setUserLogin(givenLogin);  
    }

    function logOutHandler() {
        setConnected(false);
        setUserLogin('');
        setUserProfile('');
    }

    function setIsDataLoadedHandler(boolValue) {
        setIsDataLoaded(boolValue)
    }

    function setUserProfileHandler(userProfile) {
        setUserProfile(userProfile)
    }

    function setEnableProfilesHandler(profilecodeMap) {
        setEnableProfiles(profilecodeMap)
    }
    function setIdUserHandler(givenIdUser) {
        setIdUser(givenIdUser)
    }
    function setCurrentYearHandler(givenYear) {
        setCurrentYear(givenYear)
    }
    function setCurrentEtabHandler(givenEtab) {
        setCurrentEtab(givenEtab)
    }
    function setCurrentCycleHandler(givenCycle) {
        setCurrentCycle(givenCycle)
    }
    function setIdEtabInitHandler(givenIdEtab) {
        setIdEtabInit(givenIdEtab)
    }
    function setActivatedYearHandler(givenActivatedYear) {
        setActivatedYear(givenActivatedYear)
    }
    function setInfoAnneesHandler(givenAnnee) {
        setInfoAnnees(givenAnnee)
    }
    function setInfoSetabsHandler(infoSetab) {
        setInfoSetabs(infoSetab)
    }
    function setInfoUserHandler(infoUser) {
        setInfoUser(infoUser)
    }
    function setInfoCyclesHandler(infoCycle) {
        setInfoCycles(infoCycle)
    }
    function setInfoNiveauxHandler(infoNiveau) {
        setInfoNiveaux(infoNiveau)
    }
    function setInfoClassesHandler(infoClasse) {
        setInfoClasses(infoClasse)
    }
    function setInfoMatieresHandler(infoMatiere) {
        setInfoMatieres(infoMatiere)
    }
    
    function setInfoCoursHandler(infoCours) {
        setInfoCours(infoCours)
    }


    /*---------- Gestion des lecons -----------*/
    function setEtatLessonHandler(tabEtat){
        setEtatLesson(tabEtat)
    }

    function setCurrentLessonHandler(lecon){
        setCurrentLesson(lecon)
    }

    /*---------- Gestion des messages -----------*/
    function setTabNotifsHandler(notifList){
        setTabNotifs(notifList);
    }

    /*---------- Infos Etablissement en cours -----------*/
    function setCurrentEtabInfosHandler(etabInfos){
        setCurrentEtabInfos(etabInfos);
    }
    

   

    
    const APP_Ctx = {
        usrLogin            : usrLogin,
        usrIsLogged         : isUsrLogged,
        isDataLoaded        : isDataLoaded,
        userProfile         : userProfile,
        enableProfiles      : enableProfiles,
        idUser              : idUser,
        currentYear         : currentYear,
        currentCycle        : currentCycle,
        currentEtab         : currentEtab,
        idEtabInit          : idEtabInit,
        activatedYear       : activatedYear,
        infoAnnees          : infoAnnees,
        infoSetabs          : infoSetabs,
        infoUser            : infoUser,
        infoCycles          : infoCycles,
        infoNiveaux         : infoNiveaux,
        infoClasses         : infoClasses,
        infoMatieres        : infoMatieres,
        infoCours           : infoCours,        
        /*---------- Gestion des Lesons -----------*/
        etatLesson          : etatLesson,
        currentLesson       : currentLesson,
  
        /*---------- Gestion des messages -----------*/
        tabNotifs           : tabNotifs,

        /*---------- Infos Etablissement en cours -----------*/
        currentEtabInfos    : currentEtabInfos,
       
        setUsrConnected     : connectHandler,
        setUsrLogin         : connectedUserHandler,
        logOut              : logOutHandler,
        setIsDataLoaded     : setIsDataLoadedHandler,
        setUserProfile      : setUserProfileHandler,
        setEnableProfiles   : setEnableProfilesHandler,
        setIdUser           : setIdUserHandler,
        setCurrentEtab      : setCurrentEtabHandler,
        setCurrentCycle     : setCurrentCycleHandler,
        setCurrentYear      : setCurrentYearHandler,
        setIdEtabInit       : setIdEtabInitHandler,
        setActivatedYear    : setActivatedYearHandler,
        setInfoAnnees       : setInfoAnneesHandler,
        setInfoSetabs       : setInfoSetabsHandler,
        setInfoUser         : setInfoUserHandler,
        setInfoCycles       : setInfoCyclesHandler,
        setInfoNiveaux      : setInfoNiveauxHandler,
        setInfoClasses      : setInfoClassesHandler,
        setInfoMatieres     : setInfoMatieresHandler,
        setInfoCours        : setInfoCoursHandler,

        /*---------- Gestion des lecons -----------*/
        setEtatLesson       : setEtatLessonHandler,
        setCurrentLesson    : setCurrentLessonHandler,  
        
        /*---------- Gestion des messages -----------*/
        setTabNotifs        : setTabNotifsHandler,    
        
        /*---------- Infos Etablissement en cours -----------*/
        setCurrentEtabInfos : setCurrentEtabInfosHandler, 
    };


    return (
        <AppContext.Provider value ={APP_Ctx}>
            {props.children}
        </AppContext.Provider>
    );

}

export default AppContext;