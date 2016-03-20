var React=require('react');

var ResultItem=React.createClass({
	 getInitialState: function(){
        return {
            stateButtonClicked:false,
            value:this.props.item.marks
        };
    },
	clicked:function(){
		window.location=this.props.item.file_path;
	},
	buttonClicked:function(){
		this.setState({stateButtonClicked:true});
	},
	componentWillReceiveProps:function(nextProps){
		this.setState({value:nextProps.item.marks});
	},
	componentDidUpdate:function(){
		componentHandler.upgradeDom();
	},
	updateMarks:function(event){
			this.setState({value:event.target.value});
	},
	changeMarks:function(){
		$.ajax({
			url:'/update/'+this.props.item.practical_id+'&'+this.props.item.student_id+'&'+this.state.value,
			type:'POST',
			success:function(data){
				this.setState({value:this.state.value});
			}
		});
		this.setState({stateButtonClicked:false});
	},
	getMonth:function(month){
		switch(month){
			case 0:
				return 'JAN';
			case 1:
				return 'FEB';
			case 2:
				return 'MAR';
			case 3:
				return 'APR';
			case 4:
				return 'MAY';
			case 5:
				return 'JUNE';
			case 6:
				return 'JULY';
			case 7:
				return 'AUG';
			case 8:
				return 'SEPT';
			case 9:
				return 'OCT';
			case 10:
				return 'NOV';
			case 11:
				return 'DEC';

		}
	},
	render:function(){

		var mydiv;
		
		if(this.state.stateButtonClicked===false){
			mydiv=<button className="mdl-cell mdl-cell--12-col mdl-js-ripple-effect mdl-button mdl-js-button resultButton" onClick={this.buttonClicked}>Grade</button>;
		}else{
			mydiv=
				<div className="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
			    	<input onChange={this.updateMarks} onBlur={this.changeMarks} className="mdl-textfield__input" type="Number" ref="input" id={this.props.item.file_path} value={this.state.value}/>
			    	<label className="mdl-textfield__label" htmlFor={this.props.item.file_path}>Grade</label>
			    	<span className="mdl-textfield__error">Invalid</span>
		    	</div>;
		}
		var date=new Date(''+this.props.item.date);
		
 		return(
			<div className="mdl-cell mdl-cell--2-col-desktop mdl-cell--2-col-phone mdl-cell--2-col-tablet">
				<div className="resultItem" onClick={this.clicked}>
					<div className="resultImage">
						<img id="img" src="images/fileicon_black.png" />
					</div>
					<div className="resultDetails">
						<div>
							<b>{this.props.item.student_id}</b>
							<br/>
							<b>{date.getDate()+'-'+this.getMonth(date.getMonth())+'-'+date.getFullYear()}</b>
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