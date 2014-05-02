define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/hash",
	"dojo/html",
	"dojo/on",
	"dojo/router",
	"dojo/topic",
	"dijit/form/Button",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/MenuItemProblem.html"
],function(declare, lang, domConstruct, domClass, domStyle, hash, html, on, router, topic, Button, _WidgetBase, _TemplatedMixin, template){

	return declare("app.menu.MenuItemProblem",[_WidgetBase, _TemplatedMixin], {

		templateString: template,
		active: false,
		level: null,
		problem: null,
		button: null,
		activityName: null,

		constructor: function(args){
			this.level = args.level;
			this.problem = args.problem;
			this.activityName = args.activityName;
			this.active = args.active;
			this.button = new Button({
                    label: "Problem "+(this.problem+1),
                    disabled: !this.active,
                    dest: "/"+this.activityName.toLowerCase()+"/"+this.level+"/"+(this.problem+1),
                    onClick: function(evt){
                    	if(this.dest === hash()){
                    		topic.publish("ResetProblem",this.dest);
                    	}else{
                    		router.go(this.dest);
                    	}
                    }
                });
		},

		setActive: function(){
			if(!this.active){
				this.button.set("disabled", false);
				this.active = true;
			}
		},
		
		postCreate: function(){
			this.button.placeAt(this.containerNode);
		}
	});
});