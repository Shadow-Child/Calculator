//##############################################################################
//######################### SETTING UP DOM START ############################### 
//############################################################################## 

let icons = {
    "calculClassique": {
        "name": "calculClassique",
        "src": "./Ressources/Imgs/calculClassique.svg",
        "order": "1"
    },
    "carnetCredit": {
        "name": "carnetCredit",
        "src": "./Ressources/Imgs/carnetCredit.svg",
        "order": "4"
    },
    "imprimer": {
        "name": "imprimer",
        "src": "./Ressources/Imgs/imprimer.svg",
        "order": "5"
    },
    "reste": {
        "name": "reste",
        "src": "./Ressources/Imgs/reste.svg",
        "order": "3"
    },
    "coller": {
        "name": "coller",
        "src": "./Ressources/Imgs/coller.svg",
        "order": "2"
    }
};


function setOnClick() {
    let numbers;
    numbers = document.querySelectorAll('.numeric');
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].setAttribute('onclick', `handleClick(this.innerHTML);`)
    }

}

function putUtilitiesIcons(icons) {
    let container = document.getElementById('utilities');
    for (const icon in icons) {
        container.innerHTML += (`
            <img src=${icons[icon].src} 
            alt=${icons[icon].name} 
            style="order:${icons[icon].order}">
        `)
    }
}


window.onload = (event) => {

    refreshDate()
    setOnClick();
    //putUtilitiesIcons(icons);
    swipeDownDetect(document.getElementById("extend-container"))
    checkStorage();
    setTicketNbr();

}


function checkStorage(){
    let date= screen.date;

    if(date in localStorage){
        Tickets.push(... JSON.parse(localStorage[date]));
    } else {
        localStorage.setItem(date, [])
    }
}

//##############################################################################
//######################### SETTING UP DOM END ################################# 
//############################################################################## 









//##############################################################################
//###################### VARIABLES DECLARATION START ########################### 
//##############################################################################

totalBox=       document.getElementById("total");
dinarsTot=      document.getElementById("dinars-total");
millimTot=      document.getElementById("millimes-total");

Tickets=[];
screen={
    state:      "EMPTY",
    position:   "SHRUNK", //["SHRUNK", "EXTENDED"]
    content:    [],
    total:      null,
    openTime:   null,
    closeTime:  null,
    date:       null,
    number:     null,
    ticketId:   1
}



input = {

    id:         null,
    state:      "FOCUSED", // Possible states ["BLUR","BLUR", "FOCUSED"]
    valid:      "NO",


    prix:       {
        state:      "BLUR",    //Possible states["FOCUSED", "BLUR"]
        mode:       "REPLACE",  //Possible states["REPLACE", "APPEND"]
        value:      "0",
        numeric:     0,
    },

    articles:   {
        state:      "BLUR",  //Possible states["FOCUSED", "BLUR"]
        mode:       "REPLACE", //Possible states["REPLACE", "APPEND"]
        value:      "1",
        numeric:     1,
    },

    total:      null

    }




//##############################################################################
//######################## VARIABLES DECLARATION END ###########################  
//##############################################################################








//##############################################################################
//###################### INTERACTING WITH DOM START ############################ 
//##############################################################################









//##############################################################################
//###################### INTERACTING WITH DOM END ############################## 
//##############################################################################





//##############################################################################
//######################## HELPER FUNCTIONS START ############################## 
//##############################################################################




















 



































// ####################################################################

function refreshNumber(){ //Refreshes the article number each time render is called

    renderNbrArticles()
    let Allnodes = Array.prototype.slice.call(document.getElementById('Articles').children)
    let numered= Allnodes.slice(0,Allnodes.length-1)
    numered.forEach((element)=>{
        let rank= numered.indexOf(element)
        numered[rank].children[1].children[2].innerHTML=`${rank+1}`
    })
}



