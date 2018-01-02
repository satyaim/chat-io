var	url= "http://127.0.0.1:3000/";
var	typing= document.getElementById("typing");
var socket= io.connect(url);
var id;
socket.on('connect', function(){
	id=socket.id;
	console.log(id);
});

function undo_text(){
	document.getElementById("input_message").value="";
}
function send_text(){
	socket.emit("chat",{
		message: document.getElementById("input_message").value,
		sender: id,
		type: "text"
	});
	var tmp = document.getElementById("right-template"); //template
	var box = document.getElementById("chat-box");  
	box.insertBefore(tmp.content.cloneNode(true),box.getElementsByClassName("null")[0]);
	var right= box.getElementsByClassName("null")[0].previousElementSibling;
	right.getElementsByClassName("right-text-span")[0].innerHTML=document.getElementById("input_message").value+'<br/><span class="right-text-time">00:00</span>';
	undo_text();
	gotoBottom("chat-box");
}

function typing_text(){
	console.log("I'm typing");
	socket.emit("typing");
}

socket.on("chat", function(data){
	if(data.sender==id){
		console.log("sent");
	}
	else{
		var tmp = document.getElementById("left-template"); //template
		var box = document.getElementById("chat-box");  
		box.insertBefore(tmp.content.cloneNode(true),box.getElementsByClassName("null")[0]);
		var left= box.getElementsByClassName("null")[0].previousElementSibling;
		left.getElementsByClassName("left-text-span")[0].innerHTML=data.message+'<br/><span class="right-text-time">00:00</span>';
		undo_text();
		gotoBottom("chat-box");
	}
});


socket.on("typing", function(data){
	console.log("someone typed");
	document.getElementById("typing").innerHTML="typing...";
});

function stopped(){
	console.log("Not Really");
	socket.emit("not_typing");
}

socket.on("not_typing", function(data){
	console.log("someone stopped");
	setTimeout(function(){document.getElementById("typing").innerHTML = '';},2000);
});

function gotoBottom(id){
   var element = document.getElementById(id);
   element.scrollTop = element.scrollHeight - element.clientHeight;
}
