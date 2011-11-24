// search bar
$(document).ready(function () {
    // domainr api
    var url = "http://domai.nr/api/json/search?q=";
    var query;

    $(".names").delegate(".created", "click", function() {
        query = $(this).text();
        $.getJSON(url+query+"&callback=?", function(json) {
            $('#domains').empty();
            $.each(json.results, function(i, result) {
                var state = result.availability;
                
                if ((state == "taken") || (state == "available") || 
                    (state == "maybe")) {
                    if (state == "available") {
                        $("#domains").append('<div id ="url' + i + 
                            '"class = "urls"><div id = "available">' 
                            + result.domain + '</div></div>');
                    }
                    else if (state == "maybe") {
                        $("#domains").append('<div id ="url' + i + 
                            '"class = "urls"><div id = "maybe">' 
                            + result.domain + '</div></div>');
                    }
                    else {
                        $("#domains").append('<div id ="url' + i + 
                            '"class = "urls"><div id = "taken">' 
                            + result.domain + '</div></div>');
                    }
                }
            });
        });
        
        $("#i-three").hide();
        $("#step-three").hide();
        $("#i-four").css("display", "inherit");
        $("#step-four").css("display", "inherit");
        $("#domain-info").empty();
    });

    // clicked on a domain, clear all other grays
    $("#domains").delegate(".urls", "click", function() {        
        $(".urls").each(function() {
            $(this).css({'background-color':''});
        });
        $(this).css({'background-color':'#c7c7c7'});


        // retrieve status
        if ($(this).hasClass("available") == true) {
            $("#domain-info").text("Available!");
            
            // get registrar info to check for GoDaddy
            var infourl = "http://domai.nr/api/json/info?q=";
            var infoquery = $(this).text();
            $.getJSON(infourl+infoquery+"&callback=?", function(json) {
                var godaddy = false;
                $.each(json.registrars, function(i, x) {
                    if (x.registrar == "godaddy.com") {
                        godaddy = true;
                    }
                });
                if (godaddy == true) {
                    $("#domain-info").append('<form name="LookupForm" action="http://www.anrdoezrs.net/interactive" method="GET"> <input id="domainsearch" type="text" name="domainToCheck" size="22" maxlength="67" tabindex="1" style="font-size:11px" value = "' + infoquery + '"> <input type="hidden" name="checkAvail" value="1"><input type="submit" name="submit" value="Buy Now!" tabindex="3" border="0" id = "buy-now-button"><input type="hidden" name="aid" value="10450071"/> <input type="hidden" name="pid" value="5524700"/> <input type="hidden" name="url" value="https://www.godaddy.com/gdshop/registrar/search.asp?isc=cjcdomsb2"/> </form>');
                }
            });
        }
        else if ($(this).hasClass("maybe") == true) {
            $("#domain-info").text("Might be available!");
        }
        else {
            $("#domain-info").text("Taken!");
        }

    });

    // hovering arrows
    $("#domains").delegate(".urls", "hover", function(event) {
        if (event.type == 'mouseenter') {
            $(".urls").each(function() {   
                $(this).css('background-image', '');
                // $(this).removeClass('hover1').addClass('hover0');
            });
            $(this).css('background-image', 'url(domain-arrow-grey.png)');
            // $(this).removeClass('hover0').addClass('hover1');
        }
        else {
            $(this).css('background-image', '');
            // $(this).removeClass('hover1').addClass('hover0');
        }
    });

    // search bar text + activate
	$("#word0").attr("value", "search...");
	$("#word1").attr("value", "search...");
	$("#word2").attr("value", "search...");	
	var text = "search...";

	$("#word0").focus(function() {
		$(this).addClass("active");
		if($(this).attr("value") == text) $(this).attr("value", "");
	});
	$("#word0").blur(function() {
		if($(this).attr("value") == "") {
			$(this).attr("value", text);
			$(this).removeClass("active");
		}
	});
	$("#word1").focus(function() {
		$(this).addClass("active");
		if($(this).attr("value") == text) $(this).attr("value", "");
	});
	$("#word1").blur(function() {
		if($(this).attr("value") == "") {
			$(this).attr("value", text);
			$(this).removeClass("active");
		}
	});
	$("#word2").focus(function() {
		$(this).addClass("active");
		if($(this).attr("value") == text) $(this).attr("value", "");
	});
	$("#word2").blur(function() {
		if($(this).attr("value") == "") {
			$(this).attr("value", text);
			$(this).removeClass("active");
		}
	});
	
});

