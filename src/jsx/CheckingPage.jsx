var React=require('react');

var CheckingPage=React.createClass({
	getInitialState:function(){
		return{
			data:null,
			activeSubject:null,
			activeCount:null,
			activeSubjectId:null
		}
	}
	,courseChange:function(){
		$.ajax({
			url:'/practicalcount/'+$("#course").val(),
			type:'GET',
			success:function(data){
				data.map(function(item){
					$("#practicalNumber").empty();
						if(item.practical_count===0){
							$("#practicalNumber").append('<option value=``>No Practical For Checking</option>');	
							$("#practicalNumber").val('').change();
						}else{
							for(var i=1;i<=item.practical_count;i++){
								$("#practicalNumber").append('<option value='+i+'>'+i+'</option>');		
							}
							$("#practicalNumber").val(1).change();
						}
				});
			}
		});	
	},
	practicalChange:function(){
		if($('#practicalNumber').val()!==''){
			$.ajax({
				url:'/results/'+$("#course").val()+'&'+$("#practicalNumber").val(),
				type:'GET',
				success:function(data){
					$("#items").empty();
					$("#items").append(JSON.stringify(data));
				}
			});	
		}else{
			$("#items").empty();
			$("#items").append("NO Results TO Display");
		}
	},
	componentWillMount:function(){
		$.ajax({
			url:'/subjects/2',
			type:'GET',
			success:function(data){
				console.log(data);
				if(data.length!==0){
					this.setState({data:data,activeCount:data[0].practical_count,activeSubjectId:data[0].course_id});
				}
				
			}
		});
	},render:function(){
		var courseNames=this.state.data.map(function(item,i){
			return(
				<option key={i} value={item.course_id}>{item.course_name}</option>
			);
		});
		var practicalNumbers;
		var i=1;
		while(i<=this.state.activeCount){
			practicalNumber+=<option key={i} value={i}>{i}</option>
			i++;
		}
		return(
			<div className="mdl-cell mdl-cell--6-col-desktop mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--3-offset-desktop">
					<form method="post" id="checkingform" enctype="application/x-www-form-urlencoded">
							
						<div className="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
							  <select className="mdl-textfield__input" id="course" name="course" value={this.state.activeSubjectId}>
							  	{courseNames}
							  </select>
						</div>
						
						<div class="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
							  <select className="mdl-textfield__input" id="practicalNumber" name="practicalNumber">
							  	{practicalNumber}
							  </select>
						</div>
					</form>
			</div>

		);
	}

});