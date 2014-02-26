define([
	"dojo/_base/declare",
	"dojo/topic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin"
], function(declare, topic, _WidgetBase, _TemplatedMixin){
	// Hooks to communicate with ActivitySplash page
	return declare("app.activities._ActivityBase", [_WidgetBase, _TemplatedMixin], {

		name: null,
		problem: null,
		data: null,
		flags: null,


		success: function(){
			console.log("successfully completed: "+this.name+" problem ");
			topic.publish("ActivitySuccess", {name: this.name});
		}
	});
	
});