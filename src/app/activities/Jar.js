define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dojo/json",
	"dojo/on",
	"dojo/topic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Jar.html"
],function(declare, lang, domAttr, domConstruct, json, on, topic, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.Jar",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		weight: 0,
		type: "",
		heavy: false,
		normal: true,
		clickHanlder: null,

		constructor: function(args){
			this.weight = args.weight;
			this.type = args.type;
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

		removeFlip: function(){
			if(this.clickHandler){
				this.clickHandler.remove();
				this.clickHandler =	on(this.containerNode, "click", lang.hitch(this, this._noFlip));
			}
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

		_flip: function(){
			domConstruct.create("h2", {innerHTML: this.weight}, this.containerNode);
			this.clickHandler.remove();
			topic.publish("ClickUsed");
		},

		_noFlip: function(){
			topic.publish("ClickUsed");
		},
		
		postCreate: function(){
			switch(this.type){
				case "sort":			
								domAttr.set(this.containerNode, "ondragstart", lang.hitch(this,this._onDragStart));
				break;
				case "search": 	
								this.clickHandler = on(this.containerNode, "click", lang.hitch(this, this._flip));
									domAttr.set(this.containerNode, "ondragstart", lang.hitch(this,this._onDragStart));

				break;
			}
			domAttr.set(this.containerNode, "draggable", "true");
		},

		destory: function(){
			if(this.clickHandler){
				this.clickHandler.remove();
			}
		}
	
	});
});