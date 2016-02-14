var express=require('express');
var app=express();
var multer=require('multer');
var upload=multer({dest:'./files/'});
var fs=require('fs');
var PORT=3000;
var bodyParser = require('body-parser');	
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/send',upload.single('files'),function (req,res) {
		fs.rename(req.file.path,'files\\'+req.file.originalname,function(error){
			if(error){
				res.send("Failed");
			}else{
				res.send(JSON.stringify(req.body)+JSON.stringify(req.file.originalname));
			}	
		}); 
});	

app.post('/register',function (req,res){
	res.send(req.body);
});
app.post('/login',function (req,res){
	res.send(req.body);
});

app.use('/fileupload',express.static(__dirname+'/public/fileupload.html'));
app.use('/registerform',express.static(__dirname+'/public/registerform.html'));
app.use('/loginform',express.static(__dirname+'/public/loginform.html'));
app.use('/',express.static(__dirname+'/public'));

app.listen(3000,function(){
	console.log("Express started: "+PORT);
});
