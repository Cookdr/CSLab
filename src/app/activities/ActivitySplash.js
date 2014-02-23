define([
	"./Binary",
	"./Boolean",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dijit/ProgressBar",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/ActivitySplash.html"
],function(Binary, Boolean, declare, lang, domConstruct, ProgressBar, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.ActivitySplash",[_WidgetBase, _TemplatedMixin], {
		//	set our template

		constructor: function(activityName){
			this.activityName = activityName;
			switch(activityName){
				case "Binary" : this.activity = new Binary();
				break;
				case "Boolean" : this.activity = new Boolean();
				break;
				default: this.activity = new Binary();
			}
		},

		templateString: template,
		activity: null,
		activityName: null,
		progressBar: new ProgressBar({
        	style: "width: 90%"
    	}),

		postCreate: function(){
			this.progressBar.placeAt(this.progressBarNode);
			this.activityTitleNode.innerHTML = this.activityName;

			this.activity.placeAt(this.containerNode);
		}
	});
});