var key = "39c214e56b670999aebe2b153dfa922be50aa77d";

var picKey = "14145304-25921bbb2bbadb686e5be30b3"; 

$("#quiz_input").hide();


$("#quiz").on("click", function () {
    if ( $("#text_input").contenteditable == false){
        $("#text_input").children().remove();
        $("#text_input").text("Place your text here");
        $("#text_input").attr("contenteditable", "true");
    }

    else{
    }

    var str =  $("#text_input").text();
    var words = str.split(" ");
    var allNouns = [];
    var wordsCount = words.length;
    console.log(`wordsCount = ${wordsCount}`)

    var counter = 0;

    function processWord(word) {
        var checkWord = stripPunctuation (word); 
        var promise = owlAPI.call(key, checkWord);
        promise.fail(function(){
            counter++;
            processWord(words[counter])
        })
        promise.then(function(data) {
            var isNoun = false;
            for (def of data.definitions) {
                if (def.type === "noun") {
                    isNoun = true;
                }  
            }
            if (isNoun === true) {
                allNouns.push(data.word);
            }

            if (counter < wordsCount-1) {
                counter++;
                console.log(counter);
                console.log(words[counter]);
                processWord(words[counter])}
            else {
                console.log(allNouns);
                processText(words, allNouns);
            }
                
        })
    }
    processWord(words[counter]);
    
    function replaceNoun() {
    /* create for each loop or other way to compare hidden nouns with the answer input by user */    
    $("#quiz_input").show();
    $("#quiz_input").append('<input type="text" id="answer"></input><input type="submit">');
    $(".nouny").hide(); /*not working?*/
    if ($("#answer").val() == checkWord) {
    }
    else {}
    }
    replaceNoun();
})
   
function processText(words, allNouns) {
    finalText = "";
    newDiv = $("<div>").attr("id","updated_text");
    for (word of words) {
        var checkWord = stripPunctuation (word);
        if (allNouns.includes(checkWord)) {
            newWord = `<span class="nouny">${word}</span>`;
            newDiv.append($("<span>").attr("class","nouny").text(`${word} `));
        }
        else {
            newWord = word;
            newDiv.append(`${word} `);
        }
        finalText += newWord;
    }
    console.log(finalText);
    $("#text_input").text("");
    $("#text_input").append(newDiv);
    $("#text_input").attr("contenteditable", "false");
    $(".nouny").unbind().click(function(){
        console.log("Word clicked!");
        var word = $(this).text();
        var checkWord = stripPunctuation (word);
        getPicture(checkWord, $(this));
    })
}



function stripPunctuation (word) {
    var clearWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return clearWord;
} 

    // ["This", "text,", "is", "awesome"]
    //["This", "text", "is", "awesome"]

function getPicture(word, callerObject) {
    var obj = callerObject;
    var promise = picAPI.call(picKey, word);
    promise.then(function (data){
        console.log(data);
        randItem = Math.floor((Math.random()*(data.hits.length - 1)))
        console.log(randItem);
        imgUrl = data.hits[randItem].previewURL;
        console.log(imgUrl);
        $(".popup_parent").remove();
        var popupParent = $("<span>").attr("class","popup_parent");
        var popupSpan = $("<span>").attr("class","popup");
        var img = $("<img>").attr("src", imgUrl);
        $("#text_input").children(".popup").remove();
        popupSpan.append(img);
        popupParent.append(popupSpan);
        obj.append(popupParent);
        var element = document.getElementsByClassName("popup")[0];
        console.log("this is "+$(this));
        element.classList.toggle("show");
    });
}


