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
	"./BooleanShape",
	"./BooleanDnDCreator",
	"dojox/gfx",
	"./_ActivityBase",
	"dojo/text!./templates/Boolean.html"
],function(declare, array, lang, aspect, domClass, domConstruct, domStyle, Source, topic, BooleanShape, DnDCreator, gfx, _ActivityBase, template){

	return declare("app.activities.Boolean",[_ActivityBase], {
		//	set our template
		templateString: template,
		name: "Boolean",
		canvas: null,
		objects: [],
		dndUtil: new DnDCreator(),
		// property/value objects to be hidden ex: {prop: "pattern", val: "solid"}
		hiddenProps: [],
		// SHAPES: shape (circle, square, star?), pattern(solid, outline, striped), color(black, red, blue)
		// PEOPLE: ?
		// order does matter, color sets the fill from the shape created by tall...
		_peoplePropList: ["tall", "blue","red","green","yellow","purple", "glasses"],
		_shapePropList: {"shape":["circle", "square", "star"], "pattern": ["solid", "outline", "gradient"], "color": ["blue", "black", "red"]},
		_opList: ["AND", "OR", "NOT", "GROUP"],
		_booleanStatementArea: "",
		_booleanPropArea: "",
		_booleanOpArea: "",

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

		createShapes: function(){
			var i, shape;
			for(i=0; i < this.data.length; i++){
				shape = new BooleanShape({type: this.flags.shapes, props: this.data[i]}).placeAt(this.objectsNode);
				shape.startup();
				this.objects.push(shape);
			}
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

		_randArray: function(){
			return [];
		},

		_updateStatement: function(args){
			var i, term, terms, node, nodes = this._booleanStatementArea.getAllNodes(),
			map = this._booleanStatementArea.map;
			terms = []

			// If I find that the nodes aren't already sorted by left position
			// so probably when I started recursively finding the nodes if I 
			// do grouping
			// nodes.sort(function(a, b){
			//     var keyA = a.getBoundingClientRect()["left"],
			//     keyB = b.getBoundingClientRect()["left"];
			//     // Compare the 2 dates
			//     if(keyA < keyB) return -1;
			//     if(keyA > keyB) return 1;
			//     return 0;
			// });

			for(i=0; i < nodes.length; i++){
				node = nodes[i];
				text = map[node.id].data.specProp || map[node.id].data.data;
				type = map[node.id].type[0];
				mask = map[node.id].data.hideIndexes || null;
				term = {type: type, text: text, mask: mask};
				terms.push(term);
			}

			this._evaluateStatement(terms);

			//this.refreshShapes();
		},

		_evaluateStatement: function(terms){
			var result;
			if(terms.length == 3){
				result = this._evalExp(terms[0].mask, terms[1].text, terms[2].mask);
				this.refreshShapes(result);
			}
		},

		_evalExp: function(mask1, op, mask2){
			var i, result = [];
			switch(op){
				case "AND":
							for(i=0; i < mask1.length; i++){
								result.push(mask1[i] && mask2[i]);
							}
				break;
				case "OR":
							for(i=0; i < mask2.length; i++){
								result.push(mask1[i] || mask2[i]);
							}
				break;
				case "NOT":
							for(i=0; i < mask1.length; i++){
								result.push(!mask2[i]);
							}
				break;
			}

			return result;
		},

		_getTermType: function(term){
			if(this._opList.indexOf(term) >-1){
				return "operator";
			}else{
				return "operand";
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

		startup: function(){
			if(this.flags.shapes=="shapes"){
				this.createShapes();
			}
			this._booleanStatementArea =  new Source(this.booleanStatementNode, {accept: ["booleanProp", "booleanOp"], horizontal: true});
			this.dndUtil.buildProps(this.booleanPropNode, this.createPropItems(this._shapePropList), true);
			this.dndUtil.buildOps(this.booleanOpNode,[
					{data:"AND", type: ["booleanOp"]},
					{data:"OR", type: ["booleanOp"]},
					{data:"NOT", type: ["booleanOp"]},
					{data: "GROUP", type:["booleanOp", "group"]}
				], true);
			// this._booleanOpArea.forInItems(function(item, id, map){
			// 	domClass.add(id, item.type[0]);
			// });

			aspect.after(this._booleanStatementArea, "onDrop" ,function(){
				topic.publish("statementChanged");
			});
		}
	});
});