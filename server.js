var express=require('express');
var app=express();
var multer=require('multer');
var upload=multer({dest:'./files/'});
var fs=require('fs');
var cookieSession=require('cookie-session');
var PORT=3000;
var bodyParser=require('body-parser');	
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cookieSession({name:'session',
		keys:['key1','key2']}));
var mysql=require('mysql');
var mkdirp=require('node-mkdirp');

var connection = mysql.createConnection({
  host: 'localhost',
  user     : 'root',
  password : '',
  database : 'project'
});

function checkAuth(req, res, next) {
	console.log(req.session.user_id+" "+req.params.student_id);
  if (!req.session.user_id || req.params.student_id!==req.session.user_id) {
    res.redirect("/");
  } else {
    next();
  }
}

function deleteFile(path){
	fs.stat(path,function(err,stats){
		if(stats.isFile()){
			fs.unlink(path,function(err){
				if(err)
					throw err;
				});
		}
	});
}

function convertToRoman(number){
	if(number==1){
		return 'I';
	}else if(number==2){
		return 'II';
	}else if(number==3){
		return 'III';
	}else if(number==4){
		return 'IV';
	}else if(number==5){
		return 'V';
	}else if(number==6){
		return 'VI';
	}else if(number==7){
		return 'VII';
	}else{
		return 'VIII';
	}
}

app.post('/send',upload.single('files'),function (req,res) {
		if (req.file.mimetype!=="application/pdf"){
				deleteFile(req.file.path);			
				res.redirect("/fileupload");
				res.end();
		}else{
			
			var query="SELECT course_name,(sem_dept_id%8) as sem FROM courses WHERE course_id=?";
			var path='./files/141070098/';			
			connection.query(query,[req.body.subject],function(err,result){
				path+=convertToRoman(result[0].sem)+'/'+result[0].course_name+'/';
				mkdirp(path);
				fs.rename(req.file.path,path+req.file.originalname,function(error){
					if(error){
						deleteFile(req.file.path);
						setTimeout(function(){
						    res.redirect('/studentpage.html');	
						},1000);
					}else{
						var query="INSERT INTO submissions (student_id,file_path,practical_id,date) VALUES (?,?, "+
								   "(SELECT id FROM practicals WHERE course_id=? and practical_no=?),?)";		
						connection.query(query,['141070098',path+req.file.originalname,req.body.subject,req.body.practicalNumber,new Date()],function(err,result){
							if(err){
								deleteFile(path+req.file.originalname);			
							}else{
								setTimeout(function(){
									res.redirect('/studentpage.html');	
								},1000);
							}
						});
					}	
				});	
			});
		
		}
});

app.get('/logout',function(req,res){
	if(req.session!==null){
		req.session=null;
	}
	res.redirect('/');
});

app.post('/register',function (req,res){
	var query='INSERT INTO student(id,password,first_name,last_name,sem_dept_id) VALUES (?,?,?,?,'+
		'(SELECT id FROM sem_dept where semester=? AND department=?))';
	
	connection.query(query,[req.body.registrationNumber,req.body.password,req.body.firstName,req.body.lastName,req.body.semester,req.body.branch], function(err, rows) {
		  if (err){
		  	res.json("Already Registered");
		  }else{
		  	mkdirp('./files/'+req.body.registrationNumber+'/'+convertToRoman(req.body.semester));
	  	  	res.json(rows);	
		  }
		  
	});	
});

app.post('/login',function (req,res){
	
	connection.query('SELECT password FROM `student` where id=?',[req.body.registrationNumber], function(err, rows) {
	  if (err) throw err;
	  if(rows.length===0){
	  	 res.json("No such user exists");
	  }else{
	  	if(rows[0].password===req.body.password){
	  		 req.session.user_id=req.body.registrationNumber;
	  		 res.json("Logged In");	
	  	}else{
		  	 res.json("Failed to Login");
	    }	
	  }
	});
});

app.post('/teacherlogin',function (req,res){

	connection.query('SELECT password FROM `teacher` where id=?',[req.body.registrationNumber], function(err, rows) {
	  if (err) throw err;
	  if(rows.length===0){
	  	res.json("No such user exists");
	  }else{
	  	if(rows[0].password===req.body.password){
	  		 req.session.teacher_id=req.body.registrationNumber;
	  		 res.json("Logged In");	
	  	}else{
		  	 res.json("Failed to Login");
	    }	
	  }
	});
});
app.post('/update/:practical_id&:student_id&:marks',function(req,res){
	var query='UPDATE submissions SET marks=? WHERE practical_id=? AND student_id=?';
	connection.query(query,[req.params.marks,req.params.practical_id,req.params.student_id],function(err,rows){
		if(err){
			res.json('err');
		}else{
			res.json(rows);
		}
	});
});

app.get('/results/:course_id&:practical_number&:filter',function(req,res){
	var filter=" ";
	if(req.params.filter==="Unchecked"){
		filter=" AND marks=0 ";
	}else if(req.params.filter==="Checked"){
		filter=" AND marks>0 ";
	}
	// var query="SELECT student_id,file_path,marks,date,practical_id FROM submissions WHERE practical_id= "+
	// 	"(SELECT id FROM practicals WHERE course_id=? AND practical_no=?)"+filter+" ORDER BY student_id";
	var query="SELECT practical_id,submission_date,student_id,date,file_path,marks FROM practicals,submissions WHERE course_id=? AND practical_no=? AND id=practical_id "+filter+" ORDER BY student_id;"
	connection.query(query,[req.params.course_id,req.params.practical_number],function(err,rows){
		if(err) 
			throw err;
		res.json(rows);
	});
});

