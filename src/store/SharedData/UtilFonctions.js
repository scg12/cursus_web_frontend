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