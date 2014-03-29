define([ 
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/aspect",
	"dojo/cookie",
	"dojo/json",
	"dojo/request/xhr",
	"dojo/topic",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/TextBox"
	], function(declare, lang, aspect, cookie, json, xhr, topic, Dialog, Button, TextBox){

	return declare(null, {
		// These should be saved
		name: null,
		binaryProgress: {level: 0, problem: -1},
		booleanProgress: {level: 0, problem: -1},
		searchProgress: {level: 0, problem: -1},
		sortProgress: {level: 0, problem: -1},
		medals: [],
		binPB: [],
		boolPB: [],
		sortPB: [],
		searchPB: [],
		// these should not
		_problemList: null,
		_medalList: null,
		_fieldList: ["name","binaryProgress", "booleanProgress","searchProgress","sortProgress","medals",
					"binPB","boolPB","searchPB","sortPB"],


		constructor: function(){
			this.fetch();
		},

		save: function(){
			cookie("profile", json.stringify(this._createCookieObject()), {expires:5*365});
		},
		update: function(activity, problem){
			var updateFunc, curProgress, medals = [], newProb = false, newLevel = false, fin = false;
			problem = problem.split('/');
			// -1 because we're getting the url version so 1/1 for what will be 0/0 in
			problem = {level: parseInt(problem[0])-1, problem: parseInt(problem[1])-1};
			if(problem.problem === this._problemList.levels[problem.level].problems.length-1){
				problem = {level: problem.level+1, problem: -1};
				newLevel = true;
				if(problem.level === this._problemList.levels.length){
					fin = true;
				}
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
				medals = this._checkMedals(activity, problem);
				if(medals){
					// adding and saving medals if we got any
					this.medals = this.medals.concat(medals);
				}
				updateFunc(problem);
				this.save();
				newProb = true;
			}
				return {newProb: newProb, newLevel: newLevel, fin:fin, medals: medals};
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
			xhr("app/resources/data/medals.json", {
                handleAs: "json",
                preventCache: false
            }).then(lang.hitch(this, function(data){
                this._medalList = data.medals;
            }), function(err){
                console.log(err);
            });
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

			return (prob.level < prog.level || prob.level === prog.level && prob.problem <= prog.problem+1) ? true : false;

		},

		setProblemList: function(problemList){
			this._problemList = problemList;
		},

		_checkMedals: function(activity, problem){
			var i, medal, medals = [];
			for(i=0; i < this._medalList.length; i++){
				medal = this._medalList[i];
				if(medal.activity === activity && medal.condition.cond === problem.level && problem.problem === -1){
					medals.push(medal);
				}
			}
			return medals;
		},

		_createCookieObject: function(){
			var i, field, obj = {};
			for(i=0; i < this._fieldList.length; i++){
				field = this._fieldList[i];
				obj[field] = this[field];
			}
			return obj;
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
