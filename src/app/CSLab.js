define([
	"./activities/ActivitySplash",
	"./activities/Binary",
	"./activities/Boolean",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/cookie",
	"dojo/dom-construct",
	"dojo/Deferred",
	"dojo/json",
	"dojo/router",
	"dojo/topic",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/CSLab.html"
],function(ActivitySplash, Binary, Boolean, declare, lang, cookie, domConstruct, Deferred, json, router, topic, Dialog, Button, TextBox, _WidgetBase, _TemplatedMixin, template){

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

		_getUserNamePopup: function(){
			var pop, name, submit;

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

		_createCookie: function(name){
			cookie("profile", json.stringify({"name":name, date: new Date()}), {expires:5*365});
		},

		startup: function(){
			if(!this.user){
				// no user yet, lets check the cookies
				this.user = cookie("profile");
				if(!this.user){
					topic.subscribe("enteredUsername", this._createCookie);
					// first timer, let's setup a new user
					this._getUserNamePopup();
				}else{
					// got a cookie
					this.user = json.parse(this.user);
				}
			}
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