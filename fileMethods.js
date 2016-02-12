var fs=require('fs');
module.exports={
	uploadFile:function uploadFile(req,res) {
		fs.rename(req.file.path,'files\\'+req.file.originalname,function(error){
			if(error){
				res.send("Failed")
			}else{
				res.redirect("/fileupload"); 
			}	
		}); 
	}
};

