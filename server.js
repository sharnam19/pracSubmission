var express=require('express');
var app=express();
var multer=require('multer');
var upload=multer({dest:'./files/'});
var fs=require('fs');
var PORT=3000;
var bodyParser=require('body-parser');	
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var mysql=require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user     : 'root',
  password : '',
  database : 'project'
});


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
	connection.query('SELECT id FROM `sem_dept` where semester=? AND department=?',[req.body.semester,req.body.branch], function(err, rows) {
		  if (err) throw err;
		  insertStudent(rows[0].id);
	});	

	function insertStudent(sem_dept_id){
		connection.query('INSERT into `student` SET ?',{id:req.body.registrationNumber,password:req.body.password,first_name:req.body.firstName,last_name:req.body.lastName,sem_dept_id:sem_dept_id}, function(err, rows) {
		  if (err) throw err;
		  	res.json(rows);
		});
	}
});

app.post('/login',function (req,res){
	connection.query('SELECT password FROM `student` where id=?',[req.body.registrationNumber], function(err, rows) {
	  if (err) throw err;
	  if(rows.length===0){
	  	return res.json("No such user exists");
	  }else{
	  	if(rows[0].password===req.body.password){
	  		return res.json("Logged In");	
	  	}else{
		  	return res.json("Failed to Login");
	    }	
	  }
	});
});

app.get('/subjects/:teacher_id',function(req,res){
	connection.query('SELECT course_name FROM `courses` where teacher_id=?',[req.params.teacher_id], function(err, rows) {
	  if (err) throw err;
	  	res.json(rows);
	});
});

app.get('/semsubjects/:student_id',function(req,res){
	connection.query('SELECT sem_dept_id FROM `student` where id=?',[req.params.student_id], function(err, rows) {
	  if (err) throw err;
	  	getSubjects(rows[0]);
	});

	function getSubjects(row){
		connection.query('SELECT course_name FROM `courses` where sem_dept_id=?',[row.sem_dept_id], function(err, rows) {
	  		if (err) throw err;
	  		res.json(rows);
		});		
	}
});

app.post('/practical',function(req,res){
	connection.query('SELECT practical_count FROM `courses` where course_id=?',[req.body.course], function(err, rows) {
	  if (err) throw err;
	  	var lastItem=rows[0].practical_count;
	  	lastItem++;
	  	insertPractical(req,res,lastItem);
	});
	
	function insertPractical(req,res,lastItem){
		connection.query('INSERT into `practicals` SET ?',{course_id:req.body.course,submission_date:req.body.submissionDate,question:req.body.question,practical_no:lastItem}, function(err, result) {
			  if (err) throw err;
			  updatePractical(req,res,lastItem);
			  return res.json(result);
		});	
		
		function updatePractical(req,res,lastItem){
			  connection.query('UPDATE `courses` SET practical_count=? WHERE course_id=?',[lastItem,req.body.course], function(err, rows) {
			  if (err) throw err;

			});
		}
	}
});


app.use('/fileupload',express.static(__dirname+'/public/fileupload.html'));
app.use('/registerform',express.static(__dirname+'/public/registerform.html'));
app.use('/loginform',express.static(__dirname+'/public/loginform.html'));
app.use('/practicalform',express.static(__dirname+'/public/practicalform.html'));
app.use('/',express.static(__dirname+'/public'));

app.listen(3000,function(){
	console.log("Express started: "+PORT);
});
