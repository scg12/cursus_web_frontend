
export const convertDateToUsualDate=(date)=>{
    if (isNaN(Date.parse(date))) return date;

    var newDate = date.split("-");
    if (newDate.length ==3){
        if(newDate[0].length == 4) return newDate.reverse().join("/");
        else return newDate.join("/")

    } else{
        newDate = date.split("/");
        if (newDate.length ==3){
            if(newDate[0].length == 4) return newDate.reverse().join("/");
            else return newDate.join("/")
        }
        return date;
    }

}

export function changeDateIntoMMJJAAAA(date){
    var dateTab = date.split('/');
    return dateTab[1]+'/'+dateTab[0]+'/'+dateTab[2];
}



export function getTodayDate(){
    var jour  = new Date().getDate();
    var mois  = new Date().getMonth()+1;
    var annee = new Date().getFullYear();
    
    if(jour <= 9) jour = '0'+jour;
    if(mois <= 9) mois = '0'+mois;

   return jour+'/'+ mois +'/'+ annee;
}


function getNomProf(matiereLabel, listMatieres){
    var MatieresClasse = listMatieres; 
    var lisMatieresProfs = MatieresClasse.split("&");
    var matiereProf = lisMatieresProfs.find((elt)=>elt.split("_")[0]==matiereLabel);
    if(matiereProf!=undefined) return matiereProf.split("_")[1];
    else return "";
}

function twoDigits(val){
    if(val.length<=1) return '0'+val;
    else return val;
}

