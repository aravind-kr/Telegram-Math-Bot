var WTN = require('words-to-numbers').wordsToNumbers
// var _ = require('lodash/string')
var math = require('mathjs')
// var dateformat = require('dateformat');
var winkTokenizer = require('wink-tokenizer')
const NER = require('./config/ner.js')
let _process = require('./utils')
// const unit = require('css-get-unit');

String.prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.replace(new RegExp(search, 'g'), replacement)
}

function isFloat(n) {
    return n % 1 !== 0
}

// function extractTimeAndDate(line) {
// 	var c = chrono.parse(line);
// 	return c;
// }

function words_to_number_conversion(query) {
    let query_list = query.split(' ')
    let res_list = [],
        str = '',
        len = query_list.length
    console.log(query_list)

    for (let index = 0; index < len; index++) {
        const element = query_list[index]
        if (str.length == 0) {
            str = element
        } else {
            str += ' ' + element
        }
        if (
            ['-', '+', '*', '/', '%', 'and', 'from', 'to'].includes(element) ||
            index === len - 1
        ) {
            console.log('WTN >> ', str, index, len - 1)
            res_list.push(WTN(str))
            str = ''
        }
    }
    return res_list.join(' ')
}

function executeSkill(user_question, callback) {
    //This should be dynamically loaded from some store
    // var timeZone = 'UTC+05:30';

    //Change 'back' to 'ago' for the chrono library
    user_question = user_question.replace(/back/g, 'ago')
    user_question = user_question.replace(/-/g, ' - ')
    user_question = user_question.replace(/\//g, ' / ')

    // var qChrono = extractTimeAndDate(user_question);

    var skillResult = {
        status: false,
        contexts: {},
        answer: null,
        expressive_answer: null,
    }
    try {
        var user_question = user_question
        console.log(user_question)
        user_question = words_to_number_conversion(user_question)
        console.log(user_question)

        var tokenize = winkTokenizer().tokenize
        var tokens = tokenize(user_question)

        let entity_result = NER.recognize(tokens)
        // logger.debug(entity_result);

        let { global_op, eval_str, number_list } = _process(
            entity_result,
            logger
        )

        if (
            number_list.length < 2 &&
            !(
                eval_str.includes('nthRoot') ||
                eval_str.includes('cbrt') ||
                eval_str.includes('sqrt') ||
                eval_str.includes('factorial') ||
                (global_op &&
                    (global_op.uid == 'fact' ||
                        global_op.uid == 'trig' ||
                        global_op.uid == 'log' ||
                        global_op.uid == 'percent' ||
                        global_op.uid == 'power'))
            )
        )
            throw 'cant perform that operation'

        let ans = math.eval(eval_str)

        if (isFloat(ans)) {
            ans = ans.toFixed(2)
        }
        skillResult.status = true
        skillResult.answer = {
            answer: ans,
            operation_str: eval_str,
            global_operator: global_op,
            quickReply: [
                {
                    action: 'copy',
                    meta: ans + '',
                    value: 'Copy',
                    value_type: 'TEXT',
                },
                {
                    action: 'smartkeyboard',
                    meta: 'calculator',
                    value: 'Open calculator',
                    value_type: 'TEXT',
                },
                {
                    action: 'tap',
                    meta: 'What can you do? ',
                    value: 'What can you do? ',
                    value_type: 'TEXT',
                },
            ],
        }
        skillResult.expressive_answer = ' ' + eval_str + ' is ' + ans + '.'
        skillResult.android_ssml = skillResult.expressive_answer
    } catch (err) {
        logger.error(err)
    }

    logger.info(JSON.stringify(skillResult))
    callback(skillResult)
}

module.exports = executeSkill
