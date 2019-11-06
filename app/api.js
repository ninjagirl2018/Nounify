
var owlAPI = (function () {
    return {
        something: "",
        call: function(key, word){
            console.log(word);
            return $.ajax({
            url: `https://owlbot.info/api/v3/dictionary/${word}`,
            beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", `Token ${key}`)},
        })
        },
        isNoun: function(data) {
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
            return $.ajax({
            url: `https://pixabay.com/api/?q=${word}&key=${key}`,
            method: 'GET'
        })
        }
    }
})();

