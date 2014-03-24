define([
	"./Binary",
	"./Boolean",
    "app/menu/MenuItemLevel",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dojo/request/xhr",
	"dojo/router",
	"dojo/topic",
    "dijit/form/Button",
	"dijit/ProgressBar",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ActivitySplash.html"
],function(Binary, Boolean, MenuItemLevel, declare, lang, domConstruct, html, on, xhr, router, topic, Button, ProgressBar, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.ActivitySplash",[_WidgetBase, _TemplatedMixin], {
		//	set our template

		constructor: function(args){
			this.activityName = args.actName;
            this.user = args.user;
		},

		templateString: template,
		activity: null,
		activityName: null,
		problemList: null,
		problem: null,
        user: null,
		progressBar: new ProgressBar({
        	style: "width: 90%"
    	}),

    	activitySuccess: function(){
    		// Get the activity, from here we can get
    		// name/number and compare to what we have stored for the user

            domConstruct.empty(this.containerNode);
            html.set(this.containerNode,"Success!");
           if(this.user.update(this.activityName, this.problem)){
                this.progressBar.set({value:(parseInt(this.progressBar.get("value"))+1)});
           }

            if(this.progressBar.get("value") == this.progressBar.get("maximum")){
                alert("You've completed this Activity!");
            }

            this._updateSidebar();
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

    	_createSidebar: function(problemList){
    		var i,j, level, levelList = [];
            prog = this.user.getProgress(this.activityName),
            compCounter = 0, counter = 0, levels = problemList.levels;
    		for(i=0; i < levels.length; i++){
    			level = problemList.levels[i];
    			levelList.push(new MenuItemLevel({level:level, activityName:this.activityName, prog: prog}).placeAt(this.sidebarContainerNode));
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
                   count += prog.problem;
                }else{
                    count += this.problemList.levels[i].length;
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
			topic.subscribe("ActivitySuccess", lang.hitch(this, this.activitySuccess));
		}
	});
});