
   var key = "39c214e56b670999aebe2b153dfa922be50aa77d";

var picKey = "14145304-25921bbb2bbadb686e5be30b3"; 

$("#start").on("click", function () {
    var str =  $("#text_input").text().trim();
    var words = str.split(" ");
    var allNouns = [];
    var wordsCount = words.length;

    var counter = 0;
    var progress = 0;

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
                processWord(words[counter])}
            else {
                processText(words, allNouns);
            }
                
        })
        var progress = Math.floor(100 * (counter + 1)/wordsCount);
        if (progress !== 100) {
            $("#progressBar").css("display", "inline-block");
            console.log(progress);
            $("#progressLoader").css("width", progress + "%");
        }
        else {
            $("#progressBar").css("display", "none");
        }
    }
    processWord(words[counter]);
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

$("#reset").on("click", function(){
    $("#text_input").children().remove();
    // $("#text_input").text("Place your text here");
    $("#text_input").attr("contenteditable", "true");
    });


function stripPunctuation (word) {
    var clearWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"’”]/g,"");
    return clearWord;
} 


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
