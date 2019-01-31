const _ = require('lodash/string')

function _process(entity_result, logger) {
	let global_op = null, number_list = [], operator_list = [], trig_operator = [], eval_str = '', eval_list = [], prev = null, intent = '';
	for (let index = 0; index < entity_result.length; index++) {
		console.log(entity_result[index],'-- prev --', prev, ' -- glob --', global_op);
		if ( entity_result[index].tag == 'symbol' || entity_result[index].tag == 'punctuation' || entity_result[index].tag == 'alien' ) {
			if(['+','-','*','/'].indexOf(entity_result[index].value) > -1){
				eval_list.push(entity_result[index].value); 
				prev = entity_result[index];
			}else if( entity_result[index].value == '^' ){

				if ( eval_list.length > 0 && (!isNaN(eval_list[eval_list.length - 1]) || eval_list[eval_list.length - 1].includes("pow")) && !isNaN(entity_result[index + 1].value) ) {
					let a = eval_list.splice(-1, 1), b = entity_result[index + 1].value;
					eval_list.push( "pow("+a+","+b+")" );
					index += 1;
				}else{
					throw "cant perform power"
				}

			}else if( entity_result[index].value == '!' ){
				if ( eval_list.length > 0 && !isNaN(eval_list[eval_list.length - 1]) ) {
					let val = eval_list.splice(-1, 1) ;
					eval_list.push( "factorial("+ val +")" );
				}else{
					throw "cant perform power"
				}
			} else if ( entity_result[index].value == '÷' ) {
				eval_list.push('/'); 
				prev = entity_result[index];
			} else if ( entity_result[index].value == '√' ) {
				if(entity_result[index + 1].tag == 'number'){
					eval_list.push("sqrt( " + entity_result[index + 1].value + " )" );
					number_list.push(entity_result[index + 1].value);
					index += 1;
				} else {
					throw "sqrt doesnt have value";
				}
			} else if ( entity_result[index].value == '%' && entity_result[index + 1].value == 'of' && !isNaN(entity_result[index + 2].value) ) {
				let a = eval_list.splice(-1, 1), b = entity_result[index + 2].value;
				eval_list.push( ""+ a / 100 );
				eval_list.push( "*" );
				eval_list.push( ""+ b );
				index += 2;
				if (!global_op) {
					global_op = Object.assign( entity_result[index] , {
						entityType: 'operator',
						uid: 'percent'
					});	
				}
			}
		} else if ( entity_result[index].entityType == 'constant' ) {
			number_list.push( entity_result[index].replace_value );
			eval_list.push( entity_result[index].replace_value );
			prev = {
				tag: 'number',
				value: entity_result[index].replace_value
			}
		} else if ( entity_result[index].entityType == 'operator' ) {			
			if (!global_op) {
				global_op = entity_result[index];
			}
			
			if ( entity_result[index].uid == 'root' ) {

				if(entity_result[index + 1].tag == 'number'){
					eval_list.push( entity_result[index].replace_value + " " + entity_result[index + 1].value + " )" );
					index += 1;
				}else{
					throw "sqrt doesnt have value";
				}

			}else if (entity_result[index].uid == 'nroot') {
				let root;
				if ( eval_list.length > 0 && !isNaN(eval_list[eval_list.length - 1]) ) {
					root = _.parseInt(eval_list[eval_list.length - 1]);
					eval_list.splice(-1, 1);
				} else {
					root = 2;
				}
				
				if(entity_result[index + 1].tag == 'number'){
					eval_list.push( entity_result[index].replace_value + " " + entity_result[index + 1].value + "," + root + " )" );
					index += 1;
				}else{
					throw "sqrt doesnt have value";
				}

			}else if ( entity_result[index].uid == 'power' ) {
				
				if ( eval_list.length > 0 && (!isNaN(eval_list[eval_list.length - 1]) || eval_list[eval_list.length - 1].includes("pow")) && !isNaN(entity_result[index + 1].value) ) {
					let a = eval_list.splice(-1, 1), b = entity_result[index + 1].value;
					eval_list.push( "pow("+a+","+b+")" );
					index += 1;
				}else{
					throw "cant perform power"
				}

			}else if (entity_result[index].uid == 'fact') {
				let val;
				if ( entity_result[index + 1] && entity_result[index + 1].tag == 'number' ) {
					val = entity_result[index + 1].value;
					index += 1;
				} else if ( eval_list.length > 0 && !isNaN(eval_list[eval_list.length - 1]) ) {
					val = _.parseInt(eval_list[eval_list.length - 1]);
					eval_list.splice(-1, 1);
				} else {
					throw "can't do factorial"
				}
				eval_list.push('factorial(' + val + ')');
			} else if ( entity_result[index].uid == 'log' ) {
				
				let val;
				if ( entity_result[index + 1] && entity_result[index + 1].tag == 'number' ) {
					val = entity_result[index + 1].value;
					index += 1;
				}else {
					throw "can't do log of null"
				}
				eval_list.push('log(' + val + ')');
			} else if ( entity_result[index].uid == 'trig' ) {
				if (intent.length == 0) {
					intent = 'trig';	
				}					
				entity_result[index]["index"] = eval_list.length;
				trig_operator.push(entity_result[index]);

			} else if ( entity_result[index].uid == 'lcm' || entity_result[index].uid == 'gcd' ) {
				
				intent = 'lcm|gcd';
				global_op = entity_result[index];

			} else if ( entity_result[index].uid == 'percent' ) {
				if ( eval_list.length > 0 && !isNaN(eval_list[eval_list.length - 1])  && !isNaN(entity_result[index + 1].value) ) {
					let a = eval_list.splice(-1, 1), b = entity_result[index + 1].value;
					eval_list.push( ""+ a / 100 );
					eval_list.push( "*" );
					eval_list.push( ""+ b );
					index += 1;
				}else{
					throw "cant perform percent"
				}
			} else {
				if (eval_list.length != 0) {
					eval_list.push(entity_result[index].replace_value);
				}
			}
			operator_list.push(entity_result[index]);
			prev = entity_result[index];
		} else if( entity_result[index].tag == 'number' ) {
			number_list.push(_.parseInt(entity_result[index].value));			
			if( prev && prev.tag == 'number' && global_op){
				eval_list.push(global_op.replace_value)
				eval_list.push(entity_result[index].value);
			}else{
				eval_list.push(entity_result[index].value);
			}
			prev = entity_result[index];
		} else if ( entity_result[index].tag == 'ordinal' ) {
			let value = _.parseInt(entity_result[index].value);
			if( prev && prev.tag == 'number' && global_op){
				eval_list.push(global_op.replace_value)
				eval_list.push(value);
			}else{
				eval_list.push(value);
			}
			prev = entity_result[index];
		} else if (entity_result[index].entityType == 'replace_command') {
			if (global_op) {
				if (global_op.uid == 'trig') {
					eval_list.push( '+' );
					prev = entity_result[index];		
				} else if ( global_op.uid == 'subtract' && entity_result[index + 1] && entity_result[index + 1].tag == 'number') {
					let a = eval_list.splice(-1, 1), b = entity_result[index + 1].value;
					eval_list.push( b + " - " + a );
					number_list.push(_.parseInt(b));
					index += 1;
				} else {
					eval_list.push(global_op.replace_value);
					prev = entity_result[index];
				}
			}				
		}
	}

	logger.debug(trig_operator, eval_list)

	if ( intent == 'trig' ) {
		let count = 0, str = '';
		for (let index = 0; index < trig_operator.length; index++) {
			if ( trig_operator[index + 1] &&  ( trig_operator[index].index == trig_operator[index + 1].index ) ) {
				str += trig_operator[index].replace_value + " ";
				count ++ ;
			} else {
				str += trig_operator[index].replace_value + " ";
				count++;
				if ( !isNaN(eval_list[ trig_operator[index].index ])  ) {
					str += eval_list[ trig_operator[index].index ];
					for (let index = 0; index < count; index++) {
						str += ' )'
					}
					count = 0;
					logger.debug(' trig str ', str);
					eval_list.splice( trig_operator[index].index , 1, str)
					str = ''
				}else{
					throw "cant't perform trig operation"
				}
			}
		}
	} else if ( intent == 'lcm|gcd') {
		eval_list = [ global_op.replace_value + " " + number_list.join(", ") + " )" ]
	}

	if ( global_op && ["subtract","add","multiply","divide"].includes(global_op.uid) && number_list.length < 2) {
		throw "can't perform this operation"
	}

	eval_str = eval_list.join(" ")
	logger.debug(operator_list, number_list, global_op, eval_list)
	return { global_op, eval_str, number_list };
}


module.exports = _process;