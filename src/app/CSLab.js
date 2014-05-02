define([
	"./activities/ActivitySplash",
	"./activities/Binary",
	"./activities/Boolean",
	"./TrophyShelf",
	"./Resources",
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
],function(ActivitySplash, Binary, Boolean, TrophyShelf, Resources, User, declare, lang, domConstruct, Deferred, router, topic, _WidgetBase, _TemplatedMixin, template){

	return declare([_WidgetBase, _TemplatedMixin], {
		//	set our template
		templateString: template,
		splash: null,
		user: null,
		_route2Act: {"binary":"Binary","boolean":"Boolean","sorting":"Sorting","searching":"Searching"},

		_onClick: function(evt){
			evt.preventDefault();
			router.go(evt.target.pathname);
		},

		_getActName: function(name){
			return this._route2Act[name];
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
			router.register("/(binary|boolean|sorting|searching|medals|resources)/?(.*)", lang.hitch(this, function(evt){
				var actName;
				if(evt.params[0] === "medals"){
					this.replaceContent(new TrophyShelf({user:this.user}));
				}else if(evt.params[0] === "resources"){
					this.replaceContent(new Resources({user:this.user}));
				}else{
					actName = this._getActName(evt.params[0]);
					if(this.splash && this.splash.activityName === actName){
						this.splash.setProblem(evt.params[1]);
					}else{
						console.log("new Activity, creating and placing problem");
	  					this.replaceContent(new ActivitySplash({actName:actName, user:this.user}));
	  					if(evt.params[1] !== ""){
	  						this.splash.setProblem(evt.params[1]);
	  					}
					}
				}
			}));
  			router.startup();
		}
	});
});