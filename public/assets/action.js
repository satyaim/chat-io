// number of messages sent
var send_count=0;
// url to connect socket to
var	url= "http://127.0.0.1:3000/";
// element where to show if typing or not
var	typing= document.getElementById("typing");
// make socket connection
var socket= io.connect(url);
// initially undefined id
var id;
// socket id upon connection/re-connection
socket.on('connect', function(){
	id=socket.id;
	console.log(id);
});
// empty text input area
function undo_text(){
	document.getElementById("input_message").value="";
}
// send text / send message, sender id, type, message_count of sender
function send_text(){
	if(document.getElementById("input_message").value){
		socket.emit("chat",{
			message: document.getElementById("input_message").value,
			sender: id,
			type: "text",
			send_count: send_count
		});
		// template for sender message || right
		var tmp = document.getElementById("right-template");
		var box = document.getElementById("chat-box");
		// insert new right message into chatbox  
		box.insertBefore(tmp.content.cloneNode(true),box.getElementsByClassName("null")[0]);
		var right= box.getElementsByClassName("null")[0].previousElementSibling;
		right.getElementsByClassName("right-text-span")[0].innerHTML=document.getElementById("input_message").value+'<br/><span class="right-text-time">00:00</span>';
		// change class name of chat-bubble- element || initially nothing || to identify by send_count
		y=right.getElementsByClassName("chat-bubble- material-icons")[0];
		y.classList.remove('chat-bubble-');
		y.classList.add('chat-bubble-'+send_count);
		undo_text();
		gotoBottom("chat-box");
		send_count++;
	}
}

function typing_text(){
	console.log("I'm typing");
	socket.emit("typing");
}

socket.on("chat", function(data){
	// I sent the message => message has been been sent => identified by my own send_count => show chat bubble icon
	if(data.sender==id){
		console.log("sent");
		console.log(data.send_count);
		document.getElementsByClassName('chat-bubble-'+data.send_count)[0].innerHTML="chat_bubble_outline";
	}
	// Someone else sent message
	else{
		// I recieved message, let the user know
		socket.emit("recieved",{
		sender: data.sender,
		type: "text",
		send_count: data.send_count
		});
		// template for recieved message
		var tmp = document.getElementById("left-template");
		var box = document.getElementById("chat-box");  
		// insert new message in chat-box
		box.insertBefore(tmp.content.cloneNode(true),box.getElementsByClassName("null")[0]);
		var left= box.getElementsByClassName("null")[0].previousElementSibling;
		left.getElementsByClassName("left-text-span")[0].innerHTML=data.message+'<br/><span class="right-text-time">00:00</span>';
		gotoBottom("chat-box");
	}
});


socket.on("typing", function(data){
	// broadcast recieved
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

socket.on("recieved", function(data){
	// Someone recieved someone's message
	if(id==data.sender){
		//Someone recieved my message
		setTimeout(function(){document.getElementsByClassName('chat-bubble-'+data.send_count)[0].innerHTML="chat_bubble";},100);
	}
});