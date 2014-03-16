define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dnd/Source",
	"dojo/on",
	"dojo/topic",
	"dijit/form/Button",
	"./BooleanStatementSource",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/BooleanStatementBox.html"
],function(declare, lang, domConstruct, domClass, domStyle, Source, on, topic, Button, BooleanStatementSource, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.BooleanStatementBox",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		op: null,
		statement: null,

		postCreate: function(){
			this.op = new Source(this.booleanOpNode, {
						horizontal: true,
						accept: ["booleanOp"]
					});
			this.statement = new BooleanStatementSource(this.booleanStatementNode, {
								accept: ["booleanProp"], 
								horizontal: true
							});

			new Button({
				label: "Clear",
				onClick: lang.hitch(this, function(){

				}, this.clearStatementsNode)
			})
		}
	});
});