function addField(elem){  //INVOKED BY "handleNext" TO PUSH ANOTHER INPUT FIELD IN THE SCREEN
    
    
    let template = document.querySelector("template");
    let clone = template.content.cloneNode(true);
    let elements = clone.querySelectorAll("div");
    let container = document.querySelector("#Articles");
    elements[0].setAttribute("id",`${elem.id}`);
    swipeLeftDetect(elements[0])
    container.appendChild(clone);
   
}


function clearAll(){
    let deleted= screen.content.map(el=> (el.id));
    deleted.forEach(el=>{
        let element= document.getElementById(`${el}`)
        deleteArticle(element.children[0])
    })

    screen.state= "EMPTY";
    document.getElementsByClassName("time")[0].innerHTML= "--:--:--";

    setTimeout(()=> render(), 300)

}


function refreshDate(){

    let date= document.getElementsByClassName("date")[0];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = String(today.getFullYear());

    today = mm + '/' + dd + '/' + yyyy;
    screen.date= today;
    
    date.innerHTML= today
}


function deleteArticle(element){ //DELETES THE CHOSEN ARTICLE

    let ID= parseInt(element.parentNode.id);
    screen.content= screen.content.filter((Article) =>!(Article.id == ID));
    if(screen.content.length==0){
        screen.state= "EMPTY"
        document.getElementsByClassName("time")[0].innerHTML= "--:--:--";
    }
    else {
        screen.state= "NOT-EMPTY";
    }

    slideDelete(element);
    allTotal()
    displayTotal()
    
}




//INTERACTION WITH DOM THAT DOES NOT AFFECT DATA STATE DIRECTLY

function renderNbrArticles(){
    let number= (screen.content.length-1 < 0)?"0":(screen.content.length-1);
    let validate= document.getElementById("validate");
    let discard= document.getElementById("discard")

    if(number > 0){
        validate.setAttribute("class", "active")
        discard.setAttribute("class", "active")
    } else{
        validate.removeAttribute("class")
        discard.removeAttribute("class")
    }
    let container= document.getElementById("nbrArticles");
    container.innerHTML= parseFloat(number);

}

function extendScreen(){
    let myScreen= document.getElementById("screen");
    myScreen.setAttribute("class", "full-screen");
    screen.position="EXTENDED";
}

function shrinkScreen(){
    let myScreen= document.getElementById("screen"); 
    screen.position="SHRUNK";
    myScreen.removeAttribute("class");
}


function swipeDownDetect(el){

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface

    })

    touchsurface.addEventListener('touchmove', function(e){
    })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for horizontal swipe met
                (distY > 0 && screen.position== "SHRUNK")? extendScreen():(distY < 0 && screen.position== "EXTENDED")? shrinkScreen():"invalid"; // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                (distY < 0)? console.log('up') : console.log('down') // if dist traveled is negative, it indicates up swipe
            }
        }
    })
}



compteur= null;



function addArticle(){
    compteur +=1;
    input.id= compteur;
    screen.content.push(JSON.parse(JSON.stringify(input)));
    startEditing((screen.content.filter(el=> el.state== "FOCUSED")[0]).prix);
    render();
}




function highlightField(){ //APPLY OR REMOVE ELEMENTS BACKGROUND COLOR DEPENDING ON THEIR STATE
    screen.content.forEach((el)=>{
        if(el.state=="FOCUSED"){
            let highlighted= document.getElementById(`${el.id}`);
            highlighted.classList.add("colored")
        }
        else if(el.state=="BLUR"){
            let highlighted= document.getElementById(`${el.id}`);
            highlighted.classList.remove("colored")
        }
    })
    
}


function highlightText(){
    screen.content.forEach((el)=>{
        let box= document.getElementById(`${el.id}`);
        let prixText= box.children[1].children[0];
        let nbrArticlesText= box.children[1].children[1].children[1]

        if(el.prix.state== "FOCUSED"){
            prixText.classList.add("highlighted");
        }else{
            prixText.classList.remove("highlighted");
        }
        
        if(el.articles.state== "FOCUSED"){
            nbrArticlesText.classList.add("highlighted");
        }else{
            nbrArticlesText.classList.remove("highlighted");
        }
    })

}


