define([
	"./activities/ActivitySplash",
	"./activities/Binary",
	"./activities/Boolean",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/Deferred",
	"dojo/router",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/CSLab.html"
],function(ActivitySplash, Binary, Boolean, declare, lang, domConstruct, Deferred, router, _WidgetBase, _TemplatedMixin, template){

	return declare([_WidgetBase, _TemplatedMixin], {
		//	set our template
		templateString: template,
		splash: null,

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
			domConstruct.empty(this.containerNode);
			router.register("/binary/?(.*)", lang.hitch(this, function(evt){
				if(this.splash && this.splash.activityName == "Binary"){
					console.log("existing Activity, placing problem");
  					this.splash.setProblem(evt.params[0]);
  				}else{
  					// async handled within splash page.
  					console.log("new Activity, creating and placing problem");
  					this.replaceContent(new ActivitySplash("Binary"));
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
  					this.replaceContent(new ActivitySplash("Boolean"));
  					if(evt.params[0] !== ""){
  						this.splash.setProblem(evt.params[0]);
  					}
  				}
  			}));
  			router.startup();
		}
	});
});