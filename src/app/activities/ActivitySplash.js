define([
	"./Binary",
	"./Boolean",
    "./Sorting",
    "./Searching",
    "app/menu/MenuItemLevel",
    "app/Medal",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dojo/request/xhr",
	"dojo/router",
    "dojo/string",
	"dojo/topic",
    "dijit/form/Button",
    "dijit/Dialog",
	"dijit/ProgressBar",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ActivitySplash.html"
],function(Binary, Boolean, Sorting, Searching, MenuItemLevel, Medal, declare, lang, domConstruct, html, on, xhr, router, stringUtil, topic, Button, Dialog, ProgressBar, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.ActivitySplash",[_WidgetBase, _TemplatedMixin], {
		//	set our template

		constructor: function(args){
			this.activityName = args.actName;
            this.user = args.user;
            this.progressBar = new ProgressBar({
                style: "width: 90%"
             });
		},

		templateString: template,
		activity: null,
		activityName: null,
		problemList: null,
		problem: null,
        user: null,
		progressBar:null,
        _successHandler: null,
        successDialog: null,
        _finTemplate:"<div><h2>Congratulations ${name}!</h2> <p>You've completed this Activity! Feel free to come back and come back and rework some of the problems, especially the timed ones. You may find that there are some surprises to be earned!</p></div>",
        _finLevelTemplate: "<div><h2>Congratulations ${name}!</h2> <p>You've completed this Level! Now the next level is going to be a little different but don't be discouraged if you find it tricky at first.</p></div>",
        _finProbTemplate: "<div><h2>Congratulations ${name}!</h2> <p>You've completed this Problem!</p></div>",

    	activitySuccess: function(){
            var updateResults;
    		// Get the activity, from here we can get
    		// name/number and compare to what we have stored for the user
            // newProb, newLevel, fin, medals
            updateResults = this.user.update(this.activityName, this.problem);
            if(updateResults.newProb){
                this.progressBar.set("value",parseInt(this.progressBar.get("value"))+1);
            }
            this._buildSuccessDialog(updateResults);

            // if(this.progressBar.get("value") == this.progressBar.get("maximum")){
            //     alert("You've completed this Activity!");
            // }

            this._updateSidebar();
    	},

        activityFailure: function(args){
            this.directPlaceProblem(args.actName, args.problem);
        },

    	setProblem: function(problem){
            if(problem != ""){
                if(this.user.hasAccess(problem, this.activityName)){
        			if(this.problemList && problem != this.problem){
        				console.log("Setting problem: "+problem);
        				this.problem = problem;
        				this.placeProblem();
        			} else{
                        this.problem = problem;
                    }
                }else{
                    router.go("/"+this.activityName.toLowerCase());
                }
            }
    	},

        directPlaceProblem: function(actName, problem){
            domConstruct.empty(this.containerNode); 
            this.activityName = actName;
            this._createActivity(problem);
            this.activity.placeAt(this.containerNode);
        },

    	placeProblem: function(){
            domConstruct.empty(this.containerNode);
    		// Add error checking to make sure it's a valid problem
    		// and not just garbage in the hash.
    		var splitProb, level, problem;
    		console.log("placing problem: "+this.problem);
    		if(this.problem && this.problem !== ""){
    			splitProb = this.problem.split("/");
    			switch(splitProb.length){
    				case 1: console.log("only have a level");	
    						level = parseInt(splitProb[0]);
    						break;
    				case 2: console.log("Level "+splitProb[0]+" Problem: "+splitProb[1]);
    						level = parseInt(splitProb[0])-1;
    						problem = parseInt(splitProb[1])-1;
                            this._createActivity(this.problemList.levels[level].problems[problem]);
    						this.activity.placeAt(this.containerNode);
    						break;
    				default: console.log("something wrong with problem: "+this.problem);
    			}
    		}else{
    			console.log("no problem");
                this._showHome();
    		}
    	},

        _buildMedalsArea: function(medals){
            var i, node,medalsArea = domConstruct.create("div", {"class": "medalArea"});
            for(i=0; i < medals.length; i++){
               node = domConstruct.create("div");
               new Medal(medals[i]).placeAt(medalsArea);
            }
            return medalsArea;
        },

        _buildSuccessDialog: function(updateResults){
            var cont, msgTemplate;

            this.successDialog = new Dialog({
                title: "Success!"
            });

            if(updateResults.fin){
                msgTemplate = this._finTemplate;
            }else if(updateResults.newLevel){
                msgTemplate = this._finLevelTemplate;
            }else{
                msgTemplate = this._finProbTemplate;
            }

            domConstruct.place(stringUtil.substitute(msgTemplate,
            {
                name: this.user.name
            }), this.successDialog.containerNode);

           if(updateResults.medals.length > 0){
                domConstruct.place(this._buildMedalsArea(updateResults.medals), this.successDialog.containerNode);
           } 

            cont = new Button({
                label: "Continue",
                onClick: lang.hitch(this, function(){
                    this.successDialog.destroyRecursive();
                    domConstruct.empty(this.containerNode);
                })
            }).placeAt(this.successDialog.containerNode);
            this.successDialog.show();
        },

    	_createSidebar: function(problemList){
    		var i,j, level, levelList = [];
            prog = this.user.getProgress(this.activityName),
            compCounter = 0, counter = 0, levels = problemList.levels;
    		for(i=0; i < levels.length; i++){
    			level = problemList.levels[i];
    			levelList.push(new MenuItemLevel({level:level, activityName:this.activityName, prog: prog}).placeAt(this.sidebarContainerNode));
                counter+= this.problemList.levels[i].problems.length;
    		}
    		this.progressBar.set("maximum",counter);
            this.progressBar.set("value", this._countCompProblems());

            return levelList;
    	},

        _updateSidebar: function(){
            var i;
            for(i=0; i < this.levelList.length; i++){
                this.levelList[i].update(this.user.getProgress(this.activityName));
            }
        },

        _countCompProblems: function(){
            var i, j, count = 0, prog = this.user.getProgress(this.activityName);
            for(i=0; i <= prog.level; i++){
                if(i === prog.level){
                   count += prog.problem > 0 ? prog.problem : 0;
                }else{
                    count += this.problemList.levels[i].problems.length;
                }
            }
            return count;
        },

        _createActivity: function(problem){
            var act;
            switch(this.activityName){
                case "Binary": act = new Binary(problem);
                break;
                case "Boolean": act = new Boolean(problem);
                break;
                case "Sorting": act = new Sorting(problem);
                break;
                case "Searching": act = new Searching(problem);
                break;
                default: act = new Binary();
            }

            this.activity = act;
        },
        _showHome: function(){
            domConstruct.empty(this.contaierNode);
            html.set(this.containerNode, "Please Select a Problem");
        },

		postCreate: function(){
            xhr("app/resources/data/"+this.activityName+"Problems.json", {
                handleAs: "json",
                preventCache: true
            }).then(lang.hitch(this, function(data){
                this.problemList = data;
                this.user.setProblemList(this.problemList);
                this.levelList = this._createSidebar(this.problemList);
                if(this.problem){
                    this.placeProblem();
                }
            }), function(err){
                console.log(err);
            });

			this.progressBar.placeAt(this.progressBarNode);
			html.set(this.activityTitleNode, this.activityName);
			this._successHandler = topic.subscribe("ActivitySuccess", lang.hitch(this, this.activitySuccess));
            this._failureHandler = topic.subscribe("ActivityFailure", lang.hitch(this, this.activityFailure));
		},
        destroy: function(){
            this.progressBar.destroy();
            if(this.activity){
                this.activity.destroy();
            }
            this._successHandler.remove();
            this._failureHandler.remove();
            this.inherited(arguments);
        }
	});
});