// synonyms etc
function makeNames() {
	var group0 = [];
	if (document.getElementById('word0').value != 'search...') {
        group0.push([document.getElementById('word0').value, 0, -1]);
    }
	var group1 = [];
	if (document.getElementById('word1').value != 'search...') {
	    group1.push([document.getElementById('word1').value, 1, -1]);
    }
	var group2 = [];
	if (document.getElementById('word2').value != 'search...') {
	    group2.push([document.getElementById('word2').value, 2, -1]);
    }
    var type1 = [];
    var type2 = [];
    var result = [];
	var i = 0;
    while (i < 4) {
        if (document.getElementById('output0') != null && document.getElementById('output0').childNodes[i] != null) {
            group0.push([document.getElementById('output0').childNodes[i].innerHTML, 0, i]);
        }
        if (document.getElementById('output1') != null && document.getElementById('output1').childNodes[i] != null) {
            group1.push([document.getElementById('output1').childNodes[i].innerHTML, 1, i]);
        }
        if (document.getElementById('output2') != null && document.getElementById('output2').childNodes[i] != null) {
            group2.push([document.getElementById('output2').childNodes[i].innerHTML, 2, i]);
        }
        i++;
	}
	
	type1 = joinify(group0,group1).concat(joinify(group0,group2), joinify(group1, group2));
    permute(type1);
    type2 = buzzify(type1).concat(buzzify(group0.concat(group1, group2)));
    permute(type2);
    result = type1.slice(0, 8).concat(type2.slice(0, 4));
    permute(result);

    var output0 = document.getElementById('names0');
    var output1 = document.getElementById('names1');
    var output2 = document.getElementById('names2');
    while (output0.firstChild) {
        output0.removeChild(output0.firstChild);
    }
    while (output1.firstChild) {
        output1.removeChild(output1.firstChild);
    }
    while(output2.firstChild) {
        output2.removeChild(output2.firstChild);
    }
    i = 0;
    while (i < 12 && i < result.length) {
	    var div = document.createElement('span');
        div.innerHTML = result[i][0];
        div.setAttribute('class', 'created'); 
        div.addEventListener('mouseover', (function(i) {
            return function() {
                highlight(result[i][1], result[i][2], result[i][3], result[i][4]);
            };
        })(i));
        div.addEventListener('mouseout', (function(i) {
            return function() {
                unhighlight(result[i][1], result[i][2], result[i][3], result[i][4]);
            };
            })(i));
        if (i < 4) {
	        output0.appendChild(div);
        }
        else if (i < 8) {
            output1.appendChild(div);
        }
        else {
            output2.appendChild(div);
        }
	    i++;
    }
    $("#output").css("border-top", "1px dotted");
    $("#output").css("border-bottom", "1px dotted");
    document.getElementById('i-two').style.display = 'none';
    document.getElementById('step-two').style.display= 'none';
    if (document.getElementById('i-four').style.display == '') {
        document.getElementById('i-three').style.display = 'inherit';
        document.getElementById('step-three').style.display = 'inherit';
    }
}

function highlight(x1, x2, y1, y2) {
    var color1;
    var color2;
    switch (x1) {
        case 0:
            color1 = 'red';
            break;
        case 1:
            color1 = 'blue';
            break;
        case 2:
            color1 = 'green';
            break;
    }
    switch (y1) {
        case 0:
            color2 = 'red';
            break;
        case 1:
            color2 = 'blue';
            break;
        case 2:
            color2 = 'green';
            break;
    }
    if (x2 == -1) {
        var id = 'word' + x1;
        var word = document.getElementById(id);
        word.style.color = 'white';
    }
    else {
        var listname1 = 'output' + x1;
        var list1 = document.getElementById(listname1);
        list1.childNodes[x2].style.color = color1;
    }
    if (y2 == -1) {
        var id = 'word' + y1;
        var word = document.getElementById(id);
        word.style.color = 'white';
    }
    else {
        var listname2 = 'output' + y1;
        var list2 = document.getElementById(listname2);
        list2.childNodes[y2].style.color = color2;
    }
}
function unhighlight(x1, x2, y1, y2) {
    if (x2 == -1) {
        var id = 'word' + x1;
        var word = document.getElementById(id);
        word.style.color = 'black';
    }
    else {
        var listname1 = 'output' + x1;
        var list1 = document.getElementById(listname1);
        list1.childNodes[x2].style.color = 'black';
    }
    if (y2 == -1) {
        var id = 'word' + y1;
        var word = document.getElementById(id);
        word.style.color = 'black';
    }
    else {
        var listname2 = 'output' + y1;
        var list2 = document.getElementById(listname2);
        list2.childNodes[y2].style.color = 'black';
    }
}

