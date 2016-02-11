var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var multer=require('multer');
var upload=multer({dest:'./files/'});
var fs=require('fs');
var PORT=3000;
app.use(bodyParser.json());
//app.configure(function(){
//app.use(express.methodOverride());
//
//});

app.post('/send',upload.single('files'),function(req,res) {
    //fs.renameSync(req.file.path,'files\\'+req.file.originalname);
    console.log(req.file);
    res.send(req.file);
});

app.use('/',express.static(__dirname+'/public'));
app.use('/fileupload',express.static(__dirname+'/public/fileupload.html'));

app.listen(3000,function(){
	console.log("Express started: "+PORT);
});
