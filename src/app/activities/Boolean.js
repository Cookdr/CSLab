define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Boolean.html"
],function(declare, lang, domConstruct, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.Boolean",[_WidgetBase, _TemplatedMixin], {
		//	set our template
		templateString: template,
		name: "Boolean",

		startup: function(){
			domConstruct.create("div", {innerHTML: "<p>added on startup</p>"}, this.containerNode);
		}
	});
});