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

			topic.subscribe("statementChanged", lang.hitch(this, this._updateStatement));
			topic.subscribe("statementAdded", lang.hitch(this, this._addStatementBox));
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

		createShapes: function(shapes){
			var i, shape;
			for(i=0; i < shapes.length; i++){
				shape = new BooleanShape({type: this.flags.shapes, props: shapes[i]}).placeAt(this.objectsNode);
				shape.startup();
				this.objects.push(shape);
			}
		},

		createAllShapes: function(){
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

			this.createShapes(arr);
		},

		refreshShapes: function(mask){
			var i;
			for(i = 0; i < mask.length; i++){
				if(mask[i]){
					this.objects[i].hide();
				}else{
					this.objects[i].show();
				}
			}
		},

		_addStatementBox: function(){
			this._additionalStatements.push(new BooleanStatementBox().placeAt(this.addlBooleanStatementsNode));
		},

		_randArray: function(){
			return [];
		},

		_updateStatement: function(args){
			var terms, nodes = this._booleanStatementArea.getAllNodes(),
			map = this._booleanStatementArea.map;

			terms = booleanLogic.getTerms(map, nodes);

			result = booleanLogic.evalStatement(terms);

			// Gets us the result of the base boolean statement.
			// now we add add in any additional clauses
			for(i=0; i < this._additionalStatements.length; i++){
				var sndResult, addlClause;
				addlClause = this._additionalStatements[i];
				sndResult = booleanLogic.evalStatement(addlClause.getTerms());

				if(sndResult){
					result = booleanLogic.evalExp(result, addlClause.getOp(), sndResult);
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

			if(this.type === "pickOne"){
				if(this.flags.shapes=="shapes"){
					this.createAllShapes();
				}
				this._booleanStatementArea =  new BooleanStatementSource(this.booleanStatementNode, {
					accept: ["booleanProp"], 
					horizontal: true
				});
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
			}
		}
	});
});