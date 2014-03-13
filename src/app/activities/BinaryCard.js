define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/html",
	"dojo/on",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/BinaryCard.html"
],function(declare, lang, domConstruct, domClass, domStyle, html, on, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.BinaryCard",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		type: null,
		decVal: 0,
		active: false,
		clickable: true,
		updateActive: null,

		_toggleDotsActive: function(){
			this.active = !this.active;
			domClass.toggle(this.containerNode, "binaryCardDeactive");
			this.updateActive();
		},


		_activateDots: function(){
			this.active = false;
			domClass.remove(this.containerNode, "binaryCardDeactive");
		},

		_deactivateDots: function(){
			this.active = false;
			domClass.add(this.containerNode, "binaryCardDeactive");
		},

		_toggleBinaryActive: function(){
			this.active = !this.active;
			if(this.active){
				this._activateBinary();
			}else{
				this._deactivateBinary();
			}
			this.updateActive();
		},
		
		_activateBinary: function(){
			this.active = true;
			html.set(this.containerNode, "1");
		},
		
		_deactivateBinary: function(){
			this.active = false;
			html.set(this.containerNode, "0");
		},


		startup: function(){
			switch(this.type){
				case "dots": domClass.add(this.containerNode,"binaryCard"+this.decVal);
							domClass.add(this.containerNode, "binaryCardDeactive");
							this.activate = this._activateDots;
							this.deactivate = this._deactivateDots;
							this.toggleActive = this._toggleDotsActive;
				break;
				case "binary": html.set(this.containerNode, "0");
								this.activate = this._activateBinary;
								this.deactivate = this._deactivateBinary;
								this.toggleActive = this._toggleBinaryActive;
				break;
			}
			on(this, "click", lang.hitch(this, this.toggleActive));
		}
	});
});