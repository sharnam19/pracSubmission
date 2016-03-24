var React=require('react');
var Result=require('./Result.jsx');
var CheckingPage=React.createClass({
	getInitialState:function(){
		return{
			data:null,
			activePosition:-1,
			activePractical:-1,
			activeFilter:'All'
		}
	},
	componentDidMount:function(){
	    this.serverRequest = $.get('/sub_cnt/2', function (result) {
	    	if(result.length>0){
				this.setState({
	        		data:result,
		        	activePosition:0,
		        	activePractical:result[0].practical_count
	     		 });			
    		}else{
    			alert("No results!");
    		}
	    }.bind(this));
	},
	subjectChange:function(event){
		var i=0;
		while(i<this.state.data.length){
			if(this.state.data[i].course_id===parseInt(event.target.value)){
				if(this.state.data[i].practical_count>0){
					this.setState({activePosition:i,activePractical:this.state.data[i].practical_count});	
				}else{
					this.setState({activePosition:i,activePractical:0});
				}
				break;
			}else{
				i++;
			}
		}
	},
	practicalChange:function(event){
		this.setState({activePractical:parseInt(event.target.value)});
	},
	filterChange:function(event){
		this.setState({activeFilter:event.target.value});
	},
	render:function(){
		var courseNames=null;
		if(this.state.data===null){

		}else{
			courseNames=this.state.data.map(function(item,i){
				return(
					<option key={i} value={item.course_id}>{item.course_name}</option>
				);
			});
		}
		var value=null;
		var practicalNumber=[];
		var practicalCount;
		var i=1;
		if(this.state.activePosition===-1){
			value=null;
		}else{
			value=this.state.data[this.state.activePosition].course_id;
			while(i<=this.state.data[this.state.activePosition].practical_count){
				practicalNumber[i-1]=i;
				i++;
			}
			if(practicalNumber.length>=0){
				practicalCount=practicalNumber.map(function(item,i){
					return(
						<option key={i} value={item}>{item}</option>
					);
				});	
			}
		}

		var res;
		if(this.state.activePosition===-1 || this.state.activePractical===0){
			res=<h4>NO Results</h4>
		}else{
			res=<Result courseId={this.state.data[this.state.activePosition].course_id} 
							pracNumber={this.state.activePractical} 
								filter={this.state.activeFilter}/>;
		}
		
		return(
			<div className="mdl-cell mdl-cell--12-col">
				
					<div className="whiteBox mdl-cell mdl-cell--10-col-desktop mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--1-offset-desktop">
							<form method="post" id="checkingform" encType="application/x-www-form-urlencoded">
									
								<div className="mdl-cell mdl-cell--10-col mdl-cell--1-offset-desktop mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
									  <select className="mdl-textfield__input" id="course" onChange={this.subjectChange} name="course" value={value}>
									  	{courseNames}
									  </select>
								</div>
								
								<div className="mdl-cell mdl-cell--10-col mdl-cell--1-offset-desktop mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
									  <select className="mdl-textfield__input" id="practicalNumber" onChange={this.practicalChange} name="practicalNumber" value={this.state.activePractical}>
									  	{practicalCount}
									  </select>
								</div>

								<label className="mdl-cell mdl-cell--3-col-desktop mdl-cell--1-offset-desktop mdl-radio mdl-js-radio mdl-js-ripple-effect" 
										htmlFor="option-1">
								  <input onChange={this.filterChange} id="option-1" type="radio" 
								  		className="mdl-radio__button" name="options" value="All" checked/>
								  <span className="mdl-radio__label">All</span>
								</label>
								
								<label className="mdl-cell mdl-cell--3-col-desktop mdl-cell--1-offset-desktop mdl-radio mdl-js-radio mdl-js-ripple-effect" 
										htmlFor="option-2">
								  <input onChange={this.filterChange} id="option-2" type="radio" 
								  		className="mdl-radio__button" name="options" value="Checked"/>
								  <span className="mdl-radio__label">Checked</span>
								</label>
								
								<label className="mdl-cell mdl-cell--3-col-desktop mdl-cell--1-offset-desktop mdl-radio mdl-js-radio mdl-js-ripple-effect"
										 htmlFor="option-3">
								  <input onChange={this.filterChange} id="option-3" type="radio" 
								  		className="mdl-radio__button" name="options" value="Unchecked"/>
								  <span className="mdl-radio__label">Unchecked</span>
								</label>
							</form>
					</div>
					<div className="whiteBox mdl-cell mdl-cell--10-col-desktop mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-cell--1-offset-desktop">
						{res}
					</div>
				
			</div>
			

		);
	}

});

module.exports=CheckingPage;