function makeFloat(value) { //ADDS "." TO "prix.value" WHEN THE USER FORGETS TO DO SO
    if (value.length <= 2) {
        return value + ".";
    }
    else if (value.length > 2) {
        return value.slice(0, 2) + "." + value.slice(2);

    }
}






function displayPrix() {  //INVOKED BY "renderPrix" TO DISPLAY THE PASSED VALUE IN THE DOM

    screen.content.forEach((el)=> {
        let box = document.getElementById(`${el.id}`)
        let activeDinars= box.children[1].children[0].children[0];
        let activeMillim = box.children[1].children[0].children[2].children[1];

        let value=  el.prix.value;
        if(!value.includes('.')){
            value= makeFloat(value);
        }
        el.prix.numeric= parseFloat(value)

        let splitted = value.split(".");
        activeDinars.innerHTML= splitted[0].padStart(1, 0);
        activeMillim.innerHTML= splitted[1].padEnd(3,0);
    });

}


function displayArticles() { //RENDERS ARTICLES VALUE

    screen.content.forEach((el)=> {
        let box= document.getElementById(`${el.id}`)
        let nbrArticles= box.children[1].children[1].children[1];

        el.articles.numeric= parseFloat(el.articles.value);
        nbrArticles.innerHTML= el.articles.value.padStart(2,0)
    })
};




function CalcTotal() { //CALCULATES THE TOTAL OF THE FOCUSED ARTICLE
    screen.content.forEach(el=>{
        el.total= el.prix.numeric * el.articles.numeric;
    })};

function allTotal(){ //CALCULATES THE SUM OF TOTALS

    screen.total= screen.content.filter(el=> el.valid== "YES").reduce((sum, currentVal)=> sum + currentVal.total, 0);
}

function displayTotal() { //INVOKED BY "allTotal" TO DISPLAY THE PASSED VALUE IN THE DOM

    let strVal = screen.total.toFixed(3);
    let splitted = strVal.split(".");

    dinarsTot.innerHTML = splitted[0];
    millimTot.innerHTML = splitted[1].padEnd(3, 0);
}



function slideDelete(element){
    
    let box= element.parentElement;
    box.classList.add("deleted")

}



function swipeLeftDetect(el){

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface

    })

    touchsurface.addEventListener('touchmove', function(e){
    })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime  // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                if (distX > 0){
                    deleteArticle(el.children[0]);
                    setTimeout(()=> render(), 300) // if dist traveled is negative, it indicates left swipe
                }
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                (distY < 0)? console.log('up') : console.log('down') // if dist traveled is negative, it indicates up swipe
            }
        }
    })
}



function handleScreenClick(){ //IF THE SCREEN IS CLICKED WHILE EMPTY, A NEW ELEMENT IS ADDED

    if(screen.state== "EMPTY"){
        screen.state= "NOT-EMPTY"
        setOpenTime();
        addArticle();
        render();
    }

    CalcTotal();
    allTotal();
    displayTotal();

}


