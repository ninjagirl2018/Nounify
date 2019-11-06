var key = "39c214e56b670999aebe2b153dfa922be50aa77d";

var picKey = "14145304-25921bbb2bbadb686e5be30b3"; 

var score = 0;

$("#quiz_input").hide();


$("#quiz").on("click", function () {
    if ( $("#text_input").contenteditable == false){
        $("#text_input").children().remove();
        $("#text_input").text("Place your text here");
        $("#text_input").attr("contenteditable", "true");
    }

    else {
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
                    replaceNoun(words, allNouns);
                }
                    
            })
    }
    processWord(words[counter]);
    }
});

    /* create for each loop or other way to compare hidden nouns with the answer input by user */    


function requestAnswer(object) {
    $("#quiz_input").children().remove();
    $("#quiz_input").show();
    $("#quiz_input").append('<input type="text" id="answer"></input><input type="submit" id="submit_answer">');
    //$(".nouny").hide(); /*not working?*/
    $("#submit_answer").click(function() {
        processAnswer(object);
    })

}

function processAnswer(object) {
    console.log(object.parent().attr("id"));
    console.log($("#answer").val());
    if ($("#answer").val() === object.parent().attr("id")) {
        console.log("Good job!");
        object.parent().append(`${object.parent().attr("id")} `);
        object.remove();
        $("#quiz_input").children().remove();
        $("#quiz_input").hide();
    }
    else {
        console.log("try next time");

    }
    if (!($(".quiz_pic").length)) {
        console.log("All done!");
    }
}

function replaceNoun(words, allNouns) {
    finalText = "";
    newDiv = $("<div>").attr("id","updated_text");
    for (word of words) {
        var checkWord = stripPunctuation (word);
        if (allNouns.includes(checkWord)) {
            var pic = $("<span>").attr({class: "pic_placeholder", id: checkWord});
            newDiv.append(pic);
            showPicture(checkWord, pic);
        }
        else {
            newDiv.append(`${word} `);
        }
    }
    $("#text_input").text("");
    $("#text_input").append(newDiv);
    $("#text_input").attr("contenteditable", "false");
}


function showPicture(word, callerObject) {
    var obj = callerObject;
    var promise = picAPI.call(picKey, word);
    promise.then(function (data){
        console.log(data);
        randItem = Math.floor((Math.random()*(data.hits.length - 1)))
        imgUrl = data.hits[randItem].previewURL;
        var img = $("<img>").attr({src: imgUrl, class: "quiz_pic"});
        obj.append(img);
        $(".quiz_pic").unbind().click(function(){
            requestAnswer($(this));
        })
    });
}