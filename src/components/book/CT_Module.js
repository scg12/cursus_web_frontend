

export let LESSON ={
    id:'',
    date_debut:'',
    lessonId:'',
    date:'',
    libelleLesson :'',
    libelleChapitre:'',
    resume :'',
    previousId:'',
    tabDevoirs:[],
    tabResumes:[],
    etat:0 //0->Non debute, 1-> En cours, 2-> terminee
}

export let CHAPITRE ={
    chapitreId:'',
    libelleChapitre:'',
    tabLesson :{}
}

export let MODULE ={
    moduleId:'',
    libelleModule:'',
    tabChapitre:{}
}

export let NOTES_LECON;
export let INITIAL_STATE =0;
export let CURRENT_SELECTED_COURS_ID;
export let TAB_MODULES;
export let TAB_CHAPITRE;
export let TAB_LESSON;
export let LISTE_LECONS;
export let TO_LEFT_SHEETS;
export let TO_RIGHT_SHEETS;
export let CURRENT_FICHE_PROGRESSION;
export let TAB_ETATLESSONS;

//--- Book
var modulesStringMap ={};
modulesStringMap["module0"] =  "Premier Module";
modulesStringMap["module1"] =  "Second Module";
modulesStringMap["module2"] =  "Troisieme Module";

var modulesString = [
    "chap1_NomChap1#lesson1_NomLesson1*lesson2_NomLesson2*lesson3_NomLesson3#chap2_NomChap2#lesson4_NomLesson4*lesson5_nomlesson5",
    "chap3_NomChap3#lesson6_NomLesson6*lesson7_nomLesson7#chap4_nomChap4#lesson8_nomLesson8*lesson9_nomLesson9",
    "chap5_NomChap5#lesson10_NomLesson10*lesson11_NomLesson11*lesson12_NomLesson12#chap6_NomChap6#lesson13_NomLesson13*lesson14_nomlesson14",
];

export function updateInitialState(value){
    INITIAL_STATE = value;
}

export function createCTStructure(coursId,cahierDeTexte){

    let current_mod = "", current_chap = "";
    let chaps = "", cpt_module = 0;
    let size = cahierDeTexte.length;
    let addLecon = true,addChap = true;
    let lessons = "";
    let passe = false;
    modulesStringMap = [];
    modulesString =[];
    // k permet de compter les chapitres
    let k = 0;
    console.log("SIZE: ",size);
    if(size>0){
        modulesStringMap['module'+cpt_module] = cahierDeTexte[0].module;
        current_mod = cahierDeTexte[0].module;
        current_chap = cahierDeTexte[0].chapitre;
    }
    for(let i=0;i<size;i++){
        // console.log(i+" "+cahierDeTexte[i].lecon)
        if(addLecon){
            lessons = 'lesson'+(i+1)+'_'+cahierDeTexte[i].lecon+'_'+cahierDeTexte[i].status+'_'+cahierDeTexte[i].id+'_'+cahierDeTexte[i].resumes+'_'+cahierDeTexte[i].devoirs+'_'+cahierDeTexte[i].date_debut;
            addLecon = false;
        }
        else
            lessons = lessons +'*'+ 'lesson'+(i+1)+'_'+cahierDeTexte[i].lecon+'_'+cahierDeTexte[i].status+'_'+cahierDeTexte[i].id+'_'+cahierDeTexte[i].resumes+'_'+cahierDeTexte[i].devoirs+'_'+cahierDeTexte[i].date_debut;
        
        if(i+1<size){
            if(current_chap !== cahierDeTexte[i+1].chapitre)
             {    if(addChap){
                    chaps = 'chap'+(k+1)+'_'+cahierDeTexte[i].chapitre+'#'+lessons;
                    addChap = false;
                    }
                    else
                        chaps =  chaps+'#' +'chap'+(k+1)+'_'+cahierDeTexte[i].chapitre+'#'+lessons;
                    k++;
                    current_chap = cahierDeTexte[i+1].chapitre;
                    addLecon = true;
             }
        // console.log(i+" chap "+cahierDeTexte[i].chapitre)
        }
        // ici i== size - 1
        else {
            console.log("i==",i);
            if(addChap){
                chaps = 'chap'+(k+1)+'_'+cahierDeTexte[i].chapitre+'#'+lessons;
                addChap = false;
            }
            else
                chaps =  chaps+'#' +'chap'+(k+1)+'_'+cahierDeTexte[i].chapitre+'#'+lessons;
            k++;
        }
        if(i+1<size){
            if(current_mod !== cahierDeTexte[i+1].module)
                { modulesString[cpt_module]= chaps;
                current_mod = cahierDeTexte[i+1].module;
                cpt_module++;
                modulesStringMap['module'+cpt_module] = current_mod;
                chaps = '';
                lessons = '';
                addLecon = true;
                addChap = true;
                if(i==size-1) passe = true;
                else passe = false;}
        }
        // ici i== size - 1
        else{
            if(current_mod !== cahierDeTexte[i].module){
                modulesString[cpt_module]= chaps;
                current_mod = cahierDeTexte[i].module;
                cpt_module++;
                modulesStringMap['module'+cpt_module] = current_mod;
                passe = true;
            }
            else passe = false;
        }
        if(i==size-1 && !passe){
            console.log("la fin")
            modulesString[cpt_module]= chaps;
        }
    }

    createModule();

    console.log('donnees',modulesString);
    
    CURRENT_SELECTED_COURS_ID = coursId;
}
  

