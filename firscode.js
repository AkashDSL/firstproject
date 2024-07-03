
const assertFunctionString = 'function js_assert(condition, str) {\n' +
'\tif (condition) {\n' +
'\t\treturn 1;\n' +
'\t} else {\n' +
'\t\tconsole.error(`Assertion Failed: ${str}`);\n' +
'\t\treturn 0;\n' +
'\t}\n' +
'}\n\n';

const testStartString = ' function test() {\n' +
'\tconst _result_list = [];\n'+ '\t let result=[] \n';


function getAssertStatement(assertStr, n)
{
if(assertStr.includes('then')){
    console.log("Asssert str",assertStr)
    let first = assertStr;
    let last = assertStr.length;
    assertStr = "await "+assertStr.slice(first + 1, last).replace('assert','js_assert')
    return assertStr
}
else{

    let first = assertStr.indexOf('assert') + 5;
    let last = assertStr.length;
    return 'js_assert(' + assertStr.slice(first + 1, last) + ', ' + '"Test case ' + (n +1) + '")'
}


}

function getAssertFunctionName(assertStr)
{
// console.log("aasert",assertStr)
let first = assertStr.indexOf('assert') + 6;
let last = assertStr.indexOf('(');
console.log("ssss",assertStr.slice(first+1,last))
return assertStr.slice(first + 1, last);


}



function getAssertionJSONjavascript(results) {
// console.log("inseid",results)

var code = ''
// var code = assertFunctionString + testStartString;
var numTests = 0;
var functionName = undefined;
let isThen=false
for (var i = 0; i < results.length; i++) {
    var questionType = results[i].type;
    if (!(questionType === 'assert')) {
        continue;
    }
    var assertStatement = results[i].answer || '';
    
    var asserts = assertStatement.split(';');
    console.log("asserts",asserts)
    for (var j = 0; j < asserts.length; j++) {
        if (asserts[j].replace(/\s/g, '').length) {
            if (asserts[j].includes('assert')) {
            if(asserts[j].includes('then')){
                isThen=true
            }
                code += '\t' + ' result = ' + getAssertStatement(asserts[j], numTests) + ';\n';
                code += '\t_result_list.push(result);\n';
                if (functionName === undefined) {
                    functionName = getAssertFunctionName(asserts[j]);
                }
            } else {
                code += '\t' + asserts[j] + '\n';
            }
        }
    }
    numTests++;
}
if(isThen){

    code=assertFunctionString +'\n async'+ testStartString + code
}
else{
    code=assertFunctionString + testStartString +code
}
code += '\t console.log( _result_list);\n\n  \n\n';

code += '\treturn _result_list;\n\ n } \n\n';
code +=  'console.log("Assertion Result: ", test())\n';


var assertJSON = {
    "numTests": numTests,
    "assertCode": code,
    "assertFunction": functionName
};
// console.log("assetr",assertJSON)
return assertJSON;
}

// let reuslt= [
//     { answer: 'let x = 17;let y = 5;assert foo(x, y) == 17', type: 'assert' },
//     { answer: 'let p = 10;let q = 11;assert foo(p, q) == 11', type: 'assert' }
//   ]
//   getAssertionJSONjavascript(reuslt).then((res)=>{
//     console.log("data",res.assertCode)
//   })
module.exports = {
getAssertionJSONjavascript: getAssertionJSONjavascript
}