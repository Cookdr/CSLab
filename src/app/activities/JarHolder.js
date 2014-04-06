define([
	"./Jar",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/topic",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/JarHolder.html"
],function(Jar, declare, lang, domAttr, domClass, domConstruct, topic, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.JarHolder",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		weights: [],
		jars: [],
		flags: null,

		constructor: function(args){
			this.weights = args.weights;
			this.sorted = args.flags.sorted;
			this.flags = args.flags;
		},

		_buildJars: function(){
			var i;
			for(i=0; i < this.weights.length; i++){
				this.jars.push(new Jar({weight: this.weights[i], type: "sort"}).placeAt(this.containerNode));
			}
		},

		_checkSorted: function(){
			var prevWeight, i, weight, sorted = true, nodes = this.containerNode.childNodes;
			if(nodes.length > 1){
				prevWeight = registry.byId(nodes[0].id).weight;
				for(i=1; i < nodes.length; i++){
					weight = registry.byId(nodes[i].id).weight;
					if(weight < prevWeight){
						sorted = false;
						break;
					}else{
						prevWeight = weight;
					}
				}

				if(sorted === false){
					domClass.remove(this.containerNode, "sorted");
					return false;
				}else{
					domClass.add(this.containerNode, "sorted");
					return true;
				}
			}else{
				domClass.add(this.containerNode, "sorted");
				return true;
			}

		},

		_onDragOver: function(evt){
			evt.preventDefault();
		},

		_onDrop: function(evt){
			evt.preventDefault();
			var jar = registry.byId(evt.dataTransfer.getData("Text"));
			jar.placeAt(this.containerNode);
			if(this.sorted && this._checkSorted() && this.containerNode.children.length == this.weights.length){
				if(!this.flags.quicksort){
					topic.publish("AllSorted");
				}else if(this.flags.quicksort){

				}
			}
		},

		_onDragStart: function(evt){
			this._checkSorted();
		},

		postCreate: function(){
			if(this.sorted){
				domClass.add(this.containerNode, "sorted");
				domAttr.set(this.containerNode, "ondragstart", lang.hitch(this,this._onDragStart));
			}else{
				//unsorted
				this._buildJars();
			}
			domAttr.set(this.containerNode, "ondragover", lang.hitch(this,this._onDragOver));
			domAttr.set(this.containerNode, "ondrop", lang.hitch(this,this._onDrop));
		}
	
	});
});