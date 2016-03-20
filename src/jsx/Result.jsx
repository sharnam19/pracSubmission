var React=require('react');
var ReactDOM=require('react-dom');

var ResultItem=require('./Results/ResultItem.jsx');
var Result=React.createClass({
	getInitialState:function(){
		return{
			data:null
		}
	},
	componentDidMount:function(){
		this.serverRequest = $.get('/results/'+this.props.courseId+'&'+this.props.pracNumber, function (result) {
	    	if(result.length>0){
	    		console.log(result);
				this.setState({
	        		data:result
	     		 });			
    		}else{
    			alert("No results!");
    		}
	    }.bind(this));
	},
	componentWillReceiveProps:function(nextProps){
		this.serverRequest = $.get('/results/'+nextProps.courseId+'&'+nextProps.pracNumber, function (result) {
			this.setState({
	    		data:result
	 		 });			
	    }.bind(this));	
	},
	render:function(){
		var resultItems=<h4>No Results To Show</h4>;
		if(this.state.data!==null){
			resultItems=this.state.data.map(function(item,i){
				return(
					<ResultItem key={i} item={item}/>
				);
			});	
		}
		
		return(
			<div className="mdl-cell mdl-cell--12-col-desktop mdl-cell--4-col-phone mdl-cell--8-col-tablet">
				<div className="mdl-grid">
					{resultItems}
				</div>
			</div>
		);
	}
});

var item={
	"file_path":"Hello",
	"marks":5,
	"student_id":"141070098",
	"practical_id":1,
	"date":"24/02/2016"
}
module.exports=Result;




