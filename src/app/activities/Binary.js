define([
	"./BinaryCard",
	"app/Timer",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/html",
	"dojo/on",
	"dojo/topic",
	"dijit/form/NumberTextBox",
	"dojox/gfx",
	"dojox/gfx/fx",
	"./_ActivityBase",
	"dojo/text!./templates/Binary.html"
],function(BinaryCard, Timer, array, declare, lang, domConstruct, domClass, html, on, topic, NumberTextBox, gfx, gfxfx, _ActivityBase, template){

	return declare("app.activities.Binary",[_ActivityBase], {

		//	set our template
		templateString: template,
		name: "Binary",
		canvas: null,
		cards: null,
		// function to test success
		updateSuccess: null,

		constructor: function(problem){
			this.problem = problem;
			this.type = problem.type;
			this.flags = problem.flags;
			if(this.flags.random){
				this.data = this._randArray();
			}else{
				this.data = problem.problemData.slice();
			}

			console.log(problem.problemData);
		},

		createCards: function(clickable, type){
			if(this.cards){
				array.forEach(this.cards, function(card){
					card.destroy();
				});
				this.cards = null;
			}
			var i, card, cards = [];
			for(i = 4; i >= 0; i--){
				card = new BinaryCard({
						"type":type, 
						"decVal": Math.pow(2,i),
						"clickable":clickable,
						updateActive: lang.hitch(this, this.updateActive)

						}
						).placeAt(this.containerNode);
				card.startup();
				cards.push(card);
			}

			this.cards = cards;
		},

		updateActive: function(){
			this.updateCurNum();
		},

		// Setup the cards to display a certain value;
		displayNum: function(value){
			var i;
			for(i=0; i < this.cards.length; i++){
				if(this.cards[i].decVal <= value){
					this.cards[i].activate();
					value = value-this.cards[i].decVal;
				}else{
					this.cards[i].deactivate();
				}
			}
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
			//topic.subscribe()
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
				this.decTxtBox = new NumberTextBox({
												placeholder: "enter decimal value here",

												onKeyUp:lang.hitch(this, function(){
													if(this.binToDecSuccess(this.decTxtBox.get("value"))){
														this.decTxtBox.set("value", "");
													}
												}),
												intermediateChanges: true

											}).placeAt(this.curNumLabelNode);

				domClass.add(this.decTxtBox.domNode, "binaryDecTxtBox");
				this.decTxtBox.focus();
				this.updateSuccess = this.binToDecSuccess;
			}
			
			if(this.flags.race){
				this.timer = new Timer().placeAt(this.containerNode);
				this.timer.start();
			}

		},

		_randArray: function(){
			var i, arr = [];
			for(i=0; i <10; i++){
				arr.push(Math.floor((Math.random()*31)));
			}

			return arr;
		}
	});
});