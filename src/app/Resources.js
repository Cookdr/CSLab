define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/html",
    "dojo/string",
    "dojo/request/xhr",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/Resources.html"
],function(declare, lang, domConstruct, html, stringUtil, xhr, _WidgetBase, _TemplatedMixin, template){

	return declare("app.activities.Resources",[_WidgetBase, _TemplatedMixin], {
		//	set our template

		constructor: function(args){
			this.activityName = "Resources";
            this.user = args.user;

             xhr("app/resources/data/"+this.activityName+".json", {
                handleAs: "json"
            }).then(lang.hitch(this, this._populate), function(err){
                console.log(err);
            });
		},

		templateString: template,
    	activityName: null,
        user: null,
        greetingString: "Hello ${name}! Here are some other resources you can use to continue learning.",
        _linkString: '<li><a title="${desc}" href="${link}">${title}</a></li>',

        _populate: function(data){
            data = data.resources;
            var i, j, type, typeNode;
            for(i=0; i < data.length; i++){
                type = data[i];
                typeNode = domConstruct.create("div",{}, this.resourcesNode);
                domConstruct.create("h2", {innerHTML: data[i].title}, typeNode);
                for(j=0; j < type.links.length; j++){
                     domConstruct.place(stringUtil.substitute(this._linkString, {
                        desc: type.links[j].desc,
                        link: type.links[j].link,
                        title: type.links[j].title
                    }), typeNode);
                }
            }
        },

		postCreate: function(){
            html.set(this.greetingNode, stringUtil.substitute(this.greetingString, {
                name: this.user.name
            }));
		}
	});
});