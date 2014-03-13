define([ 
	"dojo/string",
	"dojo/dom-construct", 
	"dojo/dom-class", 
	"dojo/dnd/Source", 
	"dojo/text!./templates/booleanOp.html"
	], function(stringUtil, domConstruct, domClass, Source, template){
	// creates the DOM representation for the given item
	function booleanOpCreator(item, hint){

		// create a node using an HTML template
		var node = domConstruct.toDom(stringUtil.substitute(template, {
			op: item.name,
			hiddenProps: "color" 
		})),

		return { node: node, data: item, type: "booleanOp" };
	}

	// creates a dojo/dnd/Source from the data provided
	function buildOps(node, data, selfAccept){

		// create the Source
		var dndObj = new Source(node, {
			// ensure that only copy operations ever occur from this source
			copyOnly: true,

			// define whether or not this source will accept drops from itself, based on the value passed into
			// buildCatalog; defaults to true, since this is the default that dojo/dnd uses
			selfAccept: selfAccept === undefined ? true : selfAccept,

			// use catalogNodeCreator as our creator function for inserting new nodes
			creator: booleanOpCreator
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

	// expose our API
	return {
		buildOps: buildOps
	};
});
