

var CURRENT_MATIERE_LIST;

var CURRENT_PROFS_LIST

var CURRENT_DROPPED_MATIERE_LIST;

var CURRENT_DROPPED_PROFS_LIST;

var CLASSE_ID;

var SELECTED_MATIERE_ID;

var SELECTED_MATIERE_TAB;

var COUNT_SELECTED_MATIERES;

var SELECTED_PROF_ID;

var SELECTED_PROF_TAB;

var COUNT_SELECTED_PROFS;


var LESSON ={
    lessonId:'',
    date:'',
    libelleLesson :'',
    libelleChapitre:'',
    resume :'',
    previousId:'',
}



var CHAPITRE ={
    chapitreId:'',
    libelleChapitre:'',
    tabLesson :{}
}

var MODULE ={
    moduleId:'',
    libelleModule:'',
    tabChapitre:{}
}

var TAB_MODULES;
var TAB_CHAPITRE;
var TAB_LESSON;
var LISTE_LECONS;
var TO_LEFT_SHEETS;
var TO_RIGHT_SHEETS;






/*function initTAB_MATIERES(){
    
    for(var i=1; i<=MATIERE_MAXSIZE; i++){
        MATIERE_DATA={}
        MATIERE_DATA.idMatiere='matiere_'+i
        MATIERE_DATA.libelleMatiere =''
        MATIERE_DATA.idJour = '';
        MATIERE_DATA.heureDeb='';
        MATIERE_DATA.heureFin='';
        MATIERE_DATA.tabProfsID=[];
        TAB_MATIERES[i] = MATIERE_DATA;
    }
}*/


