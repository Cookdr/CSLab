define([ 
	"dojo/_base/declare"
	], function(declare){

	var booleanLogic = {
		evalStatement: function(terms){
			var term, curMask, nextOp;

			while(terms.length > 0){
				term = terms.shift();
				if(term.type === "booleanOp"){
					if(term.text === "NOT"){
						var odd = true, done = false;
						while(!done){
							if(terms.length > 0){
								term = terms.shift();
								if(term.text === "NOT"){
									odd = !odd;
								}else{
									done = true;
								}
							}else{
								return null;
							}
						}
						if(odd){
							if(nextOp){
								curMask = this.evalExp(curMask, nextOp, this.evalExp(null, "NOT", term.mask));
							}else{
								curMask = this.evalExp(null, "NOT", term.mask);
							}
						}else{
							if(nextOp){
								curMask = this.evalExp(curMask, nextOp, term.mask);
							}else{
								curMask = term.mask;
							}
						}
						nextOp = null;
					}else{
						// Ops other then NOT
						nextOp = term.text;
					}
				}else{
					// booleanProp
					if(nextOp){
						curMask = this.evalExp(curMask, nextOp, term.mask);
					}else{
						curMask = term.mask;
					}
				}
			}
			return curMask;
		},

		evalExp: function(mask1, op, mask2){
			var i, result = [];
			switch(op){
				case "AND":
							for(i=0; i < mask1.length; i++){
								result.push(mask1[i] && mask2[i]);
							}
				break;
				case "OR":
							for(i=0; i < mask2.length; i++){
								result.push(mask1[i] || mask2[i]);
							}
				break;
				case "NOT":
							for(i=0; i < mask2.length; i++){
								result.push(!mask2[i]);
							}
				break;
			}

			return result;
		},

		getTerms: function(map, nodes){
			var i, node, text, type, mask, term, terms = [];
			for(i=0; i < nodes.length; i++){
				node = nodes[i];
				text = map[node.id].data.specProp || map[node.id].data.data;
				type = map[node.id].type[0];
				mask = map[node.id].data.hideIndexes || null;
				term = {type: type, text: text, mask: mask};
				terms.push(term);
			}

			return terms;
		}
	}
	return booleanLogic;
});
