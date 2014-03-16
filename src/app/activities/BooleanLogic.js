define([ 
	"dojo/_base/declare",
	], function(declare){

	var booleanLogic = {
		evaluateStatement: function(terms){
			switch(terms.length){
				case 1:
					return terms[0].mask;
				break;
				case 2: if(terms[0].text === "NOT"){
							return this._evalExp(null, terms[0].text, terms[1].mask);
						}
				break;
				case 3:
						if(terms[0].text === "NOT" && terms[1].text === "NOT"){
							return this._evalExp(null, terms[0].text, this._evalExp(null, terms[0].text, terms[2].mask));
						}
						return this._evalExp(terms[0].mask, terms[1].text, terms[2].mask);
				break;
				default:
					return null;
				break;
			}
		},

		_evalExp: function(mask1, op, mask2){
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
	}
	return booleanLogic;
});