app.get('/notifications/:student_id',checkAuth,function(req,res){
	var query="SELECT id as practical_id,practicals.course_id,course_name,practical_no,submission_date "+
		" FROM practicals,courses WHERE practicals.course_id IN (SELECT distinct(course_id) FROM `courses` "+ 
				" WHERE sem_dept_id IN (SELECT sem_dept_id FROM student WHERE id=?))"+
				" AND id NOT IN (SELECT practical_id FROM submissions "+
                " WHERE student_id=?) AND courses.course_id=practicals.course_id ";
    connection.query(query,[req.params.student_id,req.params.student_id],function(err,rows){
    	if(err){
    		throw err;
    	}else{
    		res.json(rows);
    	}
    });

});

app.get('/practicals/:course_id&:student_id',function(req,res){
	var query='SELECT `practical_count`, MAX(`practical_no`) as `practical_number` FROM `courses`'+
	'join practicals on courses.course_id=practicals.course_id '+ 
	'join submissions on practical_id=practicals.id WHERE courses.course_id=?  AND submissions.student_id=?';
	
	var query1='SELECT id,practical_no FROM practicals WHERE course_id=? AND id NOT IN (SELECT practical_id FROM submissions WHERE student_id=?)';
	connection.query(query1,[req.params.course_id,req.params.student_id], function(err, rows) {
	  
	  if(err){
	  	return res.json(err);
	  }

	  if(rows.length===0){
	  	return res.json("No Practicals");
	  }else{
	  	return res.json(rows);
	  }
	});
});

app.get('/subjects/:teacher_id',function(req,res){
	var query='SELECT course_name,course_id FROM `courses` where teacher_id=?';
	connection.query(query,[req.params.teacher_id], function(err, rows) {
	  
	  if(err){
	  	return res.json("Error Occured, Try Later");
	  }

	  if(rows.length===0){
	  	return res.json("No Subjects");
	  }else{
	  	return res.json(rows);
	  }
	});
});

app.get('/sub_cnt/:teacher_id',function(req,res){
	var query="SELECT course_name,course_id,practical_count FROM courses WHERE teacher_id=?";
	connection.query(query,[req.params.teacher_id],function(err,rows){
		if(err){
			res.json('err');
		}else{
			if(rows.length===0){
				res.json('NO Subjects');
			}else{
				res.json(rows);	
			}
		}
	});
});

app.get('/practicalresults/:student_id&:course_id',function(req,res){
	var query="SELECT C.course_name as name,P.practical_no as pracNumber,S.marks as marks "+
			"FROM courses as C,practicals as P,submissions as S "+
			"WHERE S.student_id=? AND S.practical_id=P.id AND P.course_id=? "+
			"AND C.course_id=? ";
	connection.query(query,[req.params.student_id,req.params.course_id,req.params.course_id],function(err,rows){
		if(err){
			res.send(err);
		}else{
			res.json(rows);
		}
	});
});

app.get('/practicalcount/:course_id',function(req,res){
	var query="SELECT practical_count FROM courses where course_id=?";
	connection.query(query,[req.params.course_id], function(err, rows) {
	  
	  if(err){
	  	return res.json("Error Occured, Try Later");
	  }

	  if(rows.length===0){
	  	return res.json("No Practical");
	  }else{
	  	return res.json(rows);
	  }
	});
});

app.get('/semsubjects/:student_id',function(req,res){
	var query='SELECT course_id,course_name FROM courses '+
	'WHERE sem_dept_id=(SELECT sem_dept_id FROM student where id=?)';
	connection.query(query,[req.params.student_id], function(err, rows) {
	  if (err) throw err;
	  	res.json(rows);
	});
});

app.post('/practical',function(req,res){
	var query="INSERT INTO practicals (submission_date,question,course_id,practical_no) "+
	"SELECT ?,?,course_id,(practical_count+1) FROM courses where course_id=? ";
	connection.query(query,[req.body.submissionDate,req.body.question,req.body.course], function(err, result) {
	  if (err){
	  	res.json({'code':'Error'});
	  }else{
	  	updatePractical();
	  	res.json({'code':'Success'});
	  }
	});
			
	function updatePractical(){
		  var query='UPDATE courses SET practical_count=practical_count+1 WHERE course_id=?';
		  connection.query(query,[req.body.course], function(err, rows) {
			  if (err) throw err;
		});
	}	
});

app.get('/asset/:file_path', function(req, res){
  var tempFile=req.params.file_path;
  // console.log("Paramter---"+tempFile);
  tempFile=tempFile.split('_').join('/');
  // console.log(tempFile);
  fs.readFile(tempFile, function (err,data){
     res.contentType("application/pdf");
     res.send(data);
  });
});

app.use('/fileupload',express.static(__dirname+'/public/fileupload.html'));
// app.use('/registerform',express.static(__dirname+'/public/registerform.html'));
// app.use('/loginform',express.static(__dirname+'/public/loginform.html'));
app.use('/practicalform',express.static(__dirname+'/public/practicalform.html'));
app.use('/checkingpage',express.static(__dirname+'/public/checkingpage.html'));
app.use(express.static(__dirname+'/public/images'));
app.use('/',express.static(__dirname+'/public'));

app.listen(3000,function(){
	console.log("Express started: "+PORT);
});
