define([
	"./Binary",
	"./Boolean",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dojo/request/xhr",
	"dojo/router",
	"dojo/topic",
	"dijit/ProgressBar",
	"dijit/registry",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ActivitySplash.html"
],function(Binary, Boolean, declare, lang, domConstruct, html, on, xhr, router, topic, ProgressBar, registry, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.ActivitySplash",[_WidgetBase, _TemplatedMixin], {
		//	set our template

		constructor: function(activityName){
			this.activityName = activityName;
			switch(activityName){
				case "Binary" : xhr("app/resources/data/BinaryProblems.json", {
							      	handleAs: "json",
                                    preventCache: true
							    }).then(lang.hitch(this, function(data){
							    	this.problemList = data;
							    	this.updateSidebar(this.problemList);
                                    if(this.problem){
							    	    this.placeProblem();
                                    }
							  	}), function(err){
							    	console.log(err);
							  	});
				break;
				case "Boolean" : this.activity = new Boolean();
				break;
				default: this.activity = new Binary();
			}
		},

		templateString: template,
		activity: null,
		activityName: null,
		problemList: null,
		problem: null,
		progressBar: new ProgressBar({
        	style: "width: 90%"
    	}),

    	activitySuccess: function(){
    		// Get the activity, from here we can get
    		// name/number and compare to what we have stored for the user

    		this.progressBar.set({value:(parseInt(this.progressBar.get("value"))+1)});
            domConstruct.empty(this.containerNode);
            html.set(this.containerNode,"Success!");
    	},

    	setProblem: function(problem){
    		//if(this.problem){
    			if(this.problemList && problem != this.problem){
    				console.log("Setting problem: "+problem);
    				this.problem = problem;
    				this.placeProblem();
    			} else{
                    this.problem = problem;
                }
    	//	}else{
    	//		this.problem = problem;
         //       this.placeProblem();
    	//	}
    	},

    	placeProblem: function(){
   //  		dojo.forEach(registry.findWidgets(this.containerNode), function(w) {
   //  			w.destroyRecursive();
			// });
            domConstruct.empty(this.containerNode);
    		// Add error checking to make sure it's a valid problem
    		// and not just garbage in the hash.
    		var splitProb, level, problem;
    		console.log("placing problem: "+this.problem);
    		if(this.problem){
    			splitProb = this.problem.split("/");
    			switch(splitProb.length){
    				case 1: console.log("only have a level");	
    						level = parseInt(splitProb[0]);
    						break;
    				case 2: console.log("Level "+splitProb[0]+" Problem: "+splitProb[1]);
    						level = parseInt(splitProb[0])-1;
    						problem = parseInt(splitProb[1])-1;
    						this.activity = new Binary(this.problemList.levels[level].problems[problem]);
    						this.activity.placeAt(this.containerNode);
    						break;
    				default: console.log("something wrong with problem: "+this.problem);
    			}
    		}else{
    			console.log("no problem");
    		}
    	},

    	updateSidebar: function(problemList){
    		var i,j,list, level, link, counter = 0, levels = problemList.levels;
    		for(i=0; i < levels.length; i++){
    			level = problemList.levels[i];
    			domConstruct.create("h2", {innerHTML: "Level "+level.level.toString()},this.sidebarContainerNode);
    			list = domConstruct.create("ol",null,this.sidebarContainerNode);
    			for(j = 0; j< level.problems.length; j++){
    				link = domConstruct.create("li",{innerHTML: '<a href="/'+this.activityName.toLowerCase()+'/'+(i+1)+'/'+(j+1)+'">'+"Problem "+j+"</a>"}, list);
    				on(link, "click", lang.hitch(this, function(evt){
    					evt.preventDefault();
						router.go(evt.target.pathname);
    				}));
    				counter++;
    			}
    		}
    		this.progressBar.set("maximum",counter);
    	},

		postCreate: function(){
			this.progressBar.placeAt(this.progressBarNode);
			html.set(this.activityTitleNode, this.activityName);
			topic.subscribe("ActivitySuccess", lang.hitch(this, this.activitySuccess));
		}
	});
});