export function createBulletinToPrintData(typeBulletin, elevesData, groupeRecapData, notesData, listMatieresWithTeacherNames,areElevesClasse){
    
    //return new Promise(function(resolve, reject){
        var ElevesInfo  = [];
        var NotesData   = [];
        var GroupesData = [];
        var resultatElev = []; 
        var eleves_data  = [];  
        var eleve_data   = {};

        var GroupesCount;

        var currentElvData, eleveInfos;
        var elvDataSize  = 0, tail    = 0;
        var currentRang  = 0, cptExco = 1;

        elevesData.map((elv)=>{
            resultatElev  = elv.resultat.split("~~~");
            elvDataSize = resultatElev.length;
            resultatElev  = resultatElev.splice(1,elvDataSize-1);
            resultatElev.push(elv.absences+"&"+elv.sanctions);
            ElevesInfo.push(resultatElev)
        });

        console.log("eleves transform", ElevesInfo, elevesData);

        NotesData    = notesData[0].resultat.split("~~");
        tail         = NotesData.length;
        NotesData    = NotesData.splice(1, tail-1);

        GroupesData  = groupeRecapData[0].resultat.split("~~");
        tail         = GroupesData.length;
        GroupesData  = GroupesData.splice(1, tail-1);

        GroupesCount = GroupesData.length;

        switch(typeBulletin){
            case 1:{
                for(var elv=0; elv<ElevesInfo.length; elv++){
                    var currentElvData = ElevesInfo[elv]; 
                    var ligne=0;
                    
                    eleve_data={};
                    console.log("ligne courante", currentElvData[ligne]);
                    //construction de l'entete de l'eleve
                    eleve_data.entete = {};
                    eleve_data.entete.nom       = currentElvData[ligne].split("²²")[0];
                    eleve_data.entete.prenom    = currentElvData[ligne].split("²²")[1];
                    eleve_data.entete.matricule = currentElvData[ligne].split("²²")[2];
                    eleve_data.entete.sexe      = currentElvData[ligne].split("²²")[3];
                    eleve_data.entete.redouble  = currentElvData[ligne].split("²²")[4];
                    eleve_data.entete.dateNaiss = currentElvData[ligne].split("²²")[5];
                    eleve_data.entete.lieuNaiss = currentElvData[ligne].split("²²")[6];

                    //construction des notes de l'eleve par groupes
                    eleve_data.groupesInfos = []; 
                    var indNote = 0; ligne++;
                    for(var grp=0; grp<=GroupesCount-1; grp++){
                        var grpInfo = {}; 
                        var tabEleveInfos = []; 
                    
                        var notes = currentElvData[ligne].split("~~");
                        for(var nt=0; nt<=notes.length-2; nt++){
                            eleveInfos = {};
                            eleveInfos.libelleMatiere = NotesData[indNote].split("²²")[4];
                            eleveInfos.coefMatiere    = NotesData[indNote].split("²²")[0];
                            eleveInfos.nomProf        = getNomProf(eleveInfos.libelleMatiere, listMatieresWithTeacherNames);
                            eleveInfos.compVisee      = "competence visee";
                            eleveInfos.moyenne        = notes[nt].split("²²")[0];
                            eleveInfos.nxc            = notes[nt].split("²²")[1];
                            eleveInfos.appreciation   = notes[nt].split("²²")[2];
                            eleveInfos.rang           = notes[nt].split("²²")[3];
                            eleveInfos.borneInf       = NotesData[indNote].split("²²")[1];
                            eleveInfos.borneSup       = NotesData[indNote].split("²²")[2];

                            tabEleveInfos.push(eleveInfos)
                            indNote++;
                        }

                        var eleveGroupRecap = {};
                        eleveGroupRecap.moyGroup        = notes[notes.length-1].split("²²")[4];
                        eleveGroupRecap.apprecGroupe    = notes[notes.length-1].split("²²")[5];
                        eleveGroupRecap.coefTotalgroup  = notes[notes.length-1].split("²²")[0]; 
                        eleveGroupRecap.nxcTotal        = notes[notes.length-1].split("²²")[2];
                        eleveGroupRecap.rangGroupe      = notes[notes.length-1].split("²²")[3];
                        eleveGroupRecap.libelleGroup    = GroupesData[grp].split("²²")[3];
                        eleveGroupRecap.borneInf        = GroupesData[grp].split("²²")[0];
                        eleveGroupRecap.borneSup        = GroupesData[grp].split("²²")[1];

                        grpInfo.eleveInfos      = tabEleveInfos;
                        grpInfo.eleveGroupRecap = eleveGroupRecap;

                        eleve_data.groupesInfos.push(grpInfo);
                        ligne++;
                    }

                    //construction du recap general de l'eleve
                    eleve_data.recapGeneral = {};
                    eleve_data.recapGeneral.MoyGenerale = currentElvData[ligne].split("²²")[2];
                    eleve_data.recapGeneral.rangGeneral = areElevesClasse ? parseInt(currentElvData[ligne].split("²²")[5]): "N.C.";
                    eleve_data.recapGeneral.isExeco     = (eleve_data.recapGeneral.rangGeneral == currentRang);
                    
                    if(eleve_data.recapGeneral.isExeco) {
                        currentRang = eleve_data.recapGeneral.rangGeneral;
                        cptExco++;
                    } else {
                        currentRang += cptExco; 
                        cptExco=1;
                    }
                    
                    //Resultats scolaires
                    eleve_data.recapGeneral.totalPoints = currentElvData[ligne].split("²²")[3];
                    eleve_data.recapGeneral.totalcoef   = currentElvData[ligne].split("²²")[1];
                    eleve_data.recapGeneral.apprecGen   = currentElvData[ligne].split("²²")[6];
                    eleve_data.recapGeneral.admis       = currentElvData[ligne].split("²²")[4];

                    //Infos Discipline
                    var absencesEleve = currentElvData[ligne+1].split("&")[0];
                    var punitionEleve = currentElvData[ligne+1].split("&")[1];
                    eleve_data.recapGeneral.absTotal    = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[0]):"00";
                    eleve_data.recapGeneral.absJ        = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[1]):"00";
                    eleve_data.recapGeneral.absNJ       = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[2]):"00";
                    eleve_data.recapGeneral.sanction    = punitionEleve.length>0? punitionEleve.split("*"):"R.A.S";
             
                    eleves_data.push(eleve_data);
                }
                console.log("donne to print",eleves_data)
                return(eleves_data) ;
               // break;
            }

            case 2:{
                for(var elv=0; elv<ElevesInfo.length; elv++){
                    var currentElvData = ElevesInfo[elv]; 
                    var ligne=0;
                    eleve_data={};
                    
                    //construction de l'entete de l'eleve
                    eleve_data.entete = {};
                    eleve_data.entete.nom       = currentElvData[ligne].split("²²")[0];
                    eleve_data.entete.prenom    = currentElvData[ligne].split("²²")[1];
                    eleve_data.entete.matricule = currentElvData[ligne].split("²²")[2];
                    eleve_data.entete.sexe      = currentElvData[ligne].split("²²")[3];
                    eleve_data.entete.redouble  = currentElvData[ligne].split("²²")[4];
                    eleve_data.entete.dateNaiss = currentElvData[ligne].split("²²")[5];
                    eleve_data.entete.lieuNaiss = currentElvData[ligne].split("²²")[6];

                    //construction des notes de l'eleve par groupes
                    eleve_data.groupesInfos = []; 
                    var indNote = 0; ligne++;
                    for(var grp=0; grp<=GroupesCount-1; grp++){
                        var grpInfo = {}; 
                        var tabEleveInfos = []; 
                    
                        var notes = currentElvData[ligne].split("~~");
                        for(var nt=0; nt<=notes.length-2; nt++){
                            eleveInfos = {};
                            eleveInfos.libelleMatiere = NotesData[indNote].split("²²")[4];
                            //eleveInfos.coefMatiere    = NotesData[indNote].split("²²")[0];
                            eleveInfos.nomProf        = getNomProf(eleveInfos.libelleMatiere, listMatieresWithTeacherNames);
                            eleveInfos.compVisee      = "no need";
                            eleveInfos.moySeq1        = notes[nt].split("²²")[0].split("&")[0];
                            eleveInfos.moySeq2        = notes[nt].split("²²")[0].split("&")[1];
                            eleveInfos.moyenne        = notes[nt].split("²²")[1];
                            eleveInfos.nxc            = notes[nt].split("²²")[2];
                            eleveInfos.appreciation   = notes[nt].split("²²")[3];
                            eleveInfos.rang           = notes[nt].split("²²")[4];
                            //eleveInfos.borneInf       = NotesData[indNote].split("²²")[1];
                            //eleveInfos.borneSup       = NotesData[indNote].split("²²")[2];

                            tabEleveInfos.push(eleveInfos)
                            indNote++;
                        }

                        var eleveGroupRecap = {};
                        eleveGroupRecap.moyGroup        = notes[notes.length-1].split("²²")[4];
                        eleveGroupRecap.apprecGroupe    = notes[notes.length-1].split("²²")[5];
                        eleveGroupRecap.coefTotalgroup  = notes[notes.length-1].split("²²")[0]; 
                        eleveGroupRecap.nxcTotal        = notes[notes.length-1].split("²²")[5];
                        eleveGroupRecap.rangGroupe      = notes[notes.length-1].split("²²")[3];
                        eleveGroupRecap.libelleGroup    = GroupesData[grp].split("²²")[3];
                        eleveGroupRecap.borneInf        = GroupesData[grp].split("²²")[0];
                        eleveGroupRecap.borneSup        = GroupesData[grp].split("²²")[1]

                        grpInfo.eleveInfos      = tabEleveInfos;
                        grpInfo.eleveGroupRecap = eleveGroupRecap;
                        eleve_data.groupesInfos.push(grpInfo);
                        ligne++;
                    }

                    //construction du recap general de l'eleve
                    eleve_data.recapGeneral = {};
                    
                    
                    eleve_data.recapGeneral.moy_seq1     = currentElvData[ligne].split("²²")[2].split('&')[0];
                    eleve_data.recapGeneral.moy_seq2     = currentElvData[ligne].split("²²")[2].split('&')[1];
                    eleve_data.recapGeneral.MoyGenerale = currentElvData[ligne].split("²²")[2].split('&')[2];

                    eleve_data.recapGeneral.rangGeneral = areElevesClasse ? parseInt(currentElvData[ligne].split("²²")[5]) : "N.C.";
                    eleve_data.recapGeneral.isExeco     = (eleve_data.recapGeneral.rangGeneral == currentRang);
                    
                    if(eleve_data.recapGeneral.isExeco) {
                        currentRang = eleve_data.recapGeneral.rangGeneral;
                        cptExco++;
                    } else {
                        currentRang += cptExco; 
                        cptExco=1;
                    }

                    //Resultats scolaires
                    eleve_data.recapGeneral.totalPoints = currentElvData[ligne].split("²²")[3];
                    eleve_data.recapGeneral.totalcoef   = currentElvData[ligne].split("²²")[1];
                    eleve_data.recapGeneral.apprecGen   = currentElvData[ligne].split("²²")[6];
                    eleve_data.recapGeneral.admis       = currentElvData[ligne].split("²²")[4];

                    //Infos Discipline
                    var absencesEleve = currentElvData[ligne+1].split("&")[0];
                    var punitionEleve = currentElvData[ligne+1].split("&")[1];
                    eleve_data.recapGeneral.absTotal    = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[0]):"00";
                    eleve_data.recapGeneral.absJ        = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[1]):"00";
                    eleve_data.recapGeneral.absNJ       = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[2]):"00";
                    eleve_data.recapGeneral.sanction    = punitionEleve.length>0? punitionEleve.split("*"):"R.A.S";
                    
                    eleves_data.push(eleve_data);
                }
                console.log("donne to print",eleves_data)
                return(eleves_data);
               // break;
            }

            case 3:{
                for(var elv=0; elv<ElevesInfo.length; elv++){
                    var currentElvData = ElevesInfo[elv]; 
                    var ligne=0;
                    eleve_data={};
                    
                    //construction de l'entete de l'eleve
                    eleve_data.entete = {};
                    eleve_data.entete.nom       = currentElvData[ligne].split("²²")[0];
                    eleve_data.entete.prenom    = currentElvData[ligne].split("²²")[1];
                    eleve_data.entete.matricule = currentElvData[ligne].split("²²")[2];
                    eleve_data.entete.sexe      = currentElvData[ligne].split("²²")[3];
                    eleve_data.entete.redouble  = currentElvData[ligne].split("²²")[4];
                    eleve_data.entete.dateNaiss = currentElvData[ligne].split("²²")[5];
                    eleve_data.entete.lieuNaiss = currentElvData[ligne].split("²²")[6];

                    //construction des notes de l'eleve par groupes
                    eleve_data.groupesInfos = []; 
                    var indNote = 0; ligne++;
                    for(var grp=0; grp<=GroupesCount-1; grp++){
                        var grpInfo = {}; 
                        var tabEleveInfos = []; 
                    
                        var notes = currentElvData[ligne].split("~~");
                        for(var nt=0; nt<=notes.length-2; nt++){
                            eleveInfos = {};
                            eleveInfos.libelleMatiere = NotesData[indNote].split("²²")[4];
                            //eleveInfos.coefMatiere    = NotesData[indNote].split("²²")[0];
                            eleveInfos.nomProf        = getNomProf(eleveInfos.libelleMatiere, listMatieresWithTeacherNames);
                            eleveInfos.compVisee      = "no need";
                            eleveInfos.moyTrim1       = notes[nt].split("²²")[0].split("&")[0];
                            eleveInfos.moyTrim2       = notes[nt].split("²²")[0].split("&")[1];
                            eleveInfos.moyTrim3       = notes[nt].split("²²")[0].split("&")[2];
                            eleveInfos.moyenne        = notes[nt].split("²²")[1];
                            eleveInfos.nxc            = notes[nt].split("²²")[2];
                            eleveInfos.appreciation   = notes[nt].split("²²")[3];
                            eleveInfos.rang           = notes[nt].split("²²")[4];
                            //eleveInfos.borneInf       = NotesData[indNote].split("²²")[1];
                            //eleveInfos.borneSup       = NotesData[indNote].split("²²")[2];

                            tabEleveInfos.push(eleveInfos)
                            indNote++;
                        }

                        var eleveGroupRecap = {};
                        eleveGroupRecap.moyGroup        = notes[notes.length-1].split("²²")[4];
                        eleveGroupRecap.apprecGroupe    = notes[notes.length-1].split("²²")[5];
                        eleveGroupRecap.coefTotalgroup  = notes[notes.length-1].split("²²")[0]; 
                        eleveGroupRecap.nxcTotal        = notes[notes.length-1].split("²²")[5];
                        eleveGroupRecap.rangGroupe      = notes[notes.length-1].split("²²")[3];
                        eleveGroupRecap.libelleGroup    = GroupesData[grp].split("²²")[3];
                        eleveGroupRecap.borneInf        = GroupesData[grp].split("²²")[0];
                        eleveGroupRecap.borneSup        = GroupesData[grp].split("²²")[1]

                        grpInfo.eleveInfos      = tabEleveInfos;
                        grpInfo.eleveGroupRecap = eleveGroupRecap;
                        eleve_data.groupesInfos.push(grpInfo);
                        ligne++;
                    }

                    //construction du recap general de l'eleve
                    eleve_data.recapGeneral = {};
                   
                    eleve_data.recapGeneral.moy_trim1     = currentElvData[ligne].split("²²")[2].split('&')[0];
                    eleve_data.recapGeneral.moy_trim2     = currentElvData[ligne].split("²²")[2].split('&')[1];
                    eleve_data.recapGeneral.moy_trim3     = currentElvData[ligne].split("²²")[2].split('&')[2];
                    eleve_data.recapGeneral.MoyGenerale   = currentElvData[ligne].split("²²")[2].split('&')[3];

                    eleve_data.recapGeneral.rangGeneral = areElevesClasse ? parseInt(currentElvData[ligne].split("²²")[5]) : "N.C.";
                    eleve_data.recapGeneral.isExeco     = (eleve_data.recapGeneral.rangGeneral == currentRang);
                    
                    if(eleve_data.recapGeneral.isExeco) {
                        currentRang = eleve_data.recapGeneral.rangGeneral;
                        cptExco++;
                    } else {
                        currentRang += cptExco; 
                        cptExco=1;
                    }

                    //Resultats scolaires
                    eleve_data.recapGeneral.totalPoints = currentElvData[ligne].split("²²")[3];
                    eleve_data.recapGeneral.totalcoef   = currentElvData[ligne].split("²²")[1];
                    eleve_data.recapGeneral.apprecGen   = currentElvData[ligne].split("²²")[6];
                    eleve_data.recapGeneral.admis       = currentElvData[ligne].split("²²")[4];

                    //Infos Discipline
                    var absencesEleve = currentElvData[ligne+1].split("&")[0];
                    var punitionEleve = currentElvData[ligne+1].split("&")[1];
                    eleve_data.recapGeneral.absTotal    = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[0]):"00";
                    eleve_data.recapGeneral.absJ        = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[1]):"00";
                    eleve_data.recapGeneral.absNJ       = absencesEleve.length>0? twoDigits(absencesEleve.split("_")[2]):"00";
                    eleve_data.recapGeneral.sanction    = punitionEleve.length>0? punitionEleve.split("*"):"R.A.S";
                
                    eleves_data.push(eleve_data);
                }
                console.log("donne to print",eleves_data)
                return(eleves_data) ;
               // break;
            }
        }
           
}

