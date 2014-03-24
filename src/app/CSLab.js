define([
	"./activities/ActivitySplash",
	"./activities/Binary",
	"./activities/Boolean",
	"./TrophyShelf",
	"./User",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/Deferred",
	"dojo/router",
	"dojo/topic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/CSLab.html"
],function(ActivitySplash, Binary, Boolean, TrophyShelf, User, declare, lang, domConstruct, Deferred, router, topic, _WidgetBase, _TemplatedMixin, template){

	return declare([_WidgetBase, _TemplatedMixin], {
		//	set our template
		templateString: template,
		splash: null,
		user: null,

		_onClick: function(evt){
			evt.preventDefault();
			router.go(evt.target.pathname);
		},

		replaceContent: function(splash){
			// change to a this._set at some point if it will work
			if(this.splash){
				this.splash.destroyRecursive();
			}
			this.splash = splash;
			this.splash.placeAt(this.containerNode);
			this.splash.startup();
		},

		startup: function(){
			if(!this.user){
				this.user = new User();
			}
			domConstruct.empty(this.containerNode);
			router.register("/binary/?(.*)", lang.hitch(this, function(evt){
				if(this.splash && this.splash.activityName == "Binary"){
					console.log("existing Activity, placing problem");
  					this.splash.setProblem(evt.params[0]);
  				}else{
  					// async handled within splash page.
  					console.log("new Activity, creating and placing problem");
  					this.replaceContent(new ActivitySplash({actName:"Binary", user:this.user}));
  					if(evt.params[0] !== ""){
  						this.splash.setProblem(evt.params[0]);
  					}
  				}
  			}));

  			router.register("/boolean/?(.*)", lang.hitch(this, function(evt){
				if(this.splash && this.splash.activityName == "Boolean"){
					console.log("existing Activity, placing problem");
  					this.splash.setProblem(evt.params[0]);
  				}else{
  					// async handled within splash page.
  					console.log("new Activity, creating and placing problem");
  					this.replaceContent(new ActivitySplash({actName:"Boolean", user:this.user}));
  					if(evt.params[0] !== ""){
  						this.splash.setProblem(evt.params[0]);
  					}
  				}
  			}));

  			router.register("/medals", lang.hitch(this, function(evt){
				if(this.splash && this.splash.activityName == "Medals"){
					console.log("existing Activity, showing medals");
  				}else{
  					// async handled within splash page.
  					console.log("Showing medals");
  					this.replaceContent(new TrophyShelf({user:this.user}));
  				}
  			}));
  			router.startup();
		}
	});
});