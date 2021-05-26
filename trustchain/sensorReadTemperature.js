/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

module.exports.info = 'sensor reading temperature.';

const helper = require('./helper');

let txIndex = 0;
let bc, contx, clientArgs;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientArgs = args;

    await helper.initLedger(bc, contx, args.retailer);
    
    return Promise.resolve();

};

module.exports.run = function() {
    txIndex++;
    let commoID = 'Client' + contx.clientIdx + '_COMMODITY' + txIndex.toString();
    let temperature = Math.floor(Math.random() * (30+25+1)-25);//[-25,30]

    let args = {
        chaincodeFunction: 'readTemperature',
        chaincodeArguments: [commoID, temperature.toString()]
    };

    if (txIndex == clientArgs.retailer) {
        txIndex = 0;
    }

    return bc.invokeSmartContract(contx, 'fabcar', 'v1', args, 1000);
};

module.exports.end = async function() {
    return Promise.resolve();
};