function getEtMatiereWithMaxProf(ETTab){
    var nbrMaxProfs = 0; var curETMatiere;
    ETTab.map((etMat)=>{
        var countCurProf = etMat.id_enseignants.length;
        if(countCurProf>nbrMaxProfs)  {
            nbrMaxProfs  = countCurProf;
            curETMatiere =  etMat; 
        }
    })

    return curETMatiere
}

export function getMatieresWithTeachersNames(classeId, EmploisDeTempsClasse, ListMatieresClasse, ListProfsClasse){
    var cur_matiere_id, cur_matiere_label, cur_profs=[], cur_profLabel, profsMatiere = "";
    var listMatiereProf = "", matieresTraites=[];
   
    var ETClasse = EmploisDeTempsClasse.filter((etData)=>etData.id_classe == classeId);
    ETClasse.map((et,index1)=>{
        cur_matiere_id = et.id_matiere;
        cur_matiere_label = ListMatieresClasse.find((mat)=>mat.id == cur_matiere_id).libelle;

        if(matieresTraites.find((matId)=>matId==cur_matiere_id)==undefined){
            var tabMatieres   = ETClasse.filter((et)=>et.id_matiere == cur_matiere_id);
            var  curETMatiere = getEtMatiereWithMaxProf(tabMatieres);            
            cur_profs         = (curETMatiere!= undefined) ? curETMatiere.id_enseignants:[];

            cur_profs.map((profId, index2)=>{
                var curProf   = ListProfsClasse.find((prf)=>prf.id == profId);
                cur_profLabel = curProf.nom + ' '+ curProf.prenom;
                if(index2 >= cur_profs.length-1)
                   profsMatiere = profsMatiere + cur_profLabel;
                else 
                   profsMatiere = profsMatiere + cur_profLabel+",";
            })

            if(index1 >= ETClasse.length-1 )
               listMatiereProf = listMatiereProf+cur_matiere_label+"_"+profsMatiere;
            else 
               listMatiereProf = listMatiereProf+cur_matiere_label+"_"+profsMatiere+"&";           

            matieresTraites.push(cur_matiere_id); profsMatiere = "";
        }         
  
    })
    console.log("prof & Matieres:",listMatiereProf);
    return listMatiereProf;
}


