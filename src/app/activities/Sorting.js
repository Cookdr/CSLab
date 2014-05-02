define([
	"./Balance",
	"./JarHolder",
	"./Jar",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/json",
	"dojo/topic",
	"./_ActivityBase",
	"dojo/text!./templates/Sorting.html"
],function(Balance, JarHolder, Jar, declare, lang, domConstruct, html, json, topic, _ActivityBase, template){

	return declare("app.activities.Sorting",[_ActivityBase], {

		//	set our template
		templateString: template,
		name: "Sorting",

		constructor: function(problem){	
			this.problem = problem;
			this.type = problem.type;
			this.flags = problem.flags;
			this.data = problem.problemData;
		},

		_addJars: function(data){
			if(data){

			}
		},

		_buildWeights: function(){
			var i, weights = [];

			for(i=0; i < this.data.num; i++){
				weights.push(Math.floor(Math.random()*30));
			}

			return weights;
		},

		_setupSelectionSort: function(){
			var weights = this._buildWeights();
			html.set(this.instructionsNode, "Using the balance scale below place the Jars in increasing order in the bottom bin.")
			new JarHolder({weights: weights, flags:{sorted:false, quicksort:false}}).placeAt(this.unsortedNode);
			new Balance().placeAt(this.balanceNode);
			new JarHolder({weights: weights, flags:{sorted:true, quicksort:false}}).placeAt(this.sortedNode);
			this.emptyHandler = topic.subscribe("balanceEmpty", lang.hitch(this, this._addJars));
		},

		_setupQuicksort: function(){
			var weights = this._buildWeights();
			new JarHolder({weights: weights, flags:{sorted:true, quicksort:false}}).placeAt(this.sortedNode);
		},

		postCreate: function(){

			if(this.type === "selection"){
				this._setupSelectionSort();

			}else if(this.type === "quicksort"){

			}
			topic.subscribe("AllSorted", lang.hitch(this, this.success));

		}
	});
});