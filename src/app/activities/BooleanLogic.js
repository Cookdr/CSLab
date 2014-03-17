define([ 
	"dojo/_base/declare",
	], function(declare){

	var booleanLogic = {
		evalStatement: function(terms){
			switch(terms.length){
				case 1:
					if(terms[0].text !== "NOT"){
						return terms[0].mask;
					}else{
						return null;
					}
				break;
				case 2: if(terms[0].text === "NOT"){
							return this.evalExp(null, terms[0].text, terms[1].mask);
						}else{
							return terms[0].mask;
						}
				break;
				case 3:
						if(terms[0].text === "NOT" && terms[1].text === "NOT"){
							return this.evalExp(null, terms[0].text, this.evalExp(null, terms[0].text, terms[2].mask));
						}else if(terms[1].text === "NOT"){
							return this.evalExp(terms[0].mask, "AND", this.evalExp(null, terms[1].text, terms[2].mask));
						}
						return this.evalExp(terms[0].mask, terms[1].text, terms[2].mask);
				break;
				default:
					return null;
				break;
			}
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
