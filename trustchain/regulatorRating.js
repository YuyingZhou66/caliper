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

module.exports.info = 'regulator ratings.';

const helper = require('./helper');

let txIndex = 0;
let bc, contx, clientArgs;
module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientArgs = args;

    await helper.initLedger(bc, contx, args.assets);
    
    return Promise.resolve();

};

module.exports.run = function() {
    txIndex++;
   // let traderID;
    
   // if (txIndex == clientArgs.assets){
    //    txIndex = 0;
    //}
     
    
    let traderID = 'Client' + contx.clientIdx + '_TRADER'+txIndex.toString();
    
    
    let regulatory = Math.floor(Math.random()*(10-3+1)+3);
    
    let args = {
        chaincodeFunction: 'regulatorRating',
        chaincodeArguments: [traderID, regulatory.toString()]
    };

    if (txIndex == clientArgs.assets){
        txIndex = 0;
    }

    return bc.invokeSmartContract(contx, 'fabcar', 'v1', args, 1000);
};

module.exports.end = async function() {
    return Promise.resolve();
};
