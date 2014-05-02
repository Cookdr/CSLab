define([
	"./Jar",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/html",
	"dojo/topic",
	"dijit/registry",
	"./_ActivityBase",
	"dojo/text!./templates/Searching.html"
],function(Jar, declare, lang, domAttr, domClass, html, topic, registry, _ActivityBase, template){

	return declare("app.activities.Searching",[_ActivityBase], {
		//	set our template
		templateString: template,
		name: "Searching",
		problem: null,
		type: "",
		flags: null,
		data: null,
		jars: [],
		_clicksUsed:0,
		_clicksAllowed:0,
		_attempts: 0,

		constructor: function(problem){	
			this.problem = problem;
			this.type = problem.type;
			this.flags = problem.flags;
			this.data = problem.problemData;

			this._clicksAllowed = this.data.values.length /2;
		},

		_buildJars: function(){
			var i;
			for(i=0; i < this.data.values.length; i++){
				this.jars.push(new Jar({weight: this.data.values[i], type: "search"}).placeAt(this.jarsNode));
			}
		},

		_clickUsed: function(){
			this._clicksUsed++;
			if(this._clicksUsed === this._clicksAllowed){
				var i;
				for(i=0; i< this.jars.length; i++){
					this.jars[i].removeFlip();
				}
				html.set(this.clicksUsedNode, this._clicksUsed.toString());
				domClass.add(this.clicksUsedNode.parentNode, "error");
			}else if(this._clicksUsed < this._clicksAllowed){
				html.set(this.clicksUsedNode, this._clicksUsed.toString());
			}
		},

		_allowDrop: function(evt){
			evt.preventDefault();
		},

		_removeIncorrectClass: function(){
			domClass.remove(this.targetJarNode, "incorrectSearch");
		},

		_onTargetDrop: function(evt){
			evt.preventDefault();
			this._attempts++;
			var selected = registry.byId(evt.dataTransfer.getData("text/plain"));

			if(selected.weight === this.data.target){
				this.success();
			}else{
				domClass.add(this.targetJarNode, "incorrectSearch");
				setTimeout(lang.hitch(this, this._removeIncorrectClass), 1000);
				if(this._attempts > 3){
					this.failure(this.name, this.problem, "Too many attempts. Remember that if you follow the algorithm you'll be able to reduce the number of possibiliteis by half with each flip.");
				}
			}
		},

		postCreate: function(){
			this._buildJars();
			this._clickUsedHandler = topic.subscribe("ClickUsed", lang.hitch(this, this._clickUsed));

			html.set(this.instructionsNode, "Your task is the find the Jar with a value of "+this.data.target+" from the Jars below (already sorted by increasing value) and place it in the selection bin. Remember that you have a limited number of flips so use them wisely!");
			html.set(this.clicksAllowedNode, this._clicksAllowed.toString());
			domAttr.set(this.targetJarNode, "ondragover", lang.hitch(this, this._allowDrop));
			domAttr.set(this.targetJarNode, "ondrop", lang.hitch(this, this._onTargetDrop));
		},

		destroy: function(){
			this._clickUsedHandler.remove();
		}
		
	});
});