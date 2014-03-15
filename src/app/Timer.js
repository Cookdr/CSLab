define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Timer.html"
],function(declare, lang, domConstruct, html, on, _WidgetBase, _TemplatedMixin, template){

	return declare("app.Timer",[_WidgetBase, _TemplatedMixin], {
		//	set our template
		templateString: template,
		startTime: null,
		curTime: null,
		timer: null,

		_displayTime: function(){
			var dur, ms, sec, mim;
			// min:sec:ms
			dur = new Date().getTime() - this.startTime.toString();

			ms = (dur%100);
			sec = Math.floor((dur/1000)%60);
			min = Math.floor((dur/60000)%60);

			this.curTime = (min == 0 ? "" : min > 10 ? "" : "0" + min + ":") + (sec < 10 ? "0" : "")+sec+"."+ms;

			if(this.domNode){
				html.set(this.domNode, this.curTime);
			}
		},

		start: function(){
			this.startTime = new Date().getTime();
			this.timer = setInterval(lang.hitch(this, this._displayTime),100);
		},

		stop: function(){
			clearInterval(this.timer);
			return this.curTime;
		}
	});
});