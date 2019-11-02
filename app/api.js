console.log("Launched!");

var owlAPI = (function () {
    return {
        something: "",
        call: function(key, word){
            console.log(`Calling API with ${word}`);
            return $.ajax({
            url: `https://owlbot.info/api/v3/dictionary/${word}`,
            beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", `Token ${key}`)},
            // statusCode: {
            //     404: function() {
            //       console.log(`${word} word stays as is`);
            //     }
            // }
        })
        },
        isNoun: function(data) {
            //console.log(data);
            for (def of data.definitions) {
                if (def.type === "noun") {
                    return true;
                }  
            }
            return false;
        }
    }
})();


var picAPI = (function () {
    return {
        key: "",
        call: function(key, word){
            console.log(`Calling Picture API with ${word}`);
            return $.ajax({
            url: `https://pixabay.com/api/?q=${word}&key=${key}`,
            method: 'GET'
            // statusCode: {
            //     404: function() {
            //       console.log(`${word} word stays as is`);
            //     }
            // }
        })
        }
    }
})();

