define([ 
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/cookie",
	"dojo/json",
	"dojo/topic",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/TextBox"
	], function(declare, lang, aspect, cookie, json, topic, Dialog, Button, TextBox){

	return declare(null, {
		name: null,
		problemList: null,
		binaryProgress: {level: 0, problem: -1},
		booleanProgress: {level: 0, problem: -1},
		searchProgress: {level: 0, problem: -1},
		sortProgress: {level: 0, problem: -1},
		medals: [],

		constructor: function(){
			this.fetch();
		},

		save: function(){
			cookie("profile", json.stringify({
				name: this.name, 
				binaryProgress: this.binaryProgress, 
				booleanProgress: this.booleanProgress, 
				searchProgress: this.searchProgress, 
				sortProgress: this.sortProgress,
				medals: this.medals
			}), {expires:5*365});
		},

		update: function(activity, problem){
			var updateFunc, curProgress;
			problem = problem.split('/');
			// -1 because we're getting the url version so 1/1 for what will be 0/0 in
			problem = {level: parseInt(problem[0])-1, problem: parseInt(problem[1])-1};
			if(problem.problem === this.problemList.levels[problem.level].problems.length-1){
				problem = {level: problem.level+1, problem: -1};
			}

			switch(activity){
					case "Binary": updateFunc = lang.hitch(this, this._updateBinaryProgress);
								   curProgress = this.binaryProgress;
					break;
					case "Boolean": updateFunc = lang.hitch(this, this._updateBooleanProgress);
									curProgress = this.booleanProgress;
					break;
			}

			if(problem.level > curProgress.level || 
				((problem.level === curProgress.level) && (problem.problem > curProgress.problem))){
				updateFunc(problem);
				this.save();
				return true;
			}
				return false;
		},

		fetch: function(){
			var userData = cookie("profile");
			if(userData){
				userData = json.parse(userData);
				this.name = userData.name;
				this.binaryProgress = userData.binaryProgress;
				this.booleanProgress = userData.booleanProgress;
				this.searchProgress = userData.searchProgress;
				this.sortProgress = userData.sortProgress;
				this.medals = userData.medals;
			}else{
				this._getUserNamePopup();
			}
		},

		getProgress: function(actName){
			switch(actName){
				case "Binary": return this.binaryProgress;
				break;
				case "Boolean": return this.booleanProgress;
				break;
				default: return null;
			}
		},

		hasAccess: function(problem, actName){
			var prog = this.getProgress(actName),
			prob = problem.split('/');
			// -1 because we're getting the url version so 1/1 for what will be 0/0 in
			prob = {level: parseInt(prob[0])-1, problem: parseInt(prob[1])-1};

			return (prob.level <= prog.level+1 && prob.problem <= prog.problem+1) ? true : false;

		},

		setProblemList: function(problemList){
			this.problemList = problemList;
		},

		_getUserNamePopup: function(){
			var pop, name, submit;
			topic.subscribe("enteredUsername", lang.hitch(this,this._gotName));

			pop = new Dialog({
				title: "Welcome!",
				content: "Hello! It looks like it's your first time here, what's your name?<br/>"
			});

			name = new TextBox({
				placeholder: "Name"
			}).placeAt(pop.containerNode);

			submit = new Button({
				label: "Submit",
				onClick: function(){
					topic.publish("enteredUsername", name.get("value"));
					pop.destroyRecursive();
				}
			}).placeAt(pop.containerNode);

			pop.show();
		},
		_gotName: function(name){
			this.name = name;
			this.save();

		},

		_updateBinaryProgress: function(problem){
			this.binaryProgress = problem;
		},

		_updateBooleanProgress: function(problem){
			this.booleanProgress = problem;
		}

	});
});
