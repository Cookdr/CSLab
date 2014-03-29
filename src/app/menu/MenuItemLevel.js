define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"./MenuItemProblem",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/html",
	"dojo/on",
	"dijit/TitlePane",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/MenuItemLevel.html"
],function(declare, lang, MenuItemProblem, domConstruct, domClass, domStyle, html, on, TitlePane, _WidgetBase, _TemplatedMixin, template){

	return declare("app.menu.MenuItemLevel",[_WidgetBase, _TemplatedMixin], {
		templateString: template,
		problemItems: null,
		active: false,
		prog: null,
		level: null,
		activityName: null,
		titlePane: null,

		constructor: function(args){
			this.level = args.level;
			this.activityName = args.activityName;
			this.problemItems = [];
			this.prog = prog;

			if(this.prog.level >= this.level.level-1){
				this.active = true;
			}

			this.titlePane = new TitlePane({
				title: "Level "+this.level.level,
				open: this.active
			});
		},

		update:function(prog){
			var i, lim = -1;
			if(this.level.level-1 === prog.level){
				lim = prog.problem+1
				if(!this.titlePane.get('open')){
					this.titlePane.set('open', true);
				}
			}else if(this.level.level-1 < prog.level){
				lim = this.problemItems.length-1;
			}

			for(i=0; i <= lim; i++){
				this.problemItems[i].setActive();
			}
		},

		postCreate: function(){
			var activeProblem;
			this.titlePane.placeAt(this.containerNode);
			
			//html.set(this.levelTitleNode, "Level "+this.level.level);
			for(j = 0; j< this.level.problems.length; j++){
				if(!this.active){
					activeProblem = false;
				}else{
					if(this.prog.level === this.level.level-1){
						activeProblem = this.prog.problem+1 >= j ? true : false;
					}else{
						activeProblem = true;
					}
				}
				this.problemItems.push(new MenuItemProblem({
						level:this.level.level, 
						problem:j, 
						activityName:this.activityName, 
						active: activeProblem
					}).placeAt(this.titlePane.containerNode));
			}
		}
	});
});