define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/html",
	"dojo/on",
	"dojo/topic",
	"dojox/gfx",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/BooleanShape.html"
],function(declare, lang, domConstruct, domClass, domStyle, html, on, topic, gfx,  _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.BooleanShape",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		type: null,
		clickable: null,
		props: null,
		active: true,
		canvas: null,
		isSelected: null,


		constructor: function(args){
			this.type = args.type;
			this.props = args.props;
			this.clickable = args.clickable;
		},

		hide: function(){
			if(this.active){
				// this.containerNode.style.backgroundColor = '#DEB4B4';
				this.containerNode.style.opacity = '.25';
				this.active = false;
			}
		},

		show: function(){
			if(!this.active){
				// this.containerNode.style.backgroundColor = 'transparent';
				this.containerNode.style.opacity = '1';
				this.active = true;
			}
		},

		selected: function(){
			this.containerNode.style.backgroundColor = 'rgba(61, 191, 85,.5)';
			this.isSelected = true;
		},

		unselected: function(){
			this.containerNode.style.backgroundColor = 'transparent';
			this.isSelected = false;
		},

		_drawShape: function(){
			var i, shape, prop;
			switch(this.props.shape){
				case "circle": shape = this._createCircle(this.props);
				break;
				case "square": shape = this._createSquare(this.props);
				break;
				case "star": shape = this._createStar(this.props);
				break;
			}
		},

		_createSquare: function(objData){
			return this._addProps(this.canvas.createRect({x:10, y:10, width:60, height:60}), objData.pattern, objData.color);
		},
		_createCircle: function(objData){
			return this._addProps(this.canvas.createCircle({cx:40, cy:40, r:30}), objData.pattern, objData.color);
		},
		_createStar: function(objData){
			var cx = 40, cy = 40, shape;
			//oT, iTR, oTR, iR, oBR, iB, oBL, iL, oTL, iTL
			shape = this.canvas.createPolyline([
				{x:cx,    y:cy-30}, // oT
				{x:cx+10, y:cy-8}, // iTR
				{x:cx+30, y:cy-8}, // oTR
				{x:cx+14, y:cy+7},    // iR
				{x:cx+25, y:cy+30}, // oBR
				{x:cx,    y:cy+15}, // iB
				{x:cx-25, y:cy+30}, // oBL
				{x:cx-14, y:cy+7},    // iL
				{x:cx-30, y:cy-8}, // oTL
				{x:cx-10, y:cy-8},  // iTL
				{x:cx,    y:cy-30},  // close it up
				{x:cx+10, y:cy-10}
				]);
			return this._addProps(shape, objData.pattern, objData.color);
		},

		_addProps: function(shape, pattern, color){
			switch(pattern){
				case "solid": shape.setFill(color);
				break;
				case "outline": shape.setStroke({"color":color, "width":4});
				break;
				case "gradient": shape.setFill({
					type: "radial",
					cx:40,
					cy:40,
					r: 30,
					colors: [
						{ offset: 0,   color: "white" },
	       			    { offset: 1, color: color}
	       			   ]
				});
				break;
			}

			return shape;
		},

		_toggleActive: function(){
			if(!this.active){
				this.show();
			}else{
				this.hide();
			}
			topic.publish("userSelected");
		},

		// compare to another Boolean shape and return true if it's a match
		compare: function(shape){
			var p = this.props;
			return p.shape === shape.shape && p.color === shape.color && p.pattern === shape.pattern;
		},

		startup: function(){
			this.canvas = gfx.createSurface(this.gfxNode, 80, 80);
			switch(this.type){
				case "shapes": this._drawShape();
				break;
			}

			if(this.clickable){
				on(this, "click", lang.hitch(this, this._toggleActive));
				this.hide();
			}
		},

		destroy: function(){
			this.inherited(arguments);
		}
	});
});