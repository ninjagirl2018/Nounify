
var key = "39c214e56b670999aebe2b153dfa922be50aa77d";

$("#start").on("click", function () {
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
}

$("#reset").on("click", function(){
    $("#text_input").children().remove();
    $("#text_input").text("Place your text here");
    $("#text_input").attr("contenteditable", "true");
    });


function stripPunctuation (word) {
    var clearWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return clearWord;
} 

    // ["This", "text,", "is", "awesome"]
    //["This", "text", "is", "awesome"]