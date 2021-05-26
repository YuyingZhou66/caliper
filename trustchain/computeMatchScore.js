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

module.exports.info = 'computing matching score.';

const helper = require('./helper');

//let txIndex = 0;

let productNames = ['Milk','Chocolate','Cake','Ice cream'];
let delivery = [1,2,3,4];
let indicators = ['Product Quality','Product Price','Service Quality','Service Price','Delivery time'];
let decayFactor = ['current','history'];
let bc, contx, clientArgs;
let startBuyerID;

module.exports.init = async function(blockchain, context, args) {
    bc = blockchain;
    contx = context;
    clientArgs = args;
    startBuyerID = args.retailer;
    
    await helper.initLedger(bc, contx, args.retailer);
    await helper.createBuyer(bc, contx, args.buyer);
    await helper.sensorReadTemperature(bc, contx, args.commodity);
    await helper.regulatorRate(bc, contx, args.retailer);
    await helper.receiptCommodity(bc,contx, args.commodity);
    await helper.startTrade(bc,contx, args);
    
    return Promise.resolve();

};

//let startBuyerID = clientArgs.retailer;

function shuffle(indicators){
    let i = indicators.length;
    while(i){
        let j = Math.floor(Math.random()*i--);
        let t = indicators[i];
        indicators[i]=indicators[j];
        indicators[j]=t;
    }
    return indicators;
}

module.exports.run = function() {
    startBuyerID++;
    
    let buyerID = 'Client' + contx.clientIdx + '_TRADER'+startBuyerID.toString();
    let productName = productNames[Math.floor(Math.random()*productNames.length)];
    
    let price2,inventory2,delivery2,commodityRep2,regulatorR2,sellerRep2;
    if (productName == 'Milk'){
        price2 = Math.floor(Math.random()*(25-10+1)+10);
    }else if (productName = 'Chocolate'){
        price2 = Math.floor(Math.random()*(20-5+1)+5);
    }else if (productName == 'Cake'){
        price2 = Math.floor(Math.random()*(30-12+1)+12);
    }else{
        price2 = Math.floor(Math.random()*(15-2+1)+2);
    }
    
    inventory2 = Math.floor(Math.random()*(30-10+1)+10);
    delivery2 = delivery[Math.floor(Math.random()*delivery.length)];
    commodityRep2 = Math.floor(Math.random()*(10-5+1)+5);
    regulatorR2 = Math.floor(Math.random()*(10-5+1)+5);
    sellerRep2 = Math.floor(Math.random()*(10-5+1)+5);
    
    let satisfactionVector = [price2,inventory2,delivery2,commodityRep2,regulatorR2,sellerRep2];
    
    let constantWeightVector = [0.2,0.1,0.1,0.25,0.1,0.25];
    
    let indicator1,indicator2,indicator3,indicator4,indicator5;
    
    let indicatorsarr = shuffle(indicators);
    
    indicator1 = indicatorsarr[0];
    indicator2 = indicatorsarr[1];
    indicator3 = indicatorsarr[2];
    indicator4 = indicatorsarr[3];
    indicator5 = indicatorsarr[4];
    
    let decaySpeed = decayFactor[Math.floor(Math.random()*decayFactor.length)];
    let price10, inventory10,delivery10,commodityRep10, regulatorR10,sellerRep10;
    price10 = Math.floor(Math.random()*(6-4+1)+4);
    inventory10 = Math.floor(Math.random()*(5-3+1)+3);
    delivery10 = Math.floor(Math.random()*(5-3+1)+3);
    commodityRep10 = Math.floor(Math.random()*(7-4+1)+4);
    regulatorR10 = Math.floor(Math.random()*(7-4+1)+4);
    sellerRep10 = Math.floor(Math.random()*(7-4+1)+4);
    
    let arg10 = [price10,inventory10,delivery10,commodityRep10,regulatorR10,sellerRep10];
    
    let args = {
        chaincodeFunction:'findOptimalSeller',
        chaincodeArguments:[buyerID,productName,satisfactionVector.toString(),
                            constantWeightVector.toString(),
                            indicator1,indicator2,indicator3,indicator4,indicator5,decaySpeed,arg10.toString()]
        
    };
    
    if(startBuyerID == clientArgs.buyer+clientArgs.retailer){
        startBuyerID = clientArgs.retailer;
    }

    return bc.bcObj.querySmartContract(contx, 'fabcar', 'v1', args, 1000);
};

module.exports.end = async function() {
    return Promise.resolve();
};
