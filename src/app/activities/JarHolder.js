define([
	"./Jar",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/JarHolder.html"
],function(Jar, declare, lang, domAttr, domConstruct, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.JarHolder",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		weights: [],
		jars: [],
		sorted: false,

		constructor: function(args){
			this.weights = args.weights;
			this.sorted = args.sorted;
		},

		_buildJars: function(){
			var i;
			for(i=0; i < this.weights.length; i++){
				this.jars.push(new Jar(this.weights[i]).placeAt(this.containerNode));
			}
		},

		_onDragOver: function(evt){
			evt.preventDefault();
		},

		_onDrop: function(evt){
			evt.preventDefault();
			var jar = registry.byId(evt.dataTransfer.getData("Text"));
			jar.placeAt(this.containerNode);
		},

		postCreate: function(){
			this._buildJars();

			domAttr.set(this.containerNode, "ondragover", lang.hitch(this,this._onDragOver));
			domAttr.set(this.containerNode, "ondrop", lang.hitch(this,this._onDrop));
		}
	
	});
});