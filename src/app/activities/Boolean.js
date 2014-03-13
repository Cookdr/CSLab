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
	"dojox/gfx",
	"./_ActivityBase",
	"dojo/text!./templates/Boolean.html"
],function(declare, array, lang, aspect, domClass, domConstruct, domStyle, Source, topic, BooleanShape, gfx, _ActivityBase, template){

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
					arr.push({data: item, type:["booleanProp"]});
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

		refreshShapes: function(){
			var i, baseX, baseY, translateX, translateY, counter, shape;
			counter = 0;
			for(i=0; i < this.objects.length; i++){
				shape = this.objects[i];
				baseX = (counter%6)*100+5;
				baseY = Math.floor(counter/6)*125+5;
				if(shape.active){
					translateX = baseX - shape.oldPos.x;
					translateY = baseY - shape.oldPos.y;
					console.log(shape.oldPos.x+","+shape.oldPos.y+" -> "+baseX+","+baseY+" = "+translateX+","+translateY);
					shape.applyTransform([gfx.matrix.translate(translateX, translateY)]);
					shape.oldPos.x += translateX;
					shape.oldPos.y += translateY;

					counter++;
				}else{
					shape.applyTransform([gfx.matrix.translate(-1000, -1000)]);
					shape.oldPos.x -= 1000;
					shape.oldPos.y -= 1000;
				}
			}
		},

		_randArray: function(){
			return [];
		},

		_updateStatement: function(args){
			var i, term, terms, node, nodes = this._booleanStatementArea.getAllNodes();
			terms = []

			for(i=0; i < nodes.length; i++){
				node = nodes[i];
				text = node.innerHTML;
				type = this._getTermType(text);
				term = {type: type, text: text};
				terms.push(term);
			}

			this._evalutateStatment(terms);

			//this.refreshShapes();
		},

		_evaluateStatement: function(terms){
			
		},

		_getTermType: function(term){
			if(this._opList.indexOf(term) >-1){
				return "operator";
			}else{
				return "operand";
			}
		},

		startup: function(){
			this._booleanStatementArea =  new Source(this.booleanStatementNode, {accept: ["booleanProp", "booleanOp"], horizontal: true});
			this._booleanOpArea = new Source(this.booleanOpNode, {accept: ["booleanOp"], copyOnly:true, horizontal: true});
			this._booleanPropArea = new Source(this.booleanPropNode, {accept: ["booleanProp"], copyOnly:true, horizontal: true});
			this._booleanPropArea.insertNodes(false, this.createPropItems(this._shapePropList));
			this._booleanPropArea.forInItems(function(item, id, map){
				domClass.add(id, item.type[0]);
			});
			this._booleanOpArea.insertNodes(false, [
					{data:"AND", type: ["booleanOp"]},
					{data:"OR", type: ["booleanOp"]},
					{data:"NOT", type: ["booleanOp"]},
					{data: "GROUP", type:["booleanOp", "group"]}
				]);
			this._booleanOpArea.forInItems(function(item, id, map){
				domClass.add(id, item.type[0]);
			});

			aspect.after(this._booleanStatementArea, "onDrop" ,function(){
				topic.publish("statementChanged");
			});
			if(this.flags.shapes=="shapes"){
				this.createShapes();
			}
		}
	});
});