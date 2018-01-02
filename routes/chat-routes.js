const router= require("express").Router();
router.get("/chat-screen",function(req,res){
	res.sendFile("./public/assets/chat-screen.html",{root: './'});
});
module.exports= router;

