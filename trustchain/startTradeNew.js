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

module.exports.info = 'Starting trade.';

const helper = require('./helper');

let txIndex = 0;

let bc, contx, clientArgs;

module.exports.init =async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientArgs = args
    
    await helper.initLedger(bc,contx,args.retailer)
    await helper.createBuyer(bc,contx,args.buyer)
    await helper.sensorReadTemperature(bc, contx,args.commodity);
    
    return Promise.resolve();
};

//let startSellerID = 0;
//let endSellerID = clientArgs.retailer-1;
//let startBuyerID = clientArgs.retailer;
//let endBuyerID = clientArgs.buyer+startID-1;

module.exports.run = function() {
    txIndex++;
    
    let startSellerID = 0;
    let endSellerID = clientArgs.retailer-1;
    
    //let id = Math.floor(Math.random()*(endSellerID-startSellerID+1)+startSellerID).toString();
    if (txIndex == contx.retailer){
        txIndex = 0;
    }

    let id = txIndex;
    let commoID= 'Client' + contx.clientIdx + '_COMMODITY'+id.toString();
    let sellerID = 'Client' + contx.clientIdx + '_TRADER'+id.toString();
    let startBuyerID = clientArgs.retailer
    let endBuyerID = clientArgs.buyer+startBuyerID-1;
    //let buyerID = 'Client' + contx.clientIdx + '_TRADER'+Math.floor(Math.random()*(endBuyerID-startBuyerID+1)+startBuyerID).toString();
    let bID = id+500;
    let buyerID = 'Client' + contx.clientIdx + '_TRADER'+bID.toString();
    let fPriceProduct = Math.floor(Math.random()*(10-3+1)+3);
    let fPriceService = Math.floor(Math.random()*(10-3+1)+3);
    let fQualityService = Math.floor(Math.random()*(10-3+1)+3);
    let fDelivery = Math.floor(Math.random()*(10-3+1)+3);
    let fQualityProduct = Math.floor(Math.random()*(10-3+1)+3);
    
    let args ={
        chaincodeFunction:'startTrade',
        chaincodeArguments:[commoID,sellerID,buyerID,fPriceProduct.toString(), fPriceService.toString(), fQualityService.toString(), fDelivery.toString(),fQualityProduct.toString()]
    }
    
    return bc.invokeSmartContract(contx, 'fabcar', 'v1', args, 1000);
    
};

module.exports.end = async function() {
    return Promise.resolve();
};
