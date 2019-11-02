
var key = "39c214e56b670999aebe2b153dfa922be50aa77d";

$("button").on("click", function () {
    var str =  $("#text_input").text();
    var words = str.split(" ");
    var allNouns = [];
    var wordsCount = words.length;

    var counter = 0;

    function processWord(word) {
        var promise = owlAPI.call(key, word);
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

            if (counter < wordsCount) {
                counter++;
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
    newDiv = $("<div>").attr("id","updated_ext");
    for (word of words) {
        if (allNouns.includes(word)) {
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
}