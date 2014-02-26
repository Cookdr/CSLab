define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dijit/form/TextBox",
	"dojox/gfx",
	"dojox/gfx/Moveable",
	"./_ActivityBase",
	"dojo/text!./templates/Binary.html"
],function(array, declare, lang, domConstruct, html, on, TextBox, gfx, Moveable, _ActivityBase, template){

	return declare("app.activities.Binary",[_ActivityBase], {

		constructor: function(problem){
			this.problem = problem;
			this.type = problem.type;
			this.data = problem.problemData;
			this.flags = problem.flags;

			console.log(problem.problemData);
		},
		//	set our template
		templateString: template,
		name: "Binary",
		canvas: null,
		cards: null,
		// function to test success
		updateSuccess: null,

		createCards: function(clickable, type){
			if(this.cards){
				array.forEach(this.cards, function(card){
					card.destroy();
				});
				this.cards = null;
			}
			var i, card, cards = [];
			for(i = 0; i <5; i++){
				card = this.canvas.createGroup();
				if(type == "dots"){
					card.createImage({x:(400-i*100)+5, y:100, width:80, height:120, src:"app/resources/images/"+(i+1)+".png"});
					card.createRect({x:(400-i*100)+5, y:100, width:80, height:120}).setStroke({style:'solid',color:'black',width:2}).setFill([0,0,0,1]);
					card.activate = this._activateDotsCard;
					card.deactivate = this._deactivateDotsCard;
				}else if(type == "binary"){
					card.createRect({x:(400-i*100)+5, y:100, width:80, height:120}).setStroke({style:'solid',color:'black',width:2}).setFill([0,0,0,0]);
					card.createText({x:(400-i*100)+30, y:170, text:"0"}).setFont({ family:"Arial", size:"36pt", weight:"bold" }).setFill("black");
					card.activate = this._activateBinaryCard;
					card.deactivate = this._deactivateBinaryCard;
				}
				card.active = false;
				card.type = type;
				card.decVal = Math.pow(2,i);
				if(clickable){
					card.on("click", lang.hitch(this,this.toggleActive));
				}
				cards.push(card);
			}

			this.cards = cards;
		},

		// Setup the cards to display a certain value;
		displayNum: function(value){
			var i;
			for(i=this.cards.length-1; i >=0; i--){
				if(this.cards[i].decVal <= value){
					this.cards[i].activate();
					value = value-this.cards[i].decVal;
				}else{
					this.cards[i].deactivate();
				}
			}
		},

		toggleActive: function(evt){
			var card = evt.gfxTarget;
			card.getParent().active = !card.getParent().active;
			if(card.getParent().active){
				card.getParent().activate();
			}else{
				card.getParent().deactivate();
			}

			this.updateCurNum();
		},
		_activateDotsCard: function(){
			this.children[1].setFill([0,0,0,0]);
		}, 
		_deactivateDotsCard: function(){
			this.children[1].setFill("black");
		},
		_activateBinaryCard: function(){
			this.children[1].setShape({text: "1"}).setFont({ family:"Arial", size:"36pt", weight:"bold" }).setFill("black");
		},
		_deactivateBinaryCard: function(){
			this.children[1].setShape({text: "0"}).setFont({ family:"Arial", size:"36pt", weight:"bold" }).setFill("black");
		},

		updateCurNum: function(){
			var i, index, curNum = 0;
			for(i=0; i< this.cards.length; i++){
				if(this.cards[i].active){
					curNum += this.cards[i].decVal;
				}
			}
			html.set(this.curNumNode, curNum.toString());
			this.updateSuccess(curNum);
		},

		decToBinSuccess: function(curNum){
			if(curNum == this.data[0]){
				this.data.splice(0,1);
				if(this.data.length == 0){
					html.set(this.instructionsNode, "Success!");
					this.success();
				}else{
					this.updateInstructions();
				}
			}
		},

		binToDecSuccess: function(curNum){
			if(curNum == this.data[0]){
				this.data.splice(0,1);
				if(this.data.length == 0){
					html.set(this.instructionsNode, "Success!");
					this.success();
				}else{
					this.displayNum(this.data[0]);
				}
				return true;
			}else{
				return false;
			}
		},


		updateInstructions: function(){
			html.set(this.instructionsNode, "Please match the following Number: "+this.data[0]);
		},

		startup: function(){
			this.canvas = gfx.createSurface(this.gfxNode, 600, 400);
			if(this.type == "DecToBin"){
				this.updateSuccess = this.decToBinSuccess;
				this.createCards(true, this.flags.cards);
				this.updateInstructions();
			}else if(this.type == "BinToDec"){
				var txtBox;
				this.createCards(false, this.flags.cards);
				this.displayNum(this.data[0]);
				html.set(this.instructionsNode, "Please enter the value displayed by the cards: ");
				domConstruct.empty(this.curNumLabelNode);
				this.decTxtBox = new TextBox({
												onKeyUp:lang.hitch(this, function(){
													if(this.binToDecSuccess(this.decTxtBox.get("value"))){
														this.decTxtBox.set("value", "");
													}
												}),
												intermediateChanges: true

											}).placeAt(this.curNumLabelNode);
				this.decTxtBox.focus();
				this.updateSuccess = this.binToDecSuccess;
			}

		}
	});
});