define([
	"dojo/_base/declare",
	"dojo/topic",
	"dijit/form/Button",
	"dijit/Dialog",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin"
], function(declare, topic, Button, Dialog, _WidgetBase, _TemplatedMixin){
	// Hooks to communicate with ActivitySplash page
	return declare("app.activities._ActivityBase", [_WidgetBase, _TemplatedMixin], {

		name: null,
		problem: null,
		data: null,	
		flags: null,
		timer: null,


		success: function(){
			if(this.flags.race){
				console.log("Completed Activity in: "+this.timer.stop());
			}
			console.log("successfully completed: "+this.name+" problem ");
			topic.publish("ActivitySuccess", {name: this.name});
		},

		failure: function(actName, problem, msg){
			var pop, button;

			pop = new Dialog({
				title: "Uh Oh",
				content: msg
			});

			button = new Button({
				label: "Try Again",
				onClick: function(){
					pop.destroyRecursive();
					topic.publish("ActivityFailure", {actName: actName, problem: problem});
				}
			}).placeAt(pop.containerNode);

			pop.show();
		}
	});
	
});