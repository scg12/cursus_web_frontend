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