function buzzify(array) {
    var len = array.length;
    var list = [];
    var prefix = ['re', 'pre'];
    var p = prefix.length;
    var suffix = ['ify', 'able', 'er', 'ible'];
    var s = suffix.length;
    var vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < p; j++) {
            var buzzword = prefix[j] + array[i][0];
            if (array[i].length > 3) {
                list.push([buzzword, array[i][1], array[i][2], array[i][3], array[i][4]]);
            }
            else {
                list.push([buzzword, array[i][1], array[i][2], array[i][1], array[i][2]]);
            }
        }
        for (var j = 0; j < s; j++) {
            if (vowels.indexOf(array[i][0][array[i][0].length-1]) != -1) {
                var buzzword = mash(array[i][0], suffix[j], 1, 1);
                if (buzzword.length < 15) {
                    if (array[i].length > 3) {
                        list.push([buzzword, array[i][1], array[i][2], array[i][3], array[i][4]]);
                    }
                    else {
                        list.push([buzzword, array[i][1], array[i][2], array[i][1], array[i][2]]);
                    }
                }
            }
            else {
                var buzzword = array[i][0] + suffix[j];
                if (buzzword.length < 15) {
                    if (array[i].length > 3) {
                        list.push([buzzword, array[i][1], array[i][2], array[i][3], array[i][4]]);
                    }
                    else {
                        list.push([buzzword, array[i][1], array[i][2], array[i][1], array[i][2]]);
                    }
                }
            }
        }
    }
    return list;
}

function insertify(array1, array2) {
}

function joinify(array1, array2) {
	var i = 0;
	var list = [];
	while (i < array1.length) {
		var j = 0;
		while (j < array2.length) {
			var k = 1;
			while (k < 6) {
				var mix1 = mash(array1[i][0], array2[j][0], k, Math.floor(k/2));
				var mix2 = mash(array2[j][0], array1[i][0], k, Math.floor((k-1)/2));
				if (mix1 != false && mix1.length < 15 && mix1 != array1[i][0]) {
					list.push([mix1, array1[i][1], array1[i][2], array2[j][1], array2[j][2]]);
				}
				if (mix2 != false && mix2.length < 15 && mix2 != array1[i][0]) {	
					list.push([mix2, array1[i][1], array1[i][2], array2[j][1], array2[j][2]]);
				}
				k++;
			}
		j++;
		}
	i++;
	}
	return list;
}				

function mash(word1, word2, len, err) {
	var len1 = word1.length;
	var len2 = word2.length;

    if (len > len1 || len > len2) {
        return false;
    }
    if (editDistance(word1.substring(len1 - len), word2.substring(0, len)) <= err) {
        if (len1 > len2) {
		    return word1.substring(0, len1 - len) + word2;
        }
        else {
            return word1 + word2.substring(len);
        }
	}
	else {
		return false;
	}
}		

function editDistance(word1, word2) {
    var len1 = word1.length;
    var len2 = word2.length;
    if (len1 != len2) {
        return false;
    }
    else {
        var i = 0;
        var err = 0;
        while (i < len1)
        {
            if(word1[i] != word2[i]) {
                err++;
            }
            i++;
        }
        return err;
    }
}

function getSynonym() {
    var word0 = document.getElementById('word0').value;
    var word1 = document.getElementById('word1').value;
    var word2 = document.getElementById('word2').value;
    var counter = 0;
    if (word0 == 'search...') {
        counter++;
    }
    if (word1 == 'search...') {
        counter++;
    }
    if (word2 == 'search...') {
        counter++;
    }
    if (counter > 1) {
        return;
    }
    var i = 0;
	while (i < 3) {
        var test = 'word' + i;
        if (document.getElementById(test).value != 'search...') {
		    makerequest(i);
        }
		i++;
    }
    document.getElementById('i-one').style.display = 'none';
    document.getElementById('step-one').style.display= 'none';
    if (document.getElementById('i-three').style.display == '')
    {
        document.getElementById('i-two').style.display = 'inherit';
        document.getElementById('step-two').style.display = 'inherit';
    }
}
	