const devoirs=[
    {
        libelle :'Exercices : 12,13,14 Pages 127 et 128',
        date:'05/07/2022' 
    },

    {
        libelle :'Exercices : 20,22,23 Pages 200',
        date:'07/08/2022' 
    }

]

const resumes=[
    {
        libelle :'Introduction de la lecon',
        date:'05/07/2022' 
    },

]

export const initToLeftSheets=()=>{
    TO_LEFT_SHEETS =[]
}

export const initToRightSheets=()=>{
    TO_RIGHT_SHEETS =[]
}

export const addSheetOnRight=(sheetId)=>{
    TO_RIGHT_SHEETS.push(sheetId);
}

export const createModule=()=>{
    var modulesTab, chapTab, lessonTab,lesson,j;
    var previousLesson ='0';
    //var tab_Module = [];
    
   
    TAB_MODULES = [];
    TAB_CHAPITRE={};
    TAB_LESSON ={};
    LISTE_LECONS= [];
    TAB_ETATLESSONS=[];

    for(var i=0; i < modulesString.length; i++){
      MODULE ={}
      MODULE.moduleId = 'module'+i;
      MODULE.libelleModule = modulesStringMap[MODULE.moduleId];
      MODULE.tabChapitre = [];
      TAB_MODULES[i] = {...MODULE};
      TAB_CHAPITRE['module'+i] =[];
    }
    console.log("modulesString:",modulesString);
    for(var i=0; i < modulesString.length; i++){
      modulesTab = modulesString[i].split('#');
      
      j = 0;
      while(j < modulesTab.length-1) {
        chapTab = modulesTab[j].split('_');
        CHAPITRE={}
        CHAPITRE.chapitreId = chapTab[0];
        CHAPITRE.libelleChapitre = chapTab[1];
        TAB_CHAPITRE['module'+i].push(CHAPITRE);

        CHAPITRE.tabLesson = [];
        TAB_LESSON[CHAPITRE.chapitreId] = [];

        lessonTab = modulesTab[j+1].split('*');
        
        for(var k = 0; k <lessonTab.length; k++){
          lesson = lessonTab[k].split('_');
          LESSON={};
          LESSON.date_debut = lesson[6];
          LESSON.id = lesson[3];
          LESSON.previousId = previousLesson;
          LESSON.lessonId = lesson[0];
          LESSON.libelleLesson = lesson[1];
          LESSON.etat = lesson[2];
          LESSON.libelleChapitre = CHAPITRE.libelleChapitre;
          LESSON.tabDevoirs = lesson[5].split("²²");
          LESSON.tabResumes = lesson[4].split("²²");
          LESSON.resume = '';

          TAB_ETATLESSONS[k] =  LESSON.etat;
         
          TAB_LESSON[CHAPITRE.chapitreId].push(LESSON);
          CHAPITRE.tabLesson.push(LESSON); 
          LISTE_LECONS.push(LESSON);
          previousLesson = LESSON.lessonId;
        }
        console.log("LESSON :",LISTE_LECONS)
    
        TAB_MODULES[i].tabChapitre.push(CHAPITRE);        
        j= j+2;            
      }
    }
    console.log('lecon', TAB_LESSON);
  }


//--- Sheet
export const getNextHandler=(currentSheetId)=>{
    var currentSheet = document.getElementById(currentSheetId);
    var nextSheetId, nextSheet, sheetIndex;
    
    var sheetNumber = eval(currentSheetId.substr(6))+1;
    nextSheetId = 'lesson'+sheetNumber;

    nextSheet= document.getElementById(nextSheetId);

    currentSheet.style.zIndex='1999';

    sheetIndex = TO_RIGHT_SHEETS.findIndex((sheetId) => sheetId==currentSheetId)
    TO_RIGHT_SHEETS.splice(sheetIndex,1);

    if(currentSheet.classList.contains('moveToRight2')){
        currentSheet.classList.replace('moveToRight2','moveToLeft2');
    } else{
        currentSheet.classList.add('moveToLeft2');
    }

    TO_LEFT_SHEETS.push(currentSheetId);
    currentSheet.style.marginLeft ='-45.7vw';
    nextSheet.style.zIndex='1998';
}

