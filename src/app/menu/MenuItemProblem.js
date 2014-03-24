define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/html",
	"dojo/on",
	"dojo/router",
	"dijit/form/Button",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/MenuItemProblem.html"
],function(declare, lang, domConstruct, domClass, domStyle, html, on, router, Button, _WidgetBase, _TemplatedMixin, template){

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
		},

		setActive: function(){
			this.button.set("disabled", false);
		},
		
		postCreate: function(){
			this.button = new Button({
                    label: "Problem "+(this.problem+1),
                    dest: "/"+this.activityName.toLowerCase()+"/"+this.level+"/"+(this.problem+1),
                    onClick: function(evt){
                        router.go(this.dest);
                    }
                }).placeAt(this.containerNode);
			this.button.set("disabled", !this.active);
		}
	});
});