var React=require('react');
var ReactDOM=require('react-dom');

var ResultItem=require('./Results/ResultItem.jsx');
//var CheckingPage=require('./CheckingPage.jsx');
var Result=React.createClass({
	render:function(){
		var resultItems=this.props.list.map(function(item,i){
			return(
				<ResultItem key={i} item={item}/>
			);
		});
		return(
			<div className="mdl-grid">
				{resultItems}
			</div>
		);
	}
});

var item={
	"file_path":"Hello",
	"marks":5,
	"student_id":"141070098",
	"practical_id":"1",
	"date":"24/02/2016"
}

ReactDOM.render(<div className="mdl-grid"><ResultItem  url="Hello" marks={5}/><ResultItem url="Hello" marks={5} /><ResultItem marks={5} url="Hello"/><ResultItem marks={5} url="Hello"/></div>,document.getElementById("item2"));