function processResponse0(json){
var response = [];
var verbs = [];
var nouns = [];
var adjectives = [];
var adverbs = [];

if (json.verb != null) {
	verbs = json.verb.syn;
}
if (json.noun != null) {
	nouns = json.noun.syn;
}
if (json.adjective != null) {
	adjectives = json.adjective.syn;
}
if (json.adverb != null) {
	adverbs = json.adverb.syn;
}

response = response.concat(verbs, nouns, adjectives, adverbs);

var i = 0;
var container = document.getElementById('div0');
if (container.childNodes.length > 3) {
    container.removeChild(container.childNodes[3]);
}
var div = document.createElement('div');
div.setAttribute('class', 'output');
var list = document.createElement('ul');
list.setAttribute('id', 'output0');
list.addEventListener('click', (function() {
    makerequest(0);
    })
);

container.appendChild(div);
div.appendChild(list);

while (list.firstChild) {
    list.removeChild(list.firstChild);
}

response = response.filter(function(v) 
						   { return v.indexOf(' ') == -1; 
						   });

permute(response);

while (i < 4) {
    if (response[i] != null) {
	    var item = document.createElement('li');
	    item.innerHTML = response[i];
        list.appendChild(item);
    }
        i++;
    }
}

function processResponse1(json){
var response = [];
var verbs = [];
var nouns = [];
var adjectives = [];
var adverbs = [];
if (json.verb != null) {
	verbs = json.verb.syn;
}
if (json.noun != null) {
	nouns = json.noun.syn;
}
if (json.adjective != null) {
	adjectives = json.adjective.syn;
}
if (json.adverb != null) {
	adverbs = json.adverb.syn;
}

response = response.concat(verbs, nouns, adjectives, adverbs);

var i = 0;
var container = document.getElementById('div1');
if (container.childNodes.length > 3) {
    container.removeChild(container.childNodes[3]);
}
var div = document.createElement('div');
div.setAttribute('class', 'output');
var list = document.createElement('ul');
list.setAttribute('id', 'output1');
list.addEventListener('click', (function() {
    makerequest(1);
    })
);

container.appendChild(div);
div.appendChild(list);

while (list.firstChild) {
    list.removeChild(list.firstChild);
}

response = response.filter(function(v) 
						   { return v.indexOf(' ') == -1; 
						   });

permute(response);

while (i < 4) {
    if (response[i] != null) {
	    var item = document.createElement('li');
	    item.innerHTML = response[i];
	    list.appendChild(item);
    }
    i++;
	}
}
function processResponse2(json){
var response = [];
var verbs = [];
var nouns = [];
var adjectives = [];
var adverbs = [];
if (json.verb != null) {
	verbs = json.verb.syn;
}
if (json.noun != null) {
	nouns = json.noun.syn;
}
if (json.adjective != null) {
	adjectives = json.adjective.syn;
}
if (json.adverb != null) {
	adverbs = json.adverb.syn;
}

response = response.concat(verbs, nouns, adjectives, adverbs);

var i = 0;
var container = document.getElementById('div2');
if (container.childNodes.length > 3) {
    container.removeChild(container.childNodes[3]);
}
var div = document.createElement('div');
div.setAttribute('class', 'output');
var list = document.createElement('ul');
list.setAttribute('id', 'output2');
list.addEventListener('click', (function() {
    makerequest(2);
    })
);

container.appendChild(div);
div.appendChild(list);

while (list.firstChild) {
    list.removeChild(list.firstChild);
}

response = response.filter(function(v) 
						   { return v.indexOf(' ') == -1; 
						   });

permute(response);

while (i < 4) {
    if (response[i] != null) {
	    var item = document.createElement('li');
	    item.innerHTML = response[i];
	    list.appendChild(item);
    }
    i++;
	}
}

function permute(array) {
	var n = array.length - 1;
	while (n > 0) {
		var i = Math.floor(Math.random()*n);
		var temp  = array[n];
		array[n] = array[i];
		array[i] = temp;
		n--;
	}
}

function makerequest(x) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	var div = "word" + x;
	var request = 'http://words.bighugelabs.com/api/2/40868e50c339e2dcdaa54d041dffbf88/' + document.getElementById(div).value + '/json?callback=processResponse' + x; 
	script.type = 'text/javascript';
	script.src = request;
    script.onerror = 'processResponse' + x + '()';
	head.appendChild(script);
}
