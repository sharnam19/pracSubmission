var React=require('react');

var ResultItem=React.createClass({
	 getInitialState: function(){
        return {
            stateButtonClicked:false,
            value:this.props.marks
        };
    },
	clicked:function(){
		window.location=this.props.url;
	},
	buttonClicked:function(){
		this.setState({stateButtonClicked:true});
	},
	componentDidUpdate:function(){
		componentHandler.upgradeDom();
	},
	updateMarks:function(event){
			this.setState({value:event.target.value});
	},
	changeMarks:function(){
		$.ajax({
			url:'/update/1&141070098&'+this.state.value,
			type:'POST',
			success:function(data){
				this.setState({value:this.state.value});
			}
		});
		this.setState({stateButtonClicked:false});
	},
	render:function(){

		var mydiv;
		
		if(this.state.stateButtonClicked===false){
			mydiv=<button className="mdl-cell mdl-cell--12-col mdl-js-ripple-effect mdl-button mdl-js-button resultButton" onClick={this.buttonClicked}>Grade</button>;
		}else{
			mydiv=
				<div className="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
			    	<input onChange={this.updateMarks} onBlur={this.changeMarks} className="mdl-textfield__input" type="Number" ref="input" id={this.props.url} value={this.state.value}/>
			    	<label className="mdl-textfield__label" htmlFor={this.props.url}>Grade</label>
			    	<span className="mdl-textfield__error">Invalid</span>
		    	</div>;
		}

 		return(
			<div className="mdl-cell mdl-cell--2-col-desktop mdl-cell--2-col-phone mdl-cell--2-col-tablet">
				<div className="resultItem" onClick={this.clicked}>
					<div className="resultImage">
						<img id="img" src="images/fileicon_black.png" />
					</div>
					<div className="resultDetails">
						<div>
							<b>141070040</b>
							<br/>
							<b>24 March 2016</b>
							<br/>
							<b>{this.state.value}</b>
						</div>
					</div>
				</div>
				<div className="mdl-grid--no-spacing">
					{mydiv}
				</div>
			</div>
		);
	}
});

module.exports=ResultItem;