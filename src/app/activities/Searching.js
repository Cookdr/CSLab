define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"./_ActivityBase",
	"dojo/text!./templates/Searching.html"
],function(declare, lang, domConstruct, _ActivityBase, template){

	return declare("app.activities.Searching",[_ActivityBase], {

		//	set our template
		templateString: template,
		name: "Searching",
		
	});
});