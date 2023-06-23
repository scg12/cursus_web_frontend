import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';

var pageSet = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

function StudentList(props){
    const { t, i18n } = useTranslation();


    const PageHead = () =>{
        return(
            <View style={styles.Pageheader}>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>REPUBLIQUE DU CAMEROUN</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>MINISTERE DES ENSEIGNEMENT SECONDAIRES</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>COLLEGE FRACOIS XAVIER VOGT</Text>
            </View>
        );
    }

    const EleveRowHeader = (props) =>{
        return(
            <View style={styles.headerRow}>
                <View style={{width:'8vw',  justifyContent:'center',...styles.headercell}}><Text >{props.eleve.matricule}</Text></View>
                <View style={{width:'20vw', justifyContent:'flex-start',...styles.headercell}}><Text >{props.eleve.nom}</Text></View>
                <View style={{width:'12vw', justifyContent:'center',...styles.headercell}}><Text>{props.eleve.date_naissance}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.headercell}}><Text>{props.eleve.lieu_naissance}</Text></View>
                <View style={{width:'8vw', justifyContent:'center',...styles.headercell}}><Text>{props.eleve.date_entree}</Text></View>
                <View style={{width:'14vw', justifyContent:'flex-start', ...styles.headercell}}><Text>{props.eleve.nom_pere}</Text></View>
                <View style={{width:'7vw',  justifyContent:'flex-start',...styles.headercell}}><Text>{props.eleve.redouble}</Text></View>
            </View>
        );
    }

    const EleveRow = (props) =>{
        return(
            <View style={styles.row}>
                <View style={{width:'8vw', justifyContent:'center',...styles.cell}}><Text >{'y254p0368'}</Text></View>
                <View style={{width:'20vw', justifyContent:'flex-start',...styles.cell}}><Text >{props.eleve.nom}</Text></View>
                <View style={{width:'12vw', justifyContent:'center',...styles.cell}}><Text>{props.eleve.date_naissance}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{props.eleve.lieu_naissance}</Text></View>
                <View style={{width:'8vw', justifyContent:'center',...styles.cell}}><Text>{props.eleve.date_entree}</Text></View>
                <View style={{width:'14vw', justifyContent:'flex-start', ...styles.cell}}><Text>{props.eleve.nom_pere}</Text></View>
                <View style={{width:'7vw',  justifyContent:'flex-start',...styles.cell}}><Text>{props.eleve.redouble}</Text></View>
           </View>
        );        

    }

   

    return (
        <Document>
         { Array.from(props.pageSet,
          (el, index) => (
            <Page size="A4"  style={styles.page} key={index}>
                <View style={styles.header}>
                    <PageHead/>
                    <View style={styles.underline}>
                        <Text style={{fontSize:11.3,  fontWeight:'extrabold', fontFamily:"Times-Roman", textTransform:'uppercase'}}>{el.pageTitle}</Text>                                    
                    </View>                    
                </View>

               
                <View style={styles.main}>
                   { Array.from(el.pageRows,
                        (row, index) => (
                            (index==0) ?
                                <EleveRowHeader eleve={row}/> 
                            :
                                <EleveRow eleve={row}/>
                            
                        ))
                   } 
                </View>
              
                <View style={styles.footer}> 
                    <Text>{el.pageNumber} / {props.pageSet.length}</Text> 
                </View>    
            </Page>
          ))}
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
      margin: 0,
      textAlign: "justify",
      fontFamily: "Times-Roman",
      display: "flex",
      flexDirection: "column",
      justifyContent:'space-between',
      width: "98vw",
      height: "100%",
      
    },

    underline :{
        borderBottom: "1px solid black",
        justifyContent:'flex-end',
        height:'23%',
        width:'auto'
    },

    header: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        fontWeight:'bold',
        height: '15%',
        width: "100%",
        margin:0,        
    },

    Pageheader:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-start',
        marginBottom:'1.7vh',
        marginLeft:'1.7vw'
    },

   

    headerRow:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'space-evenly',
        alignItems:'center',
        fontSize:8,
        color:'white',
        width:'100%',
        backgroundColor:'rgb(6, 83, 134)',
        textTransform:'uppercase'

    },

    headercell:{      
        height:'15px',  
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row", 
        

    },

    cell:{
        height:'15px',
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row", 
        
    },

    row:{
        display: "flex",
        flexDirection: "row",
        fontSize:9,
        color:'black',
        justifyContent:'space-evenly',
        alignItems:"center"
    }, 

    main: {
        textAlign: "center",
        backgroundColor: "white",
        height: "70%",
        width: "100%",
        color:'black',
    },
    ligne:{
      width: "100%",
      height:"20px",
      border: "2px 2px solid black",
    },

    footer: {
        textAlign: "center",
        height: "7%",
        width: "100%",
        color: "black",
    },

    title: {
      fontSize: 14,
      textAlign: "center",
      color:"black"
    },

    text: {
      margin: 12,
      fontSize: 12,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
  
  });

export default StudentList;