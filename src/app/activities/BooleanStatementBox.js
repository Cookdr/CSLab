define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dnd/Source",
	"dojo/aspect",
	"dojo/topic",
	"dijit/form/Button",
	"./BooleanStatementSource",
	"./BooleanLogic",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/BooleanStatementBox.html"
],function(declare, lang, Source, aspect, topic, Button, BooleanStatementSource, booleanLogic, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.BooleanStatementBox",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		op: null,
		statement: null,
		removeButton: null,
		first: null,

		constructor: function(first){
			this.first = first;
		},

		getTerms: function(){
			return booleanLogic.getTerms(this.statement.map, this.statement.getAllNodes());
		},

		getOp: function(){
			if(this.op.getAllNodes().length > 0){
				var node = this.op.getItem(this.op.getAllNodes()[0].id);
				return node.data.specProp || node.data.data ;
			}else{
				return null;
			}
		},

		_showStatement: function(){
			this.statement.node.style.display = 'block';
			this.removeButton.domNode.style.display = 'block';
			topic.publish("statementAdded");
		},

		postCreate: function(){


			this.op = new Source(this.booleanOpNode, {
						horizontal: true,
						accept: this.first ? ["NOT"] : ["booleanOp"]
					});
			this.statement = new BooleanStatementSource(this.booleanStatementNode, {
								accept: ["booleanProp"], 
								horizontal: true
							});
			if(!this.first){
				this.statement.node.style.display = 'none';

				this.removeButton = new Button({
					label: "Remove",
					onClick: lang.hitch(this, function(){
						this.destroyRecursive();
						topic.publish("statementChanged");
					})
				}).placeAt(this.clearStatementsNode);
				this.removeButton.domNode.style.display = 'none';
			}

			aspect.after(this.statement, "onDrop" ,function(){
				topic.publish("statementChanged");
			});
			if(!this.first){
				aspect.after(this.op, "onDrop", lang.hitch(this, this._showStatement));
			}else{
				aspect.after(this.op, "onDrop", function(){
					topic.publish("statementChanged");
				});
			}
		}
	});
});