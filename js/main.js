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
    setOnClick();
    putUtilitiesIcons(icons);
}

//##############################################################################
//######################### SETTING UP DOM END ################################# 
//############################################################################## 




//##############################################################################
//###################### VARIABLES DECLARATION START ########################### 
//##############################################################################

inputField=         document.getElementById("input");
prixField=          document.getElementById("prix");
articlesField=      document.getElementById("articles");
inputBox=           document.getElementById("writing");
totalBox=           document.getElementById("total");
dinarsTot=          document.getElementById("dinars-total");
millimTot=          document.getElementById("millimes-total");


screen={
    content:    [],
    temp:       [],
    total:      null,
}


defaultPrix= {

    state:      "BLUR",    //Possible states["FOCUSED", "BLUR"]
    mode:       "REPLACE",  //Possible states["REPLACE", "APPEND"]
    value:      "0",
    numeric:     0, 

}

defaultArticle= {

    state:      "BLUR",  //Possible states["FOCUSED", "BLUR"]
        mode:       "REPLACE", //Possible states["REPLACE", "APPEND"]
        value:      "1",
        numeric:     1,

}


defaultTotal= {

    value:      "",

}


input = {

    id:         null,
    state:      "GHOSTED", // Possible states ["GHOSTED","IDDLE", "FOCUSED"]
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

    total:      {

        value:      "",
    }

    }


articles = input.articles;
prix = input.prix;
Total = input.total;



//##############################################################################
//######################## VARIABLES DECLARATION END ###########################  
//##############################################################################


//##############################################################################
//###################### INTERACTING WITH DOM START ############################ 
//##############################################################################


function handleClick(number) {  //HANDLES NUMBERS CLICKS

    if (input.state == "FOCUSED" && prix.state == "FOCUSED") {

        if (prix.mode == "REPLACE") {
            prix.mode == "APPEND";
            setValue(prix, number);
            renderPrix()
        } 
        else if(number == "."){
            if(prix.value.includes(".") == true  ||  prix.value.length > 3 ){
                renderPrix()
            } 
            else {
                setValue(prix, number);
                renderPrix()
            }
        }
              
        else if (prix.value.length < 5 && (prix.value + number).length <= 5) {
            setValue(prix, number);
            renderPrix()
        }
        else if (prix.value.length < 5 && number.length == 2) {
            setValue(prix, number[0]);
            renderPrix()
            }
    }



    else if (input.state == "FOCUSED" && articles.state == "FOCUSED" && articles.value.length < 2 && number!=".") {
        if (articles.mode == "REPLACE") {
            articles.value = number;
            articles.mode = "APPEND";
            renderArticles();
        } else {
            setValue(articles, number);
            renderArticles();
        }

    }
}


function backspace() { //HANDLES BACKSPACE TO DELETE TEXT FROM THE FOCUSED TEXT INPUT
    if (input.state == "FOCUSED" && prix.state== "FOCUSED") {
        prix.value = prix.value.slice(0, -1);
        renderPrix();
    } else if (input.state == "FOCUSED" && articles.state== "FOCUSED") {
        articles.value = articles.value.slice(0, -1);
        if (articles.value.length == 0) {
            articles.value = "1";
            articles.mode = "REPLACE"
        }
        renderArticles();
    }
}


function deleteArticle(element){ //DELETES THE CHOSEN ARTICLE

    let ID= Number(element.parentNode.id);

    if(ID == input.id){
        input.id-= 1;
        resetInput();
    }

    deleteState(ID);
    element.parentNode.remove();


}


function handleNext() { //EVALUATE THE STATE AND HANDLES PRESSING "NEXT"

    if(input.state == "GHOSTED"){
        addField()
        startEditing(input);
        startEditing(prix);
    }
    else if (prix.state == "FOCUSED" && prix.value!="0") {
        prix.state = "BLUR"
        articles.state = "FOCUSED";
        stopEditing(prix);
        renderArticles();
    }
    else if (articles.state == "FOCUSED") {
        articles.state == "BLUR"
        input.state = "IDDLE";
        stopEditing(articles);
        CalcTotal();
        if(screen.temp.length != 0){
            screen.content.map(article => {
                if(article.id == input.id){
                    article = JSON.parse(JSON.stringify(input));
                }
                input= JSON.parse(JSON.stringify(screen.temp[0]));
                articles = input.articles;
                prix = input.prix;
                Total = input.total;
                setTimeout(()=>{screen.temp.splice(0,1)},100);
                startEditing(input);
                startEditing(prix)
                allTotal();
            });
        } else {

            screen.content.push(JSON.parse(JSON.stringify(input)));
            allTotal();
            addField();
            resetInput();
            startEditing(input);
            startEditing(prix);
        }

    }
}


