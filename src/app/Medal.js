define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dojo/string",
	"dijit/popup",
	"dijit/TooltipDialog",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Medal.html"
],function(declare, lang, domConstruct, html, on, stringUtil, popup, TooltipDialog, _WidgetBase, _TemplatedMixin, template){

	return declare("app.Medal",[_WidgetBase, _TemplatedMixin], {

		//	set our template
		templateString: template,
		name: "",
		activity: "",
		image: "",
		text: "",
		condition: "",
		_imgNode: null,
		_medalStringTemp: "Text: ${text}<br>Awarded for: ${condition}",
		_diag: null,

		_openDiag: function(){
			this._diag = new TooltipDialog({
				title: this.name
			});
			domConstruct.create("img", {
				"class": "bigMedal", 
				src:"app/resources/images/big"+this.image, 
				alt: this.text
			}, this._diag.containerNode);

			domConstruct.create("p", {
				innerHTML: stringUtil.substitute(this._medalStringTemp, {
					text: this.text,
					condition: "Completing Level "+this.condition.cond+" of the "+this.activity+" Activity!"
				})
			}, this._diag.containerNode);

			popup.open({
				popup: this._diag,
				around: this._imgNode
			});
		},

		_closeDiag: function(){
			popup.close(this._diag);
		},

		postCreate: function(){
			this._imgNode = domConstruct.create("img", {
				"class": "medal", 
				src:"app/resources/images/"+this.image, 
				alt: this.text
			}, this.containerNode);

			on(this._imgNode, "mouseover", lang.hitch(this, this._openDiag));
			on(this._imgNode, "mouseout", lang.hitch(this, this._closeDiag));
		}
	});
});