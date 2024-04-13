export function createDroppedMatieresTabFromBD(emploisDetemps){
   
    var i, j, jour, periode, codeMatiere, id_tranche, id_classe;
    
    var idMatiereToDrop   = "";
    var droppedMatiereTab = [];
    var droppedMatiere    = {};

    //On obtient les entree qui ne sont pas destinees a etre supprimees.
    emploisDetemps = emploisDetemps.filter((em)=>!em.modify.includes("s"));
   
    emploisDetemps.map((emptps)=>{
        //On recupere les infos generales de l'entree
        jour            = emptps.id_jour;
        periode         = emptps.libelle;
        id_tranche      = emptps.id_tranche;
        codeMatiere     = emptps.id_matiere;
        id_classe       = emptps.id_classe;      
        idMatiereOnGrid = 'DM_'+jour +'_' +  periode;

        //On cree la matiere to drop
        droppedMatiere = {};
        droppedMatiere.idMatiereOnGrid   = idMatiereOnGrid;
        droppedMatiere.idJour            = jour;
        droppedMatiere.isSelected        = false;
        droppedMatiere.isBD              = true;
        droppedMatiere.idClasse          = id_classe;
        droppedMatiere.heureDeb          = periode.split('_')[0];
        droppedMatiere.heureFin          = periode.split('_')[1];
        droppedMatiere.tabProfsID        = [];

        //On lui ajoute les profs s'ils existes.
        if(emptps.value!="" && emptps.value.split('*').length>2 && emptps.value.split('*')[2].length>2) {           
            var countProf =  emptps.id_enseignants.length;
            j = 0;
            while(j<countProf){                
                var droppedProfId = 'DP_prof_'+ emptps.id_enseignants[j]+"_"+emptps.id_jour+"_"+emptps.libelle;
                droppedMatiere.tabProfsID.push(droppedProfId);
            }
        }
        
        droppedMatiereTab.push(droppedMatiere);
    });

    return droppedMatiereTab;
}


export function dropMatiere(idMatiere, idClasse, dropZone, CLASS_MATIERES_TAB, DM_TAB, ET_TAB){
    var jour, PeriodDeb, PeriodFin;
    var idMatiereOnGrid;

    jour      = dropZone[0];
    PeriodDeb = dropZone[1];
    PeriodFin = dropZone[2];

    // On obtient l'ID de la Matiere sur la grille.
    idMatiereOnGrid = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;

    // On teste si la zone de drop n'est pas ocp.
    if(DM_TAB.find((droppedMat)=>droppedMat.idMatiereOnGrid == idMatiereOnGrid && droppedMat.idClasse == idClasse )==undefined){

        //On cherche les infos de la matiere la ds la liste(id,libelle,couleur...) 
        var matiereInfos = CLASS_MATIERES_TAB.find((matiere)=>matiere.idMatiere == idMatiere);
        var matiereToDrop              = {...matiereInfos};
        matiereToDrop.idMatiereOnGrid  = idMatiereOnGrid;
        matiereToDrop.idJour           = jour;
        matiereToDrop.isSelected       = true;
        matiereToDrop.isBD             = false;
        matiereToDrop.heureDeb         = PeriodDeb;
        matiereToDrop.heureFin         = PeriodFin;
        matiereToDrop.idClasse         = parseInt(idClasse);
        matiereToDrop.tabProfsID       = []; 

        //On met a jour la liste des dropped matieres
        DM_TAB.push(matiereToDrop);

        //On recupere l'id de la matiere en BD
        var id_matiere     = parseInt(idMatiere.split("matiere_")[1]);

        //On cree une entree dans l'ET.
        let emp = {
            libelle       : PeriodDeb+"_"+PeriodFin,
            id_jour       : jour,
            id_tranche    : 0,
            id_classe     : idClasse,
            id_matiere    : id_matiere,
            id_enseignants: [],
            value         : jour+":"+PeriodDeb+"_"+PeriodFin+"*0",
            modify        : "c"
        }

        ET_TAB.push(emp);

        return matiereToDrop;
    }

}

export function dropProf(idProf, idClasse, dropZone, PROFS_TAB, DM_TAB, ET_TAB){
    var jour, PeriodDeb, PeriodFin;
    var idMatiereOnGrid;

    jour      = dropZone[1];
    PeriodDeb = dropZone[2];
    PeriodFin = dropZone[3];                

    //On recree les id de l zone de drop de la matiere ds la grille et la zone de drop du prof ds la grille
    var idMatiereOnGrid = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
    var idProfOnTheGrid = 'DP_'+ id +'_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;

    //On obtient la matiere qui va contenir le prof a drop avec toutes ses infos.
    DM_TAB.find((dpMat)=>(dpMat.idMatiere == idMatiereOnGrid ))


}