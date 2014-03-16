define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dnd/Source",
	"dojo/dnd/Selector"
],function(declare, lang, domClass, Source, Selector){

	return declare("app.activities.BooleanStatementSource",[Source], {
		insertNodes: function(addSelected, data, before, anchor){

		// summary:
		//		inserts new data items (see `dojo/dnd/Container.insertNodes()` method for details)
		// addSelected: Boolean
		//		a list of data items, which should be processed by the creator function
		//		all new nodes will be added to selected items, if true, no selection change otherwise
		// data: Array
		// before: Boolean
		//		insert before the anchor, if true, and after the anchor otherwise
		// anchor: Node
		//		the anchor node to be used as a point of insertion
		var oldCreator = this._normalizedCreator;
		var nodeType = domClass.contains(data[0], "booleanProp") ? "booleanProp" : "booleanOp";
		var nodes = this.getAllNodes();
		if(nodes.length && this.getItem(nodes[nodes.length-1].id).type[0] === nodeType){
			this.onDndCancel();
			return this;
		}else{
			this.accept = nodeType === "booleanProp" ? {booleanOp:1} : {booleanProp:1};
			this._normalizedCreator = function(item, hint){
				var t = oldCreator.call(this, item, hint);
				if(addSelected){
					if(!this.anchor){
						this.anchor = t.node;
						this._removeItemClass(t.node, "Selected");
						this._addItemClass(this.anchor, "Anchor");
					}else if(this.anchor != t.node){
						this._removeItemClass(t.node, "Anchor");
						this._addItemClass(t.node, "Selected");
					}
					this.selection[t.node.id] = 1;
				}else{
					this._removeItemClass(t.node, "Selected");
					this._removeItemClass(t.node, "Anchor");
				}
				return t;
			};
			Selector.superclass.insertNodes.call(this, data, before, anchor);
			this._normalizedCreator = oldCreator;
			return this;	// self
		}
	},

	checkAcceptance: function(source, nodes){
		// summary:
		//		checks if the target can accept nodes from this source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		if(this == source){
			return !this.copyOnly || this.selfAccept;
		}
		for(var i = 0; i < nodes.length; ++i){
			var type = source.getItem(nodes[i].id).type;
			// type instanceof Array
			var flag = false;
			for(var j = 0; j < type.length; ++j){
				if(type[j] in this.accept){
					flag = true;
					break;
				}
			}
			if(!flag || this.getAllNodes().length > 2){
				return false;	// Boolean
			}
		}
		return true;	// Boolean
	}
})});