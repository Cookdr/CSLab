define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dojo/json",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Jar.html"
],function(declare, lang, domAttr, domConstruct, json, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.Jar",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		weight: 0,
		heavy: false,
		normal: true,

		constructor: function(weight){
			this.weight = weight;
		},

		lighter: function(){
			this._animate(0,-1);
			this.normal = false;
		},

		heavier: function(){
			this._animate(0,1);
			this.heavy = true;
			this.normal = false;
		},

		normalize: function(){
			clearInterval(this.animation);
			if(!this.normal && !this.heavy){
				this._animate(-20,1);
			}else if(!this.normal){
				this._animate(20,-1);
			}
		},

		cleanUp: function(){
			clearInterval(this.animation);
			this.containerNode.style.marginTop="0px";
		},

		_animate: function(curPos, offset){
			var i = 1, node = this.containerNode;
			this.animation = setInterval(function () {
			        if (i <=20) {
			            node.style.marginTop=(curPos+(i*offset))+"px";
			        } else {
			            clearInterval(this.animation);
			        }
			        i++;
			    }, 50); 
		},

		_onDragStart: function(evt){
			var img = domConstruct.create("img", {src:"app/resources/images/jar.png", width:60, heigth:100});
			evt.dataTransfer.setData("text", this.id);
			evt.dataTransfer.setDragImage(img, 30,50);
			console.log("dragin jar with weigth: "+this.weight);
		},

		postCreate: function(){
			domAttr.set(this.containerNode, "draggable", "true");
			domAttr.set(this.containerNode, "ondragstart", lang.hitch(this,this._onDragStart));
		}
	
	});
});