export const getPreviousHandler=(currentSheetId, contenu)=>{
    
    var previousSheetId = (document.getElementById(contenu.lessonId +"_previousSheet").value == '0') ? 'preface': document.getElementById(contenu.lessonId +"_previousSheet").value;
    var previousSheet = document.getElementById(previousSheetId);
    var currentSheet = document.getElementById(currentSheetId);
    var sheetIndex;
    
    if(currentSheet.classList.contains('moveToRight2')){
        currentSheet.classList.remove('moveToRight2');
    }
   
    sheetIndex = TO_LEFT_SHEETS.findIndex((sheetId) => sheetId==previousSheetId)
    if(sheetIndex>0) {
        TO_LEFT_SHEETS.splice(sheetIndex,1);
        TO_RIGHT_SHEETS.push(previousSheetId);
    
        if(previousSheetId!='preface'){
            previousSheet.style.zIndex='1998';
        }else{
            previousSheet.style.zIndex='1999'; 
        }
        previousSheet.classList.replace('moveToLeft2','moveToRight2');
        previousSheet.style.marginLeft ='15vw';
        
        currentSheet.style.zIndex='1997'    
    } else{
       
        previousSheet.style.marginLeft ='-45.7vw';
       
        sheetIndex = TO_RIGHT_SHEETS.findIndex((sheetId) => sheetId==previousSheetId)
        if(sheetIndex>0) {
            TO_RIGHT_SHEETS.splice(sheetIndex,1);
            TO_LEFT_SHEETS.push(previousSheetId);
        }
        if(previousSheet.classList.contains('moveToRight2')){
            alert('pepe')
            previousSheet.classList.remove('moveToRight2');
        }
        
        
        if(previousSheetId!='preface'){
            previousSheet.style.zIndex='1998';
        }else{
            previousSheet.style.zIndex='1999'; 
        }
       
        currentSheet.style.zIndex='1997' 
        previousSheet.classList.add('moveToRight2');
        previousSheet.style.marginLeft ='15vw'; 
        
        sheetIndex = TO_LEFT_SHEETS.findIndex((sheetId) => sheetId==previousSheetId)
        if(sheetIndex>0) {
            TO_LEFT_SHEETS.splice(sheetIndex,1);
            TO_RIGHT_SHEETS.push(previousSheetId);
        }     
    }      
   
}

export const gotoPreface=()=>{
    //var couverture = document.getElementById("coverture");
    var preface =  document.getElementById("preface");
    var sheet;
       
    TO_LEFT_SHEETS=[];
    TO_RIGHT_SHEETS = [];

    
   // preface.classList.add('moveToRight1');
   if(preface.classList.contains('moveToLeft2')){
        preface.classList.replace('moveToLeft2','moveToRight2');
        preface.style.marginLeft ='15vw';
        TO_RIGHT_SHEETS.push('preface');

        for(var i=0; i<LISTE_LECONS.length; i++){
            sheet = document.getElementById(LISTE_LECONS[i].lessonId);
            if(sheet!=null){
                TO_RIGHT_SHEETS.push(LISTE_LECONS[i].lessonId);
                if(sheet.classList.contains('moveToLeft2')) sheet.classList.remove('moveToLeft2');
                if(sheet.classList.contains('moveToRight2')) sheet.classList.remove('moveToRight2');
                sheet.style.zIndex='1997';
                sheet.style.marginLeft='15vw';
            }               
        }
    } 

}



//--- Table Of Content
export const gotoLesson=(lessonId, prefaceId)=> {
    var sheetToDisplay = document.getElementById(lessonId);
    var preface = document.getElementById(prefaceId);
    var sheetIndex, sheet;


    if(TO_RIGHT_SHEETS.length ==1){
        for(var i=0; i<LISTE_LECONS.length; i++){
            sheet = document.getElementById(LISTE_LECONS[i].lessonId);
            if(sheet!=null){
                TO_RIGHT_SHEETS.push(LISTE_LECONS[i].lessonId);
                sheet.style.marginLeft='15vw';
            }               
        }  
    }
    
    preface.style.zIndex='1999';

    sheetIndex = TO_RIGHT_SHEETS.findIndex((sheetId) => sheetId==prefaceId)
    if (sheetIndex >= 0){
        TO_RIGHT_SHEETS.splice(sheetIndex,1);
    }
    if(preface.classList.contains('moveToRight2')){
        preface.classList.replace('moveToRight2','moveToLeft2');
    } 
    if(preface.classList.contains('moveToRight1')){
        preface.classList.replace('moveToRight1','moveToLeft2');
    }       
          
    TO_LEFT_SHEETS.push(prefaceId);
    preface.style.marginLeft ='-45.7vw'; 
    sheetToDisplay.style.zIndex='1998'; 
           
}