function handleClick(number) {  //HANDLES NUMBERS CLICKS AN ASSIGN THEIR VALUE TO "ARTICLES" OR "PRIX" DEPENDING ON THE STATE

    let ActualEdit= screen.content.filter(el=> el.state=="FOCUSED")[0];



    if (ActualEdit.state == "FOCUSED" && ActualEdit.prix.state == "FOCUSED") {

        if (ActualEdit.prix.mode == "REPLACE") {
            ActualEdit.prix.mode == "APPEND";
            setValue(ActualEdit.prix, number);
            displayPrix();
            CalcTotal();
        } 
        else if(number == "."){
            if(ActualEdit.prix.value.includes(".") == true  ||  ActualEdit.prix.value.length > 3 ){
                displayPrix();
                CalcTotal();
            } 
            else {
                setValue(ActualEdit.prix, number); 
                displayPrix();
                CalcTotal();
            }
        }
              
        else if (ActualEdit.prix.value.length < 5 && (ActualEdit.prix.value + number).length <= 5) {
            setValue(ActualEdit.prix, number);
            displayPrix();
            CalcTotal();
        }
        else if (ActualEdit.prix.value.length < 5 && number.length == 2) {
            setValue(ActualEdit.prix, number[0]);
            displayPrix();
            CalcTotal();
            }
    }



    else if (ActualEdit.state == "FOCUSED" && ActualEdit.articles.state == "FOCUSED" && ActualEdit.articles.value.length < 2 && number!=".") {
        if (ActualEdit.articles.mode == "REPLACE") {
            ActualEdit.articles.value = number;
            ActualEdit.articles.mode = "APPEND";
            displayArticles();
            CalcTotal();
        } else {
            setValue(ActualEdit.articles, number);
            displayArticles()
            CalcTotal();
        }

    }
}


function backspace() { //HANDLES BACKSPACE TO DELETE TEXT FROM THE FOCUSED TEXT INPUT

    let ActualEdit= screen.content.filter(el=> el.state== "FOCUSED")[0];

    if (ActualEdit.prix.state == "FOCUSED") {
        ActualEdit.prix.value = ActualEdit.prix.value.slice(0, -1);
        displayPrix();
    } else if (ActualEdit.articles.state== "FOCUSED") {
        ActualEdit.articles.value = ActualEdit.articles.value.slice(0, -1);
        displayArticles();
        if (ActualEdit.articles.value.length == 0) {
            ActualEdit.articles.value = "1";
            ActualEdit.articles.mode = "REPLACE"
        }
    }

    render()
}




function setOpenTime(){
    let now= new Date()
    let currentDateTime = now.toLocaleString();
    let time= currentDateTime.split(" ")[1];
    document.getElementsByClassName("time")[0].innerHTML= time;
    screen.openTime= time;
}

function setCloseTime(){
    let now= new Date()
    let currentDateTime = now.toLocaleString();
    let time= currentDateTime.split(" ")[1];
    document.getElementsByClassName("time")[0].innerHTML= time;
    screen.closeTime= time;
}


 
async function handleNext() { //EVALUATE THE STATE AND HANDLES PRESSING "NEXT"

    let actualEdit= screen.content.filter(el=> el.state== "FOCUSED")[0];
    let prixState= actualEdit?.prix.state;
    let articleState= actualEdit?.articles.state;

    if(screen.state== "EMPTY"){
        setOpenTime();
    }

    if(screen.state== "EMPTY" || actualEdit== undefined ){
        addArticle()
        screen.state= "NOT-EMPTY"
    }

    else if (actualEdit.state== "FOCUSED" && prixState== "FOCUSED" && actualEdit.prix.numeric !=0 && actualEdit.prix.value != "." ){
        startEditing(actualEdit.articles);
        stopEditing(actualEdit.prix);
        highlightField();
        highlightText();
    }
    else if( actualEdit.state== "FOCUSED" && articleState== "FOCUSED" ){
        actualEdit.valid= "YES";
        stopEditing(actualEdit);
        stopEditing(actualEdit.articles);
        highlightField();
        highlightText();

        let notValid= screen.content.filter(el=> el.valid== "NO");
        if (notValid.length != 0) {
            startEditing(notValid[0]);
            startEditing(notValid[0].prix);
            highlightField();
            highlightText();
        } else{
            addArticle();
        }
 
    }
    render();
}



function render(){
    let container = document.querySelector("#Articles");
    container.innerHTML="";
    screen.content.forEach(el=> addField(el));
    refreshNumber();
    refreshDate();
    highlightField();
    displayPrix();
    displayArticles();
    highlightText();
    CalcTotal();
    allTotal();
    displayTotal();
}




