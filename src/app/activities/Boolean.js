define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/topic",
	"dijit/form/ToggleButton",
	"dojox/gfx",
	"./_ActivityBase",
	"dojo/text!./templates/Boolean.html"
],function(declare, array, lang, domConstruct, domStyle, topic, ToggleButton, gfx, _ActivityBase, template){

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

		constructor: function(problem){
			this.problem = problem;
			this.type = problem.type;
			this.flags = problem.flags;
			if(this.flags.random){
				this.data = this._randArray();
			}else{
				this.data = problem.problemData.slice();
			}

			topic.subscribe("booleanPropChange", lang.hitch(this, this._recPropChange));
		},

		createPropButtons: function(propList){
			var i, propDiv;
			for(prop in propList){
				propDiv = domConstruct.create('div', {innerHTML: prop+": "}, this.propertyColNode);
				array.forEach(propList[prop], lang.hitch(this, function(item){
					new ToggleButton({
					checked: false,
					label: item,
					booleanProp: prop,
					onChange: function(val){
						topic.publish("booleanPropChange", {prop: this.booleanProp, val: item, hide: val});
					}
				}).placeAt(propDiv);
				}));
				
			}
		},

		createShapes: function(){
			var i, baseX, baseY;
			for(i=0; i < this.data.length; i++){
				baseX = (i%4)*100+5;
				baseY = Math.floor(i/4)*125+5;
				this._createShape(baseX, baseY, this.data[i]);	
			}
		},

		refreshShapes: function(){
			var i, baseX, baseY, translateX, translateY, counter, shape;
			counter = 0;
			for(i=0; i < this.objects.length; i++){
				shape = this.objects[i];
				baseX = (counter%4)*100+5;
				baseY = Math.floor(counter/4)*125+5;
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

		_createShape: function(baseX, baseY, objData){
			var i, shape, prop;
			switch(objData.shape){
				case "circle": shape = this._createCircle(baseX, baseY, objData);
				break;
				case "square": shape = this._createSquare(baseX, baseY, objData);
				break;
				case "star": shape = this._createStar(baseX, baseY, objData);
				break;
			}
			shape.props = objData;
			shape.oldPos= {x: baseX, y: baseY};
			shape.active = true;

			this.objects.push(shape);
		},

		_createSquare: function(baseX, baseY, objData){
			return this._addProps(this.canvas.createRect({x:baseX, y:baseY, width:80, height:80}), objData.pattern, objData.color);
		},
		_createCircle: function(baseX, baseY, objData){
			return this._addProps(this.canvas.createCircle({cx:baseX+40, cy:baseY+40, r:40}), objData.pattern, objData.color);
		},
		_createStar: function(baseX, baseY, objData){
			var cx = baseX+40, cy = baseY+40, shape;
			//oT, iTR, oTR, iR, oBR, iB, oBL, iL, oTL, iTL
			shape = this.canvas.createPolyline([
				{x:cx,    y:cy-40}, // oT
				{x:cx+15, y:cy-10}, // iTR
				{x:cx+40, y:cy-20}, // oTR
				{x:cx+15, y:cy+5},    // iR
				{x:cx+40, y:cy+40}, // oBR
				{x:cx,    y:cy+15}, // iB
				{x:cx-40, y:cy+40}, // oBL
				{x:cx-15, y:cy+5},    // iL
				{x:cx-40, y:cy-20}, // oTL
				{x:cx-15, y:cy-10},  // iTL
				{x:cx,    y:cy-40}  // close it up
				]);
			return this._addProps(shape, objData.pattern, objData.color);
		},

		_addProps: function(shape, pattern, color){
			switch(pattern){
				case "solid": shape.setFill(color);
				break;
				case "outline": shape.setStroke({"color":color, "width":4});
				break;
				case "gradient":
				break;
			}

			return shape;
		},

		_randArray: function(){
			return [];
		},

		_recPropChange: function(args){
			var i, j, k, index, object, propObj, active;
			if(args.hide){
				console.log("hiding: "+args.prop+":"+args.val);
				this.hiddenProps.push({prop: args.prop, val: args.val});
			}else{
				for(k=0; k < this.hiddenProps.length; k++){
					if(this.hiddenProps[k].prop = args.prop && this.hiddenProps[k].val == args.val){
						this.hiddenProps.splice(k, 1);
					}
				}
			}

			for(i=0; i < this.objects.length; i++){
				object = this.objects[i];
				active = true;
				for(j=0; j < this.hiddenProps.length; j++){
					propObj = this.hiddenProps[j];
					if(object.props[propObj.prop] == propObj.val){
						active = false;
					}
				}
				object.active = active;
			}

			this.refreshShapes();
		},

		startup: function(){
			this.canvas = gfx.createSurface(this.gfxNode, 400, 800);
			domStyle.set(this.gfxNode, "float", "left");
			this.canvas.rawNode.style.backgroundColor = "#e2e2e2";
			if(this.flags.shapes=="shapes"){
				this.createShapes();
				this.createPropButtons(this._shapePropList);
			}
			this.createPropButtons();
		}
	});
});