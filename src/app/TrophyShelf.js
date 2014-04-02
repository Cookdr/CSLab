define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
	"dojo/on",
	"dojo/router",
    "dojo/string",
	"dojo/topic",
    "dijit/form/Button",
	"dijit/ProgressBar",
	"dijit/registry",
	"app/activities/_ActivityBase",
	"dojo/text!./templates/TrophyShelf.html"
],function(declare, lang, domConstruct, html, on, router, stringUtil, topic, Button, ProgressBar, registry, _ActivityBase, template){

	return declare("app.activities.ActivitySplash",[_ActivityBase], {
		//	set our template

		constructor: function(args){
			this.activityName = "Medals";
            this.user = args.user;
            this.progressBar = new ProgressBar({
                style: "width: 90%"
            });
		},

		templateString: template,
    	activityName: null,
        user: null,
        greetingString: "Hello ${name}! You have unlocked ${numUserMedals} medals!",
		progressBar: null,

        _fillShelf: function(){
            var i;
            for(i=0; i < this.user.medals.length; i++){
                domConstruct.create("img", {
                    src:"app/resources/images/"+this.user.medals[i].image,
                    height:100,
                    width:100
                }, this.shelfNode);
            }
        },

		postCreate: function(){
            html.set(this.greetingNode, stringUtil.substitute(this.greetingString, {
                name: this.user.name,
                numUserMedals: this.user.medals.length
            }));
            this.progressBar.placeAt(this.progressBarNode);
            html.set(this.activityTitleNode, this.activityName);

            this._fillShelf();
		}
	});
});