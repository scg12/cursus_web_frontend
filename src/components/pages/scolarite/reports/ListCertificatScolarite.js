import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import CertificatScolarite from "./CertificatScolarite";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';



Font.register({
    family: "MyBold",
    // fontWeight: '1200', 
    src: fontBold 
  });
  Font.register({
    family: "MyItalic",
    src: fontItalic 
  });

function ListCertificatScolarite(props){
    const { t, i18n } = useTranslation();

    return (

        
        <Document>
            { Array.from(props.pageSet.tableData,
                (el, index) => (
                    <CertificatScolarite pageSet = {props.pageSet}
                        anneeScolaire   = {props.pageSet.anneeScolaire}
                        dateText        = {props.pageSet.dateText}
                        nomDirecteur    = {props.pageSet.nomDirecteur}
                        qualite         = {props.pageSet.qualite}
                        schoolName      = {props.pageSet.schoolName}
                        ville           = {props.pageSet.ville}
                        eleve           = {el}            
                    />
                ))
            }
       </Document>
    );
}

export default ListCertificatScolarite;

