var express=require('express');
var app=express();
var multer=require('multer');
var upload=multer({dest:'./files/'});
var fs=require('fs');
var PORT=3000;
var methods=require('./fileMethods.js');

app.post('/send',upload.single('files'),methods.uploadFile);	

app.use('/fileupload',express.static(__dirname+'/public/fileupload.html'));
app.use('/',express.static(__dirname+'/public'));

app.listen(3000,function(){
	console.log("Express started: "+PORT);
});
