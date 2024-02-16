//----------------------------- Objet qui receuille les donnees de l'impression ----------------------------
var PRINTING_DATA ={
    dateText:'',
    leftHeaders:[],
    rightHeaders:[],
    pageImages:[],
    pageTitle:'',
    tableHeaderModel:{},
    tableData :[],
    numberEltPerPage:1    
};


//------------------- Fonction qui ajoute un suffixe au titre de la page (debut, suit, fin) ---------------
const getTitleSuffix=(index, rowsPerPage, tabCount)=>{
    if (index==0) return " (debut)";
    else{
        if(index + rowsPerPage < tabCount) return " (suite)" ;
        else return " (fin)";
    }
}

//------------------- Fonction de creation des pages a partir des donnees d'impression --------------------
export const createPrintingPages=(printingData)=>{
    var pagNumber = 1;
    var index = 0;
    var tabSize = printingData.tableData.length;
    var eltsPerPage = printingData.numberEltPerPage;

    
    var pageSet = [];

    var page = {
        dateText:'',
        leftHeaders:[],
        rightHeaders:[],
        centerHeaders:[],
        pageImages:[],
        pageTitle:'',
        tableHeaderModel:[],
        pageRows:[],
        pageNumber:0,
    };
        
    pageSet=[];
    
    for(var i = 0; i < printingData.tableData.length; i+eltsPerPage){
        page = {};
        page.dateText         = printingData.dateText;
        page.leftHeaders      = [...printingData.leftHeaders];
        page.rightHeaders     = [...printingData.rightHeaders];
        page.centerHeaders    = [...printingData.centerHeaders];
        page.pageImages       = [...printingData.pageImages];
        page.tableHeaderModel = [...printingData.tableHeaderModel];
        page.pageTitle        = printingData.pageTitle + getTitleSuffix(index, eltsPerPage, tabSize);
        page.currentClasse    = printingData.currentClasse;
        
        var subTable = printingData.tableData.splice(i,i+eltsPerPage);
        page.pageRows = [...subTable];
        page.pageNumber = pagNumber;
        pageSet.push(page);
        index = index + eltsPerPage
        pagNumber++;
    }

    return pageSet;
}




