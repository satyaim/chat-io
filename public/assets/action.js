function do_io(){
	url= "http://127.0.0.1:3000/chat/chat-screen/";
	socket= io.connect(url);
	typing= document.getElementById("typing");
}
function undo_text(){
	document.getElementById("input_message").value="";
}
function send_text(){
	socket.emit("chat",{
		message: document.getElementById("input_message").value,
		type: "text"
	});
	undo_text();
}


socket.on("chat", function(data){
	
});

function typing(){
	console.log("I'm typing");
	socket.emit("typing");
}

socket.on("typing", function(data){
	console.log("someone typed");
	typing.innerHTML="typing...";
});

function stopped(){
	console.log("Not Really");
	socket.emit("not_typing");
}

socket.on("not_typing", function(data){
	console.log("someone stopped");
	setTimeout(function(){typing.innerHTML = '';},2000);
});
