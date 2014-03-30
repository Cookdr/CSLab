define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"./_ActivityBase",
	"dojo/text!./templates/Sorting.html"
],function(declare, lang, domConstruct, _ActivityBase, template){

	return declare("app.activities.Sorting",[_ActivityBase], {

		//	set our template
		templateString: template,
		name: "Sorting",
	
	});
});