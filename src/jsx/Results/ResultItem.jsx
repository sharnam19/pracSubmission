var React=require('react');

var ResultItem=React.createClass({
	render:function(){
		box={};
		box.background="black";
		box.color="white";
		box.textAlign="center";

		var color={};
		color.background="#aaaaaa";
		return(
			<div className="mdl-cell mdl-cell--12-col-phone mdl-cell--4-col-tablet mdl-cell--3-col-desktop" style={box}>
				<h4>141070040</h4>
				
			</div>
		);
	}
});

module.exports=ResultItem;