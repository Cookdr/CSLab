define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/html",
	"dojo/on",
	"dojox/gfx",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/BooleanShape.html"
],function(declare, lang, domConstruct, domClass, domStyle, html, on, gfx,  _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.BooleanShape",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		type: null,
		props: null,
		active: true,
		canvas: null,

		constructor: function(args){
			this.type = args.type;
			this.props = args.props;
		},

		hide: function(){
			if(this.active){
				this.containerNode.style.display = 'none';
				this.active = false;
			}
		},

		show: function(){
			if(!this.active){
				this.containerNode.style.display = 'block';
				this.active = true;
			}
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
			return this._addProps(this.canvas.createRect({x:10, y:10, width:80, height:80}), objData.pattern, objData.color);
		},
		_createCircle: function(objData){
			return this._addProps(this.canvas.createCircle({cx:50, cy:50, r:40}), objData.pattern, objData.color);
		},
		_createStar: function(objData){
			var cx = 50, cy = 50, shape;
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
				case "gradient": shape.setFill({
					type: "radial",
					cx:50,
					cy:50,
					r: 50,
					colors: [
						{ offset: 0,   color: "white" },
	       			    { offset: 1, color: color}
	       			   ]
				});
				break;
			}

			return shape;
		},


		startup: function(){
			this.canvas = gfx.createSurface(this.gfxNode, 100, 100);
			switch(this.type){
				case "shapes": this._drawShape();
				break;
			}
			on(this, "click", lang.hitch(this, this.toggleActive));
		}
	});
});