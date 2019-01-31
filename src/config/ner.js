var ner   = require('wink-ner');
var NER = ner();

var trainingData = [
    //constants
    { text: 'pi', replace_value: '3.14', entityType: 'constant', uid: 'constant' },
    //operator replace
    { text: 'and', entityType: 'replace_command', uid: 'replace' },
    { text: 'from', entityType: 'replace_command', uid: 'replace' },
    { text: 'to', entityType: 'replace_command', uid: 'replace' },
    //+
    { text: 'add', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'addition', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'addition of', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'sum', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'sumation', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'plus', replace_value: '+', entityType: 'operator', uid: 'add' },
    { text: 'added', replace_value: '+', entityType: 'operator', uid: 'add' },
    // -
    { text: 'minus', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    { text: 'subtract', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    { text: 'subtraction', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    { text: 'subtraction of', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    { text: 'remove', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    { text: 'difference between', replace_value: '-', entityType: 'operator', uid: 'subtract' },
    // *
    { text: 'times', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    { text: 'into', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    { text: 'multiply', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    { text: 'multiplied by', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    { text: 'multiplication of', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    { text: 'product', replace_value: '*', entityType: 'operator', uid: 'multiply' },
    // /
    { text: 'by', replace_value: '/', entityType: 'operator', uid: 'divide' },
    { text: 'divide', replace_value: '/', entityType: 'operator', uid: 'divide' },
    { text: 'divide by', replace_value: '/', entityType: 'operator', uid: 'divide' },
    { text: 'division', replace_value: '/', entityType: 'operator', uid: 'divide' },
    { text: 'division of', replace_value: '/', entityType: 'operator', uid: 'divide' },
    //percentage of 
    { text: 'percentage of', replace_value: '%', entityType: 'operator', uid: 'percent' },
    { text: '% of', replace_value: '%', entityType: 'operator', uid: 'percent' },
    // square root
    { text: 'square root of', replace_value: 'sqrt(', entityType: 'operator', uid: 'root' },
    { text: 'cube root of', replace_value: 'cbrt(', entityType: 'operator', uid: 'root' },
    //n root
    { text: 'root of', replace_value: 'nthRoot(', entityType: 'operator', uid: 'nroot' },
    // power of
    { text: 'to the power of', replace_value: 'pow(', entityType: 'operator', uid: 'power' },
    { text: 'to power of', replace_value: 'pow(', entityType: 'operator', uid: 'power' },
    { text: 'power', replace_value: 'pow(', entityType: 'operator', uid: 'power' },
    // fact
    { text: 'factorial', replace_value: 'factorial(', entityType: 'operator', uid: 'fact' },
    { text: 'factorial of', replace_value: 'factorial(', entityType: 'operator', uid: 'fact' },
    // log
    { text: 'log', replace_value: 'log(', entityType: 'operator', uid: 'log' },
    { text: 'log of', replace_value: 'log(', entityType: 'operator', uid: 'log' },
    { text: 'logarithm', replace_value: 'log(', entityType: 'operator', uid: 'log' },
    { text: 'logarithm of', replace_value: 'log(', entityType: 'operator', uid: 'log' },
    // lcm
    { text: 'lcm', replace_value: 'lcm(', entityType: 'operator', uid: 'lcm' },
    { text: 'lcm of', replace_value: 'lcm(', entityType: 'operator', uid: 'lcm' },
    { text: 'least common multiple', replace_value: 'lcm(', entityType: 'operator', uid: 'lcm' },
    { text: 'common multiple', replace_value: 'lcm(', entityType: 'operator', uid: 'lcm' },
    { text: 'least multiple', replace_value: 'lcm(', entityType: 'operator', uid: 'lcm' },
    // gcd
    { text: 'gcd', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    { text: 'gcd of', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    { text: 'greatest common divisor', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    { text: 'common divisor', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    { text: 'highest common factor', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    { text: 'common factor', replace_value: 'gcd(', entityType: 'operator', uid: 'gcd' },
    //trig 
    { text: 'sin', replace_value: 'sin(', entityType: 'operator', uid: 'trig' },
    { text: 'sin of', replace_value: 'sin(', entityType: 'operator', uid: 'trig' },
    { text: 'sine', replace_value: 'sin(', entityType: 'operator', uid: 'trig' },
    { text: 'sine of', replace_value: 'sin(', entityType: 'operator', uid: 'trig' },
    { text: 'cos', replace_value: 'cos(', entityType: 'operator', uid: 'trig' },
    { text: 'cos of', replace_value: 'cos(', entityType: 'operator', uid: 'trig' },
    { text: 'cosine', replace_value: 'cos(', entityType: 'operator', uid: 'trig' },
    { text: 'cosine of', replace_value: 'cos(', entityType: 'operator', uid: 'trig' },
    { text: 'tan', replace_value: 'tan(', entityType: 'operator', uid: 'trig' },
    { text: 'tan of', replace_value: 'tan(', entityType: 'operator', uid: 'trig' },
    { text: 'tangent', replace_value: 'tan(', entityType: 'operator', uid: 'trig' },
    { text: 'tangent of', replace_value: 'tan(', entityType: 'operator', uid: 'trig' },
    //inverse trig
    { text: 'atan', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'atan of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'arctan', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'arctan of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse tan', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse tan of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'atangent', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'atangent of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'arctangent', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'arctangent of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse tangent', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse tangent of', replace_value: 'atan(', entityType: 'operator', uid: 'trig' },

    { text: 'acos', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'acos of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'arccos', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'arccos of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse cos', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse cos of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'acosine', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'acosine of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'arccosine', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'arccosine of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse cosine', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse cosine of', replace_value: 'acos(', entityType: 'operator', uid: 'trig' },

    { text: 'asin', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'asin of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'arcsin', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'arcsin of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse sin', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse sin of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'asine', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'asine of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'arcsine', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'arcsine of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse sine', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
    { text: 'inverse sine of', replace_value: 'asin(', entityType: 'operator', uid: 'trig' },
];

NER.learn( trainingData );

module.exports = NER