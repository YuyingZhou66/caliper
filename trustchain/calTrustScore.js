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

module.exports.info = 'calculating trader trust score.';

const helper = require('./helper');

let id = 0;
let bc, contx, clientArgs;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientArgs = args;

    await helper.initLedger(bc, contx, args.retailer);
    await helper.sensorReadTemperature(bc,contx, args.commodity);
    await helper.regulatorRate(bc, contx,args.retailer);
    await helper.createBuyer(bc, contx, args.buyer);
    await helper.startTrade(bc,contx, args);
    return Promise.resolve();

};

module.exports.run = function() {
    id++;
    let traderID = 'Client' + contx.clientIdx + '_TRADER'+id.toString();
    

    let args = {
        chaincodeFunction: 'computeTrustScore',
        chaincodeArguments: [traderID]
    };

    if (id == clientArgs.retailer) {
        id = 0;
    }

    return bc.invokeSmartContract(contx, 'fabcar', 'v1', args, 100);
};

module.exports.end = async function() {
    return Promise.resolve();
};