function handleEdit(element){ //CHNGES THE STATE SO
    let ID= element.parentNode.id;
    let toBeLoaded= screen.content.filter((article)=> article.id == ID);
    input.state= "IDDLE"
    screen.temp.push(JSON.parse(JSON.stringify(input)));
    input = JSON.parse(JSON.stringify(toBeLoaded))[0];
    startEditing(input);
    startEditing(prix);
}



//##############################################################################
//###################### INTERACTING WITH DOM END ############################## 
//##############################################################################





//##############################################################################
//######################## HELPER FUNCTIONS START ############################## 
//##############################################################################


function setValue(path, number) { //TESTS HOW TO SET THE VALUE OF THE SPECIFIED PATH "prix" OR "articles"
    if (path.mode == "REPLACE") {
        path.value = number;
        path.mode = "APPEND";

    } else if (path.mode == "APPEND")
        path.value += number;
}






function resetInput(){ //SETS THE VALUE OF "input" TO DEFAULT VALUES
    input.prix=               JSON.parse(JSON.stringify(defaultPrix));
    input.articles=           JSON.parse(JSON.stringify(defaultArticle));
    input.total=              JSON.parse(JSON.stringify(defaultTotal));
    input.state=              "GHOSTED";
    articles =                input.articles;
    prix =                    input.prix;
    Total =                   input.total;
}


function deleteState(ID){   //HELPER FUNCTION FOR "deleteArticle"s FUNCTION THAT DELETS THE ARTICLE FROM THE SCREEN OBJECT
    screen.content= screen.content.filter((Article) =>!(Article.id == ID))
    allTotal();
}




function startEditing(element) {
    element.state = "FOCUSED";
}

function stopEditing(element) {
    if(element.id){
        element.state = "GHOSTED";
    } 
    else {
        element.state = "BLUR";
        element.mode = "REPLACE";
    }

    
}




function makeFloat(value) { //ADDS "." TO "prix.value" WHEN THE USER FORGETS TO DO SO
    if (value.length <= 2) {
        return value + ".";
    }
    else if (value.length > 2) {
        return value.slice(0, 2) + "." + value.slice(2);

    }
}



function renderPrix() { //RENDERS PRICE VALUE
    

        if (prix.value.includes(".")) {
            displayPrix(prix.value);
            prix.numeric = parseFloat(prix.value);
        }
        else if (!prix.value.includes(".")) {
            displayPrix(makeFloat(prix.value));
            prix.numeric = parseFloat(makeFloat(prix.value));
        }
    
};



function displayPrix(floatValue) {  //INVOKED BY "renderPrix" TO DISPLAY THE PASSED VALUE IN THE DOM

    let ActualEdit= document.getElementById(`${input.id}`)

    let dinarBox = ActualEdit.children[1].children[0].children[0];
    let millimBox = ActualEdit.children[1].children[0].children[2].children[1];


    let splitted = floatValue.split(".");
    dinarBox.innerHTML = splitted[0].padStart(1, 0);
    millimBox.innerHTML = splitted[1].padEnd(3, 0);
}


function renderArticles() { //RENDERS ARTICLES VALUE

        displayArticles(articles.value);
        articles.numeric = parseFloat(articles.value);
};


function displayArticles(value) { //INVOKED BY "renderArticles" TO DISPLAY THE PASSED VALUE IN THE DOM

    let ActualEdit= document.getElementById(`${input.id}`)
    let nombreArticle= ActualEdit.children[1].children[1].children[1];
    nombreArticle.innerHTML = value.padStart(2,0)
};


function CalcTotal() { //CALCULATES THE TOTAL OF THE FOCUSED ARTICLE
    Total.value = Number((prix.numeric * articles.numeric).toFixed(3));
};

function allTotal(){ //CALCULATES THE SUM OF TOTALS
    screen.total= screen.content.reduce((sum, currentVal)=> sum + currentVal.total.value, 0);
    displayTotal()
}

function displayTotal() { //INVOKED BY "allTotal" TO DISPLAY THE PASSED VALUE IN THE DOM

    let strVal = screen.total.toFixed(3);
    console.log(strVal);
    let splitted = strVal.split(".");
    dinarsTot.innerHTML = splitted[0];
    millimTot.innerHTML = splitted[1].padEnd(3, 0);
    console.log(screen.total);
}




function addField(){  //INVOKED BY "handleNext" TO PUSH ANOTHER INPUT FIELD IN THE SCREEN
    if(input.id== null){
        input.id= 1;
    }else{
        input.id+= 1;
    }
  
    let template = document.querySelector("template");
    let container = document.querySelector("#Articles");
    let clone = template.content.cloneNode(true);

    let elements = clone.querySelectorAll("div");
    elements[0].setAttribute("id",`${input.id}`);
    container.appendChild(clone);


}


