define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Balance.html"
],function(declare, lang, domAttr, domConstruct, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.Balance",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		leftJar: null,
		rightJar: null,

		measure: function(){
			var less, more;
			if(this.leftJar.weight < this.rightJar.weight){
				less = this.leftJar;
				more = this.rightJar;
			}else if(this.leftJar.weight > this.rightJar.weight){
				less = this.rightJar;
				more = this.leftJar;
			}

			if(less || more){
				more.heavier();
				less.lighter();
			}
		},

		// When something is getting dragged out.
		_onDragStart: function(evt){
			if(evt.currentTarget === this.leftNode){
				if(this.rightJar){
					this.rightJar.normalize();					
				}
				this.leftJar.cleanUp();
				this.leftJar = null;
			}else{
				if(this.leftJar){
					this.leftJar.normalize();
				}
				this.rightJar.cleanUp();
				this.rightJar = null;
			}
		},

		_onDrop: function(evt){
			evt.preventDefault();
			var dest, jar = registry.byId(evt.dataTransfer.getData("Text"));
			dest = evt.currentTarget === this.leftNode ? this.leftNode : this.rightNode;

			if(dest === this.leftNode){
				this.leftJar = jar;

			}else{
				this.rightJar = jar;
			}
			jar.placeAt(dest);

			if(this.leftJar && this.rightJar){
				this.measure();
			}
		},

		_onDragOver: function(evt){
			var dest = evt.currentTarget === this.leftNode ? this.leftNode : this.rightNode;
			if(dest === this.leftNode){
				if(!this.leftJar){
					evt.preventDefault();
				}	
			}else if(!this.rightJar){
				evt.preventDefault();
			}
		},

		_onDragEnter: function(evt){
			evt.preventDefault();
		},

		postCreate: function(){
			domAttr.set(this.leftNode, "ondragstart", lang.hitch(this,this._onDragStart));
			domAttr.set(this.rightNode, "ondragstart", lang.hitch(this,this._onDragStart));

			domAttr.set(this.leftNode, "ondrop", lang.hitch(this,this._onDrop));
			domAttr.set(this.rightNode, "ondrop", lang.hitch(this,this._onDrop));

			domAttr.set(this.leftNode, "ondragover", lang.hitch(this,this._onDragOver));
			domAttr.set(this.rightNode, "ondragover", lang.hitch(this,this._onDragOver));

			domAttr.set(this.leftNode, "ondragover", lang.hitch(this,this._onDragOver));
			domAttr.set(this.rightNode, "ondragover", lang.hitch(this,this._onDragOver));

			domAttr.set(this.leftNode, "ondragenter", lang.hitch(this,this._onDragEnter));
			domAttr.set(this.rightNode, "ondragenter", lang.hitch(this,this._onDragEnter));
			
		}
	
	});
});