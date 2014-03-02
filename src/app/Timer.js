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
		time: null,
		timer: null,

		_displayTime: function(){
			var dur, ms, s, m;
			// min:sec:ms
			dur = new Date().getTime() - this.startTime.toString();

			ms = (dur%100);
			s = Math.floor((dur/1000)%60);
			m = Math.floor((dur/60000)%60);

			this.time = (m == 0 ? "" : m > 10 ? "" : "0" + m + ":") + (s < 10 ? "0" : "")+s+"."+ms;

			if(this.domNode){
				html.set(this.domNode, this.time);
			}
		},

		start: function(){
			this.startTime = new Date().getTime();
			this.timer = setInterval(lang.hitch(this, this._displayTime),100);
		},

		stop: function(){
			clearInterval(this.timer);
			return this.time;
		},
	});
});