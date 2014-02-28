define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"./_ActivityBase",
	"dojo/text!./templates/Boolean.html"
],function(declare, lang, domConstruct, _ActivityBase, template){

	return declare("app.activities.Boolean",[_ActivityBase], {
		//	set our template
		templateString: template,
		name: "Boolean",

		startup: function(){
			domConstruct.create("div", {innerHTML: "<p>added on startup</p>"}, this.containerNode);
		}
	});
});