function setValue(path, number) { //TESTS HOW TO SET THE VALUE OF THE SPECIFIED PATH "prix" OR "articles"
    if (path.mode == "REPLACE") {
        path.value = number;
        path.mode = "APPEND";

    } else if (path.mode == "APPEND")
        path.value += number;
}

function deepCopy(jsonVal){ //CREATE A DEEP COPY (INDEPENDENT COPY) OF A JSON
   return  JSON.parse(JSON.stringify(jsonVal))
}





function startEditing(element) {
    if(element.id){
        element.state = "FOCUSED";
    }
    else{
        element.state = "FOCUSED";

    }
    
}

function stopEditing(element) {
    if(element.id){
        element.state = "BLUR";
        highlightField("OFF")
    } 
    else {
        element.state = "BLUR";
        element.mode = "REPLACE";
        highlightText();
    }   
}



function editPrix(element){

    let ID= element.parentElement.parentElement.id;

    let ActualEdit= screen.content.filter(el=> el.state== "FOCUSED")[0];
    if(ActualEdit != undefined){
        ActualEdit.state= "BLUR"; ActualEdit.prix.state= "BLUR"; ActualEdit.articles.state= "BLUR";
    }


    let newEdit= screen.content.filter(el=> el.id== ID)[0];
    newEdit.state= "FOCUSED"; newEdit.prix.state= "FOCUSED"; newEdit.prix.mode= "REPLACE";
    newEdit.state= "FOCUSED"; newEdit.articles.state= "BLUR"; newEdit.prix.mode= "REPLACE";
    highlightField();
    highlightText();
    displayPrix();
    CalcTotal();
    allTotal();
    displayTotal();
}


function editArticles(element){

    let ID= element.parentElement.parentElement.id;
    let ActualEdit= screen.content.filter(el=> el.state== "FOCUSED")[0];

    if(ActualEdit != undefined){
        ActualEdit.state= "BLUR"; ActualEdit.prix.state= "BLUR"; ActualEdit.articles.state= "BLUR";
    }

    let newEdit= screen.content.filter(el=> el.id== ID)[0];
    newEdit.state= "FOCUSED"; newEdit.articles.state= "FOCUSED"; newEdit.articles.mode= "REPLACE";
    newEdit.state= "FOCUSED"; newEdit.prix.state= "BLUR"; newEdit.prix.mode= "REPLACE";
    displayArticles();
    highlightField();
    highlightText();
    CalcTotal();
    allTotal();
    displayTotal();
}



function validateTicket(){
    setCloseTime();
    screen.content= screen.content.filter(el=> el.valid== "YES");

    let articlesData = screen.content.map(el=> {
        return {
            "total"     :   el.total,
            "prix"      :   {
                numeric: el.prix.numeric,
                string:  el.prix.value
            },

            "articles"  :   {
                numeric: el.articles.numeric,
                string:  el.articles.value
            },
        }

    })

    Tickets.push({
        "content":          articlesData,
        "timeOpen":         screen.openTime,
        "timeClose":        screen.closeTime,
        "totalTicket":      screen.total,
        "ticketId":         screen.ticketId,
})

    clearAll()
    localStorage[`${screen.date}`]= JSON.stringify(Tickets);
    screen.ticketId += 1;
}



function setTicketNbr(){ //NOT YET COMPLETE
   

        for (let i = 0; i < 7;) {
            if (localStorage[earlyDate(i)].length != 0) {
                let prevTickets= JSON.parse(localStorage[earlyDate(i)]);
                screen.ticketId= prevTickets[prevTickets.length-1].ticketId+1
                break
            }else{
                console.log("none")
                i++
            }
        }

    




}


function earlyDate(daysBack){

    let day = new Date();
    day.setDate(day.getDate()- daysBack)
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = String(day.getFullYear());

    return mm + '/' + dd + '/' + yyyy;
}


