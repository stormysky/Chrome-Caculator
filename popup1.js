var callist = [];
var showlist = [];

var showStr = document.getElementById("progress");
var resultStr = document.getElementById("resultStr");
var list = document.getElementsByTagName("li");
var buttons = document.getElementsByClassName("button");

var l1 = ["√","Sin","Cos","Tan","Ln"];
var l2 = ["^"];
var l3 = ["*","/"];
var l4 = ["+","-"];

var clearFlag = false;
for (var i = 0; i < list.length; i++) {
	list[i].onclick = function(){log(this)};
	list[i].onmousedown = function(){MouseDown(this)};
	list[i].onmouseup = function(){MouseUp(this)};

}

function log(obj){

	var text = obj.innerHTML;
	if(clearFlag) {clearList();clearFlag=false;}
	if(text == "Ac"){
		clearList();
		resultStr.innerHTML = 0;
	}
	else if(text == "← "){
		showlist.pop();
	}
	else if(text == "="){
		callist = showlist.concat();
		var x = cal();
		resultStr.innerHTML = x;
		clearFlag = true;
	}
	else{
		showlist.push(text);
	}
	showSome();
}

function showSome(){
	showStr.innerHTML = showlist.join("");

}
function MouseDown(obj){
	var str = obj.getAttribute("class");
	obj.setAttribute("class",str + " mousedown");
}

function MouseUp(obj){
	var str = obj.getAttribute("class");
	obj.setAttribute("class",str.slice(0,str.indexOf("mousedown")));
}

function cal(){
	var temp = [];
	var single = "";
	for (var i = 0; i < callist.length; i++) {
		if(callist[i] == "π")
			callist[i] = Math.PI;

		if(callist[i] == "e")
			callist[i] = Math.E;

		if(isInt(callist[i]) || callist[i] == "."){
			single+=callist[i];
			if(i == callist.length -1){
				temp.push(single);
				single = "";
			}
		}
		else{
			if(callist[i] == "+" || callist[i] == "-"){
				if(i == 0 || !isInt(callist[i-1])){
					single = callist[i] + single;
					continue;
				}
			}
			if(single == ""){
				temp.push(callist[i]);
			}
			else{
				temp.push(single);
				single = "";
				temp.push(callist[i]);
			}
		}
	}
	callist = temp;
	console.log(callist);
	return brackets(callist);
	// return eval(callist.join("")); //插件中无法使用
}

function TurnToOne(str){
	var pn = 1;
	var one;
	for (var i = 0; i < str.length-1; i++) {
		if(str[i] == "-")
			pn = pn *-1;
	}
	one = str[str.length-1]*pn;
	return one;
}

function brackets(calobj){
	var start=-1,end=-1;

	for(var i = 0; i < calobj.length; i++){
		if(calobj[i] == "(")
			start = i;
		if(calobj[i] == ")"){
			end = i;
			break;
		}
	}
	if(start == -1 || end == -1){
		if(start == end){
			 calculate_l1(calobj,0,calobj.length-1);
			 return calobj[0];
		}
		else{
			return false;
		}
	}
	else if(start < end){
		calobj.splice(end,1);
		calobj.splice(start,1);
		if(calobj.length > 1)
			brackets(calculate_l1(calobj,start,end-2));
	}

	calculate_l1(calobj,0,calobj.length-1);
	return calobj[0];
}

function calculate_l1(obj,l,r){
	var operator;
	for (var i = l; i <= r; i++) {
		if(l1.indexOf(obj[i]) > -1){
			if(i == r){
				return false;
			}
			else if(!isNum(obj[i+1])){
				return false;
			}
			obj.splice(i,2,calTwo(obj[i])(obj[i+1]));
			r = r-1;
		}
	}
	return calculate_l2(obj,l,r); 
}

function calculate_l2(obj,l,r){
	var operator;
	for (var i = l; i <= r; i++) {
		if(l3.indexOf(obj[i]) > -1){
			if(i == l || i == r || !isNum(obj[i-1]) || !isNum(obj[i+1])){
				return false;
			}
			obj.splice(i-1,3,calThree(obj[i])(obj[i-1],obj[i+1]));
			r = r-2;
			i = 0;
		}
	}
	return calculate_l3(obj,l,r);
}

function calculate_l3(obj,l,r){
	var operator;
	for (var i = l; i <= r; i++) {
		if(l4.indexOf(obj[i]) > -1){
			if(i == l || i == r || !isNum(obj[i-1]) || !isNum(obj[i+1])){
				return false;
			}
			obj.splice(i-1,3,calThree(obj[i])(obj[i-1],obj[i+1]));
			r = r-2;
			i = 0;
		}
	}
	return obj;
}

function calTwo(operator){
	switch(operator){
		case"√":return Math.sqrt;break;
		case"Sin":return function(x){return roundPow(Math.sin(x/180*Math.PI));};break;
		case"Cos":return function(x){return roundPow(Math.cos(x/180*Math.PI));};break;
		case"Tan":return function(x){return roundPow(Math.tan(x/180*Math.PI));};break;
		case"Ln":return Math.log;break;
		default:return "error";
	}
	return "error";
}
function calThree(operator){
	switch(operator){
		case"+":return function(l,r){return parseFloat(l)+parseFloat(r);};break;
		case"-":return function(l,r){return parseFloat(l)-parseFloat(r);};break;
		case"*":return function(l,r){return roundPow(l*r);};break;
		case"/":return function(l,r){return roundPow(l/r);};break;
		case"^":return Math.pow(l,r);break;
		default:return "error";
	}
	return "error";
}

function isNum(num){
	return !isNaN(Number(parseFloat(num)));
}

function isInt(num){
	return /^-?\d+$/.test(num);
}

function clearList(){
	resultStr.innerHTML = "";
	showlist = []; 
}

function roundPow(num){
	var precise = 14;
	return Math.round(num*Math.pow(10,precise))/Math.pow(10,precise);
}