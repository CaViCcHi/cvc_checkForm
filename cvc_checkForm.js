/*
	$Header: /usr/local/cvsroot/cavicchi.net/elements/scripts/cvc_checkForm.js,v 1.3 2009/10/28 22:23:06 matteo Exp $

	CaViCcHi check Form: Copyright 2008 - NOW()

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

	=== New in 1.4 - 2010
	- Added override message: CVC_mFields_overrideMsg

	=== New in 1.3 - 2009
	- Added minMaxFloat
	- Added background Change AFTER|BEFORE

	=== New in 1.2 - 2009/03/17:
	- Added the field CVC_mFields_customMsg['XXX'] value of which will be shown as ERROR message in case an action won't be valid [NOT valid for STRCMP], syntax: CVC_mFields_customMsg['FIELD_NAME(str)']
	
	=== New in 0.8.3 - 2009/02/17:
	- Added val function, check if the result is NOT 0
	- Added ext function, check the extensions in a file field and compare them to the array inside CVC_mFields_extForFiles and show the message CVC_mFields_msgForFiles

	=== New in 0.8.2 - 2008/12/10:
	- Added @ support, check if is evalued

	=== New in 0.8.1 - 2008/10/18:
	- Added support nested for radiobutton check

*/
function CVCmFieldsCheck(formname){
	var problems = '';
	var mailExp = new RegExp("^[a-zA-Z0-9.\+_\-]{1,}\@[a-zA-Z0-9\-.]{2,}\\.[a-zA-Z.]{1,}$");
	var isNumeric = new RegExp("^[0-9]{1,}$");
	var isFloat = new RegExp("^[0-9.]{1,}$");
	var tmpBorder = Array();
	var tmpBackground = Array();

	if(eval(document.forms[formname].elements['CVC_mFields_border'])){
		tmpBorder = document.forms[formname].elements['CVC_mFields_border'].value.split("|");
		var enableBorder = true;
		var beforeBorder = Array();
		var afterBorder = Array();
	        beforeBorder = tmpBorder[1].split(",");
	        afterBorder = tmpBorder[0].split(",");
	}else if(eval(document.forms[formname].elements['CVC_mFields_background'])){
		tmpBackground = document.forms[formname].elements['CVC_mFields_background'].value.split("|");
		var enableBackground = true;
		var beforeBackground = Array();
		var afterBackground = Array();
	        beforeBackground = tmpBackground[1];
	        afterBackground = tmpBackground[0];
	}else{
		var enableBorder = false;
	}

	if(document.forms[formname].elements['CVC_mFields'].value.length > 2){
	        var fieldsType = Array();
	        var functions = Array();
	        var tmpStuff = Array();
	        var tmpElements = Array();
	        var tmpExtensions = Array();
	        var tmpVals = Array();
		var skipThisIfNotEval=false;
	        fieldsType = document.forms[formname].elements['CVC_mFields'].value.split("*");
	        //alert(fieldsType);
	 	for(j=0;j<fieldsType.length;j++){
                        tmpStuff = fieldsType[j].split("|",2);

			tmpElements = tmpStuff[1].split(",");
			if(tmpElements.length < 1){
				problems = "ERROR: Configuration for section "+tmpStuff[0];
				return false;
			}
                        if(isNumeric.test(tmpStuff[0])){
			 	for(k=0;k<tmpElements.length;k++){
					if(tmpElements[k].substr(0,1) == "@"){ tmpElements[k]=tmpElements[k].substr(1); skipThisIfNotEval=true;}
					var newString = tmpElements[k].replace("form_","");
					if(!eval(document.forms[formname].elements[tmpElements[k]])){ alert("Error: Are you sure about this item: '"+tmpElements[k]+"'?\ncause I am really not sure it is part of the form...");return false;}
					if(document.forms[formname].elements[tmpElements[k]].value == undefined && document.forms[formname].elements[tmpElements[k]].length != undefined){
					        var checkRadio = false;
						for(g=0;g<document.forms[formname].elements[tmpElements[k]].length;g++){ //This is a radio Button so I will just check his evaluation
						        if(document.forms[formname].elements[tmpElements[k]][g].checked){
						                checkRadio = true;
						                break;
						        }
						}
						if(checkRadio == false){
						        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
					        		problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
					        	}else{
								problems += '- Missing ' + newString.replace("_"," ")+'\n';
							}
						}
					}else if(document.forms[formname].elements[tmpElements[k]].value.length < tmpStuff[0] && (document.forms[formname].elements[tmpElements[k]].value.length != 0 || !skipThisIfNotEval)){
					        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
					        	problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
					        }else{
			                                if(!eval(document.forms[formname].elements['CVC_mFields_giveInfoFields'])){
								problems += '- ' + newString.replace("_"," ") + ' should be at least '+tmpStuff[0]+' characters\n';
							}else{
								problems += '- Missing ' + newString.replace("_"," ")+' \n';
							}
						}
						if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
						if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
					}
					skipThisIfNotEval=false;
					newString=null;
				}
				tmpElements=Array();
			}else{
			        switch(tmpStuff[0]){
                        	        case 'email': // Check email integrity *email|form_email1,form_email2...form_emailN
                        	        	for(k=0;k<tmpElements.length;k++){
                        	        		if(!mailExp.test(document.forms[formname].elements[tmpElements[k]].value)){
								if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
					        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
					        		}else{
									problems += '- Invalid E-mail format\n';
								}
								if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
								if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
							}
						}
                        	        break;
                        	        case 'strcmp': // Compare between 2 strings *strcmp|form_str1,form_str2
						var newString = tmpElements[0].replace("form_","");
						var newString1 = tmpElements[1].replace("form_","");
                        	        		if(document.forms[formname].elements[tmpElements[0]].value != document.forms[formname].elements[tmpElements[1]].value){
								problems += '- The fields ' + newString.replace("_"," ") + ' and ' + newString1.replace("_"," ") + ' don\'t match!\n';
								if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[0]],beforeBorder,afterBorder);
								if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[1]],beforeBorder,afterBorder);
								
								if(enableBackground)giveFocus(document.forms[formname].elements[tmpElements[0]],beforeBackground,afterBackground);
								if(enableBackground)giveFocus(document.forms[formname].elements[tmpElements[1]],beforeBackground,afterBackground);
							}
                        	        break;
                        	        case 'val':
                        	        	for(k=0;k<tmpElements.length;k++){
                        	        		if(document.forms[formname].elements[tmpElements[k]].type == 'checkbox'){
	                        	        		if(!document.forms[formname].elements[tmpElements[k]].checked){
	                        	        			var newString = tmpElements[k].replace("form_","");
	                        	        		        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
						        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
						        		}else{
										problems += '- ' + newString.replace("_"," ")+' must be selected\n';
									}
									if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
									if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
								}
                        	        		}else{
	                        	        		if(parseInt(document.forms[formname].elements[tmpElements[k]].value)==0){
	                        	        			var newString = tmpElements[k].replace("form_","");
	                        	        		        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
						        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
						        		}else{
										problems += '- ' + newString.replace("_"," ")+' incorrect\n';
									}
									if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
									if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
								}
							}
						}
                        	        break;
                        	        case 'radiock':
                        	        	for(k=0;k<tmpElements.length;k++){
                        	        	var rc = false;
	                        	                for (c=0;c<document.forms[formname].elements[tmpElements[k]].length;c++){
								if(document.forms[formname].elements[tmpElements[k]][c].checked){rc = true;}
							}
							if(!rc){
                        	        			var newString = tmpElements[k].replace("form_","");
                        	        		        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
					        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
					        		}else{
									problems += '- ' + newString.replace("_"," ")+' must be selected\n';
								}
							}
						}
                        	        break;
                        	        case 'ext':
                        	        	tmpExtensions = document.forms[formname].elements['CVC_mFields_extForFiles'].value.split(",");
						var errorSentence = document.forms[formname].elements['CVC_mFields_msgForFiles'].value+'\n';
                        	        	for(k=0;k<tmpElements.length;k++){
							extension_found:
                        	        		do{
                        	        			for(l=0;l<tmpExtensions.length;l++){
		                        	        		if(document.forms[formname].elements[tmpElements[k]].value.substring(parseInt(document.forms[formname].elements[tmpElements[k]].value.length - tmpExtensions[l].length)) == tmpExtensions[l]) break extension_found;
								}
								var newString = tmpElements[k].replace("form_","");
								problems += '- Upload error: ' + newString.replace("_"," ") + ', ' + errorSentence + ' \n';
								if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
								if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
							}while(0);
						}
                        	        break;
                        	        case 'minMaxFloat':
                        	        	for(k=0;k<tmpElements.length;k++){
                        	        		do{
                        	        			var newString = tmpElements[k].replace("form_","");
                        	        			tmpVals = document.forms[formname].elements["CVC_mFields_minMaxFloat['"+tmpElements[k]+"']"].value.split("|");
	                        	        		if(parseFloat(document.forms[formname].elements[tmpElements[k]].value) >= parseFloat(tmpVals[0])){
									if(isFloat.test(tmpVals[1])){
										if(!(parseFloat(document.forms[formname].elements[tmpElements[k]].value) <= parseFloat(tmpVals[1]))){
											if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
								        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
								        		}else{
			                        	        				problems += '- Error ' + newString.replace("_"," ") + '\n';
			                        	        			}
											if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
											if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
									        }
									}
	                        	        		}else{
	                        	        		        if(eval(document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"])){
						        			problems += "- " + document.forms[formname].elements["CVC_mFields_customMsg['"+tmpElements[k]+"']"].value+'\n';
						        		}else{
	                        	        				problems += '- Wrror ' + newString.replace("_"," ") + '\n';
	                        	        			}
									if(enableBorder)giveFocus(document.forms[formname].elements[tmpElements[k]],beforeBorder,afterBorder);
									if(enableBackground)giveBg(document.forms[formname].elements[tmpElements[k]],beforeBackground,afterBackground);
	                        	        		}
								tmpVals = Array();
							}while(0);
						}
                        	        break;
                        	        default:
                        	                problems += "WARNING: What is "+tmpStuff[0]+"??\n";
                        	        break;
                        	}
			}
		}
	}
	// Too Dangerous
	/*
	if(document.forms[formname].elements['CVC_mFields_addFunctions'].value.length > 2){ // function1,function2,function3...functionN
		functions = document.forms[formname].elements['CVC_mFields_addFunctions'].value.split(",");
		for(j=0;j<functions.length;j++){
		        eval(functions[j]);
		}
	}
	*/

	if(problems.length > 0){
	        if(eval(document.forms[formname].elements["CVC_mFields_overrideMsg"])){
	                alert(document.forms[formname].elements["CVC_mFields_overrideMsg"].value);
	        }else{
			alert(problems);
		}
		return false;
	}
	return true;
}
function deFocus(obj,beforeBorder){
	//obj.setAttribute("style",beforeBorder[0]+":"+beforeBorder[1]+"px solid #"+beforeBorder[2]); // Doesn't work on IE!
	var tmpVal = beforeBorder[1]+"px solid #"+beforeBorder[2];
	if(beforeBorder[0]=='all'){
	        var border="border";
	}else{
		var border="border"+_ucfirst(beforeBorder[0]);
	}
	eval("obj.style."+border+"='"+tmpVal+"'");
	obj.onfocus = function(){};
}
function giveFocus(obj,beforeBorder,afterBorder){
	//obj.setAttribute("style",afterBorder[0]+":"+afterBorder[1]+"px solid #"+afterBorder[2]); // Doesn't work on IE!
	var tmpVal = afterBorder[1]+"px solid #"+afterBorder[2];
	if(afterBorder[0]=='all'){
	        var border="border";
	}else{
		var border="border"+_ucfirst(afterBorder[0]);
	}
	eval("obj.style."+border+"='"+tmpVal+"'");
	obj.onfocus = function(){deFocus(obj,beforeBorder)};
}

function giveBg(obj,beforeBackground,afterBackground){
	var tmpVal = "#"+afterBackground;
	eval("obj.style.backgroundColor='"+tmpVal+"'");
	obj.onfocus = function(){deBg(obj,beforeBackground)};
}
function deBg(obj,beforeBackground){
	var tmpVal = "#"+beforeBackground;
	eval("obj.style.backgroundColor='"+tmpVal+"'");
	obj.onfocus = function(){};
}
/* His Functions */
function _ucfirst(str) {
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1, str.length-1);
}