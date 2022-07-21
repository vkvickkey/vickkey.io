String.prototype.sliceReplace = function(start, end, repl) {
    return this.substring(0, start) + repl + this.substring(end);
}
var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $http,$sce) {
$scope.suggestions = [];
$scope.currentSuggestions = [];
$scope.engTotranslateResult = [];

$scope.inputText = '';
$scope.lastWord = '';


$scope.getGoogle = function(word) {
        if(!$scope.suggestions[word]){
            $http.get("https://inputtools.google.com/request?text="+word+"&itc=ta-t-i0-und&num=13&cp=0&cs=0&ie=utf-8&oe=utf-8&app=demopage")
            .success(function (response) {
                var myresponse = (angular.fromJson(response));
                if(myresponse[0]=='SUCCESS'){
                    var mydata = myresponse[1];
                    var mydataWrap = mydata[0];
                    var question = mydataWrap[0];
                    var answers_array  = mydataWrap[1];
                    //console.log(question);
                    //console.log(answers_array);
                    $scope.suggestions[word] = answers_array;
                    $scope.currentSuggestions = answers_array;
                }
            });
        }

}
$scope.proccessWord = function(word) {
    word = word.trim();
    //console.log('['+word+']');
    if(!$scope.suggestions[word]){
        $scope.getGoogle(word,false);
    }
    else{
        $scope.currentSuggestions = $scope.suggestions[word];
    }
}


$scope.getWord = function() {
    var boxTextOriginal = jQuery('#home_th_ta_box').val();
    var boxText = jQuery('#home_th_ta_box').val().trim();
    var boxTextArray = boxText.split(" ");
    for (var i = 0; i < boxTextArray.length; i++) {
        var word = boxTextArray[i];
        if(word!=''){
            $scope.proccessWord(word.trim());
        }
    }
    var lastChar = boxTextOriginal.charAt(parseInt(boxTextOriginal.length)-1);
        if( parseInt(boxText.length) >=2 &&
            lastChar == " "
            || lastChar == ","
            || lastChar == "."
            || lastChar == "-"
            || lastChar == "_"
            || lastChar == "!"
            || lastChar == "@"
            || lastChar == "#"
            || lastChar == "&"
            || lastChar == "("
            || lastChar == ")"
            || lastChar == "/"
            || lastChar == "?" )
        {
            $scope.setWord();
        }


}
$scope.setSelectdWord = function(selectedWord) {
    var translateWords = '';
    var translateWord = '';
    var boxText = jQuery('#home_th_ta_box').val().trim();
    var boxTextArray = boxText.split(" ");
    var lastlen = boxTextArray.length - 1;
    for (var j = 0; j < boxTextArray.length; j++) {
        var word = boxTextArray[j];
        //console.log(word);


        if(j==lastlen){
        translateWord = selectedWord;
            if(translateWords==''){translateWords = selectedWord;}
            else {translateWords += ' ' + selectedWord;}

        $scope.suggestions[word] = [selectedWord]
        }
        else{


                    translateWord = word;
                    if(word!=''){

                        if($scope.suggestions[word]){
                            translateWord = $scope.suggestions[word][0];
                            if(translateWords==''){translateWords = translateWord;}
                            else {translateWords += ' ' + translateWord;}

                        }
                        else{
                            $scope.getGoogle(word);
                            if($scope.suggestions[word]){
                            translateWord = $scope.suggestions[word][0];
                            }
                            if(translateWords==''){translateWords = translateWord;}
                            else {translateWords += ' ' + translateWord;}

                        }
                    }


        }

        $scope.suggestions[translateWord] = $scope.suggestions[word];
    }

    jQuery('#home_th_ta_box').val(translateWords+' ');
    jQuery('#home_th_ta_box').focus();
    //console.log(translateWords);
}

$scope.setWord = function() {

    var translateWords = '';
    var translateWord = '';
    var boxText = jQuery('#home_th_ta_box').val().trim();
    var boxTextArray = boxText.split(" ");
    for (var i = 0; i < boxTextArray.length; i++) {
        var word = boxTextArray[i];
        //console.log(word);
        translateWord = word;
        if(word!=''){
            if($scope.suggestions[word]){
                translateWord = $scope.suggestions[word][0];
                if(translateWords==''){translateWords = translateWord;}
                else {translateWords += ' ' + translateWord;}

            }
            else{
                $scope.getGoogle(word);
                if($scope.suggestions[word]){
                translateWord = $scope.suggestions[word][0];
                }
                if(translateWords==''){translateWords = translateWord;}
                else {translateWords += ' ' + translateWord;}


            }
        }
        $scope.suggestions[translateWord] = $scope.suggestions[word];
    }
    jQuery('#home_th_ta_box').val(translateWords+' ');
    jQuery('#home_th_ta_box').focus();
    //console.log(translateWords);

}
$scope.highlightText = function(str,htext)
{
    return str.replace(htext, '<span class="highlighted">' + htext + '</span>');
}


$scope.cleanUrlJs = function(str)
{
  if (!arguments.callee.re) {
    // store these around so we can reuse em.
    arguments.callee.re = [/[^a-z0-9]+/ig, /^-+|-+$/g];
    // the first RE matches any sequence of characters not a-z or 0-9, 1 or more
    // characters, and gets replaced with a '-'  the other pattern matches '-'
    // at the beginning or end of a string and gets replaced with ''
  }
  return str.toLowerCase()
   // replace all non alphanum (1 or more at a time) with '-'
   .replace(arguments.callee.re[0], '-')
   // replace any starting or trailing dashes with ''
   .replace(arguments.callee.re[1],'');
}
$scope.engTotranslate = function() {
            $scope.engTotranslateZeroResult = 0;
            jQuery('.mod_eng_translate #transResultLoader_1').show();
            var word = jQuery('#tranInputArea_1').val().trim();
            if(word==''){
                $scope.engTotranslateResult = [];
                jQuery('.mod_eng_translate .tranResult').slideUp('slow')
                jQuery('.mod_eng_translate #transResultLoader_1').hide();
                return false;
            }
            var wordIndex = word.charAt(0);
            var wordIndex2 = word.charAt(0)+word.charAt(1);
            var element = document.querySelector('meta[name="postKey"]');
			var postKey = element && element.getAttribute("content");
			var crntDate = new Date();
			var crntDateTime = crntDate.getTime();
            //var postString = { 'quickaccess' : 1,'postKey' : postKey, 'searchkey' : word, 'wordIndex' : wordIndex, 'wordIndex2' : wordIndex2, }

            var postString = 'quickaccess=1&postKey='+postKey+'&searchkey='+word+'&wordIndex='+wordIndex+'&wordIndex2='+wordIndex2+'&timestamp='+crntDateTime;


            $http({
		        url: 'english-to-translate.html',
		        method: "POST",
		        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		        data: postString
		    }).then(function(result) {
            	var response = result.data;
                jQuery('.mod_eng_translate #transResultLoader_1').hide();
                if(response=='zero'){
                     $scope.engTotranslateZeroResult = word;
                     $scope.engTotranslateResult = [];
                }
                else if(response!=''){

                	var responseArray = response.split('||');
                	var ajaxTimestamp = responseArray[0];
                	var filteredResponse = responseArray[1];
                	if(ajaxTimestamp<$scope.timestamp){
						return false;
					}
                	$scope.timestamp = ajaxTimestamp;
                    jQuery('.mod_eng_translate .tranResult').slideDown('slow');
                    var translateResponse = (angular.fromJson(filteredResponse));
                    $scope.engTotranslateResult = [];
                    angular.forEach(translateResponse, function(value) {

                        var engWord = value.english_word;
                        value.english_word_raw =  engWord;

                        if(engWord.length>=15){
                            engWord = engWord.slice(0,15)+' ...';
                        }


                        engWord = $scope.highlightText(engWord,word);

                        value.english_word_link =  $scope.cleanUrlJs(value.english_word);

                        value.english_word =  $sce.trustAsHtml(engWord);


                        var translateWord = value.translate_words;
                        translateWord = translateWord.replace(new RegExp(",","g"), ", ");

                        value.translate_words_raw =  translateWord;

                        if(translateWord.length>=15){
                           translateWord = translateWord.slice(0,15)+' ...';

                        }


                        value.translate_words = translateWord;

                        $scope.engTotranslateResult.push(value);
                    });
                }
                else{
                    $scope.engTotranslateResult = [];
                    jQuery('.mod_eng_translate .tranResult').slideUp('slow')
                }
            });


}


});
