define([
	"./Balance",
	"./JarHolder",
	"./Jar",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/json",
	"./_ActivityBase",
	"dojo/text!./templates/Sorting.html"
],function(Balance, JarHolder, Jar, declare, lang, domConstruct, json, _ActivityBase, template){

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

		_buildJars: function(){
			var i, weights = [];

			for(i=0; i < this.data.num; i++){
				weights.push(Math.floor(Math.random()*30));
			}

			return weights;
		},

		_setupInsertionSort: function(){
			var weights = this._buildJars();
			new JarHolder({weights: weights, sorted:false}).placeAt(this.unsortedNode);
			new Balance().placeAt(this.balanceNode);
			new JarHolder({weights: [], sorted:true}).placeAt(this.sortedNode);
		},

		_setupQuicksort: function(){

		},

		postCreate: function(){

			if(this.type === "insertion"){
				this._setupInsertionSort();

			}else if(this.type === "quicksort"){

			}

		}
	
	});
});