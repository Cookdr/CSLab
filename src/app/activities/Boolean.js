define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dnd/Source",
	"dojo/topic",
	"dijit/form/Button",
	"./BooleanShape",
	"./BooleanStatementBox",
	"./BooleanStatementSource",
	"./BooleanDnDCreator",
	"./BooleanLogic",
	"dojox/gfx",
	"./_ActivityBase",
	"dojo/text!./templates/Boolean.html"
],function(declare, array, lang, aspect, domClass, domConstruct, domStyle, Source, topic, Button, BooleanShape, BooleanStatementBox, BooleanStatementSource, dndUtil, booleanLogic, gfx, _ActivityBase, template){

	return declare("app.activities.Boolean",[_ActivityBase], {
		//	set our template
		templateString: template,
		name: "Boolean",
		canvas: null,
		objects: [],
		// property/value objects to be hidden ex: {prop: "pattern", val: "solid"}
		hiddenProps: [],
		// SHAPES: shape (circle, square, star?), pattern(solid, outline, striped), color(black, red, blue)
		// PEOPLE: ?
		// order does matter, color sets the fill from the shape created by tall...
		_peoplePropList: ["tall", "blue","red","green","yellow","purple", "glasses"],
		_shapePropList: {"shape":["circle", "square", "star"], "pattern": ["solid", "outline", "gradient"], "color": ["blue", "black", "red"]},
		_opList: ["AND", "OR", "NOT", "GROUP"],
		_booleanStatementArea: "",
		_additionalStatements: [],

		constructor: function(problem){
			this.problem = problem;
			this.type = problem.type;
			this.flags = problem.flags;
			if(this.flags.random){
				this.data = this._randArray();
			}else{
				this.data = problem.problemData.slice();
			}
		},

		createPropItems: function(propList){
			var i, arr = [];
			for(prop in propList){
				propDiv = domConstruct.create('div', {innerHTML: prop+": "}, this.propertyColNode);
				array.forEach(propList[prop], lang.hitch(this, function(item){
					arr.push({data: this._getPropData(prop, item), type:["booleanProp"]});
				}));
			}

			return arr;
		},

		createShapes: function(shapes, clickable){
			var i, shape, isSelected;
			for(i=0; i < shapes.length; i++){	
				shape = new BooleanShape({type: this.flags.shapes, props: shapes[i], clickable: clickable}).placeAt(this.objectsNode);
				shape.startup();
				// if not clickable(userSelect) then need to see if selected(userStatement)
				if(!clickable){
					isSelected = array.filter(this.data, function(item){
						return item.shape === shapes[i].shape && item.color === shapes[i].color && item.pattern === shapes[i].pattern;
					}, this);
					if(isSelected.length > 0){
						shape.selected();
					}
				}
				this.objects.push(shape);
			}
		},

		createAllShapes: function(clickable){
			var i,j,k, shapes = this._shapePropList.shape,
			patterns = this._shapePropList.pattern,
			colors = this._shapePropList.color, arr = [];
			for(i=0; i < shapes.length; i++){
				for(j=0; j < patterns.length; j++){
					for(k=0; k < colors.length; k++){
						arr.push({shape: shapes[i], pattern: patterns[j], color: colors[k]});
					}
				}	
			}

			arr = this._randomizeArray(arr);

			this.createShapes(arr, clickable);
		},

		refreshShapes: function(mask){
			var i, notHid = true, notShow = true;
			for(i = 0; i < mask.length; i++){
				if(!mask[i]){
					this.objects[i].hide();
					if(this.objects[i].isSelected){
						notHid = false;
					}
				}else{
					this.objects[i].show();
					if(!this.objects[i].isSelected){
						notShow = false;
					}
				}
			}
			if(notHid && notShow){
				this.success();
			}
		},

		_addStatementBox: function(){
			this._additionalStatements.push(new BooleanStatementBox(false).placeAt(this.addlBooleanStatementsNode));
		},

		_buildStatement: function(statement){
			var i, type;
			for(i=0; i < statement.length; i++){
				if(array.indexOf(this._opList, statement[i]) >=0){
					type = "booleanOp";
				}else{
					type = "booleanProp";
				}

				domConstruct.create("div",{
					innerHTML: statement[i],
					class: type+" dojoDndItem"
				}, this.booleanStatementNode);
			}
		},

		// Checks the user's selections against this.data.shapes to test success
		_checkSelections: function(evt){
			var i, j, shape, chosen, counter = 0, success = true;
			for(i=0; i < this.objects.length; i++){
				shape = this.objects[i];
				if(shape.active){
					// see if it's one of the chosen ones
					chosen = false;
					for(j=0; j < this.data.shapes.length; j++){
						if(shape.compare(this.data.shapes[j])){
							chosen = true;
							break;
						}
					}
					if(!chosen){
						success = false;
						break;
					}else{
						counter++;
					}
				}
			}

			if(success && counter === this.data.shapes.length){
				this.success();
			}

		},

		_randArray: function(){
			return [];
		},

		_updateStatement: function(args){
			var op, terms;
			terms = this._booleanStatementArea.getTerms();
			op = this._booleanStatementArea.getOp();

			result = booleanLogic.evalStatement(terms);
			if(op && result){
				// op has to be NOT
				result = booleanLogic.evalExp(null, op, result);
			}

			// Gets us the result of the base boolean statement.
			// now we add add in any additional clauses
			for(i=0; i < this._additionalStatements.length; i++){
				var sndResult, addlClause;
				addlClause = this._additionalStatements[i];
				sndResult = booleanLogic.evalStatement(addlClause.getTerms());

				if(sndResult){
					if(addlClause.getOp() === "NOT"){
						result = booleanLogic.evalExp(result, "AND", booleanLogic.evalExp(null, "NOT", sndResult));
					}else{
						result = booleanLogic.evalExp(result, addlClause.getOp(), sndResult);
					}
				}
			}

			if(result){
				this.refreshShapes(result);
			}
		},

		// want to create the bitstring for indexes hidden by this prop ("blue", solid etc)
		// should be an object like {prop: prop, hideProps: hiddenProps}
		_getPropData: function(prop, specProp){
			var propData = {
				prop: prop,
				specProp: specProp,
				hideIndexes: new Array()
			}
			array.forEach(this.objects, function(obj){
				if(obj.props[prop] == specProp){
					propData.hideIndexes.push(true);
				}else{
					propData.hideIndexes.push(false);
				}
			});

			return propData;
		},

		_randomizeArray: function(arr){
			var i, tmp, rin;

			for(i=0; i < arr.length; i++){
				rin = Math.floor(Math.random()*arr.length)
				tmp = arr[i];
				arr[i] = arr[rin];
				arr[rin] = tmp;
			}

			return arr;
		},

		startup: function(){

			if(this.type === "userStatement"){
				topic.subscribe("statementChanged", lang.hitch(this, this._updateStatement));
				topic.subscribe("statementAdded", lang.hitch(this, this._addStatementBox));
				if(this.flags.shapes === "shapes"){
					this.createAllShapes(false);
				}
				this._booleanStatementArea =  new BooleanStatementBox(true, this.booleanStatementNode);
				this._addStatementBox();
				dndUtil.buildProps(this.booleanPropNode, this.createPropItems(this._shapePropList), true);
				dndUtil.buildOps(this.booleanOpNode,[
						{data:"AND", type: ["booleanOp"]},
						{data:"OR", type: ["booleanOp"]},
						{data:"NOT", type: ["booleanOp", "booleanProp"]}
					], true);
				// this._booleanOpArea.forInItems(function(item, id, map){
				// 	domClass.add(id, item.type[0]);
				// });

				aspect.after(this._booleanStatementArea, "onDrop" ,function(){
					topic.publish("statementChanged");
				});
			}else{
				// Only have one {statement, shape} object in the array
				this.data = this.data[0];
				// userSelect
				if(this.flags.shapes === "shapes"){
					this.createAllShapes(true);
				}
				this.subscribe("userSelected", this._checkSelections);

				this._buildStatement(this.data.statement.split(' '));
				domConstruct.destroy(this.booleanOpNode);
				domConstruct.destroy(this.booleanPropNode);
				domConstruct.destroy(this.addlBooleanStatementsNode);
			}
		}
	});
});