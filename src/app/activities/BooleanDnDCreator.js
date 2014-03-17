define([ 
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/string",
	"dojo/dom-construct", 
	"dojo/dom-class", 
	"dojo/dnd/Source", 
	"dojo/text!./templates/booleanOp.html"
	], function(declare, lang, stringUtil, domConstruct, domClass, Source, template){

	var booleanDndCreator = {
		// creates the DOM representation for the given item
		booleanOpCreator: function(item, hint){
			var result;
			// create a node using an HTML template
			var node = domConstruct.toDom(stringUtil.substitute(template, {
				op: item.data
			//	hiddenProps: "color" 
			}));
			
			var type = item.data === "NOT" ? [ "booleanOp", "booleanProp"] : ["booleanOp"];

			result = { node: node, data: item, type: type };
			return result;
		},

		// creates a dojo/dnd/Source from the data provided
		buildOps: function(node, data, selfAccept){

			// create the Source
			var dndObj = new Source(node, {
				// ensure that only copy operations ever occur from this source
				copyOnly: true,
				accept: ["booleanOp"],
				horizontal: true,
				singular: true,

				// define whether or not this source will accept drops from itself, based on the value passed into
				// buildCatalog; defaults to true, since this is the default that dojo/dnd uses
				selfAccept: selfAccept === undefined ? true : selfAccept,

				// use catalogNodeCreator as our creator function for inserting new nodes
				creator: this.booleanOpCreator
			});

			// insert new nodes to the Source; the first argument indicates that they will not be highlighted (selected)
			// when inserted
			dndObj.insertNodes(false, data);

			// add CSS hooks for element styling
			dndObj.forInItems(function(item, id, map){
				domClass.add(id, item.type[0]);
			});

			return dndObj;
		},

		booleanPropCreator: function(item, hint){
			var result;
			// create a node using an HTML template
			var node = domConstruct.toDom(stringUtil.substitute(template, {
				// item.specProp if just the avatar
				op: hint ? item.specProp : item.data.specProp
			//	hiddenProps: "color" 
			})),

			result = { node: node, data: item.data, type: ["booleanProp"] };
			return result;
		},

		// creates a dojo/dnd/Source from the data provided
		buildProps: function(node, data, selfAccept){

			// create the Source
			var dndObj = new Source(node, {
				// ensure that only copy operations ever occur from this source
				copyOnly: true,
				accept: ["booleanProp"],
				horizontal: true,
				singular: true,

				// define whether or not this source will accept drops from itself, based on the value passed into
				// buildCatalog; defaults to true, since this is the default that dojo/dnd uses
				selfAccept: false,

				// use catalogNodeCreator as our creator function for inserting new nodes
				creator: this.booleanPropCreator
			});

			// insert new nodes to the Source; the first argument indicates that they will not be highlighted (selected)
			// when inserted
			dndObj.insertNodes(false, data);

			// add CSS hooks for element styling
			dndObj.forInItems(function(item, id, map){
				domClass.add(id, item.type[0]);
			});

			return dndObj;
		}
	}
	return booleanDndCreator;
});
