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



let names =['Milk','Chocolate','Cake','Ice cream'];
let delivery = [1,2,3,4];
//let bc, contx;


module.exports.initLedger = async function(bc, contx, num) {
    let commoID, producerID, producerName, commoName;
    let txIndex = 0;
    while(txIndex < num){
        //create producers with the amount = num
        producerID = 'Client' + contx.clientIdx + '_TRADER' + txIndex.toString();
        producerName = 'Producer' + txIndex.toString();
        let args1 = {
            chaincodeFunction: 'createTrader',
            chaincodeArguments: [producerID, producerName]
        };
        await bc.invokeSmartContract(contx, 'fabcar', 'v1', args1, 100);
        
        //create commodities corresponding to the producers
        commoID = 'Client' + contx.clientIdx + '_COMMODITY'+txIndex.toString();
        commoName = names[Math.floor(Math.random()*names.length)];
        let maxTemp,minTemp, maxDamage, minDamage,price;
        if (commoName == 'Milk'){
            maxTemp = Math.floor(Math.random()*(25-15+1)+15);
            price = Math.floor(Math.random()*(25-10+1)+10);
        }else if (commoName == 'Chocolate'){
            maxTemp = Math.floor(Math.random()*(10-5+1)+5);
            price = Math.floor(Math.random()*(20-5+1)+5);
        }else if (commoName=='Cake'){
            maxTemp = Math.floor(Math.random()*(10-3+1)+3);
            price = Math.floor(Math.random()*(30-12+1)+12);
        }else{
            maxTemp = Math.floor(Math.random()*(-5+10+1)-10);
            price = Math.floor(Math.random()*(15-2+1)+2);
        }
        minTemp = maxTemp - 5;
        maxDamage = maxTemp+5;
        minDamage = minTemp-5;
        
        let inventory =Math.floor(Math.random()*(30-10+1)+10);
        let deliveryTime = delivery[Math.floor(Math.random()*delivery.length)];
        
        let args2 = {
            chaincodeFunction: 'createCommodity',
            chaincodeArguments: [commoID,commoName,producerID,maxTemp.toString(),minTemp.toString(),maxDamage.toString(),minDamage.toString(),inventory.toString(),price.toString(),deliveryTime.toString()]
        };

        await bc.invokeSmartContract(contx, 'fabcar', 'v1', args2, 1000);
        
        txIndex++;
    }

};

module.exports.createBuyer = async function(bc, contx, num){
    let r = 0;
    let txIndex =100;
    let buyerID,buyerName;
    
    while(r<num){
        buyerID = 'Client' + contx.clientIdx + '_TRADER'+txIndex.toString();
        buyerName = 'Buyer'+r.toString();
        
        let args = {
            chaincodeFunction:'createTrader',
            chaincodeArguments: [buyerID, buyerName]
        }
        await bc.invokeSmartContract(contx, 'fabcar','v1',args,1000);
        txIndex++;
        r++;
    }
};

module.exports.sensorReadTemperature = async function(bc, contx, num){
    let r = 0;
    let commoID;
    while(r<10){
        let txIndex = 0;
        while(txIndex<num){
            commoID = 'Client' + contx.clientIdx + '_COMMODITY'+txIndex.toString();
            let temperature = Math.floor(Math.random()*(35+10+1)-10);
            let args = {
                chaincodeFunction:'readTemperature',
                chaincodeArguments:[commoID,temperature.toString()]
            }
            await bc.invokeSmartContract(contx,'fabcar','v1',args,1000);
            txIndex++;
        }
        r++;
    }
};

module.exports.regulatorRate = async function(bc, contx, num){
    let r = 0;
    let traderID;
    while(r<10){
        let txIndex = 0;
        while(txIndex<num){
            traderID = 'Client' + contx.clientIdx + '_TRADER'+txIndex.toString();
            let rate = Math.floor(Math.random()*(10-3+1)+3);
            let args = {
                chaincodeFunction:'regulatorRating',
                chaincodeArguments:[traderID,rate.toString()]
            }
            await bc.invokeSmartContract(contx, 'fabcar','v1',args,1000);
            txIndex++;
        }
        r++;
    }
};

module.exports.receiptCommodity = async function(bc, contx, num){
    let r=0;
    let commodityID;
    while(r<num){
        commodityID = 'Client' + contx.clientIdx + '_COMMODITY'+r.toString();
        let args ={
            chaincodeFunction:'receiptCommodity',
            chaincodeArguments:[commodityID]
        }
        await bc.invokeSmartContract(contx,'fabcar','v1',args,1000);
        r++;
    }
};

module.exports.startTrade = async function(bc,contx,args){
    let r=0;
    let clientArgs;
    clientArgs = args;
    while(r< clientArgs.retailer){
        
        let commoID= 'Client' + contx.clientIdx + '_COMMODITY' + r.toString();
        let sellerID = 'Client' + contx.clientIdx + '_TRADER'+r.toString();
        
        r++;
        
        let j=0;
        let tradeNum = Math.floor(Math.random()*10);
        while(j<tradeNum){
            j++;
            let startBuyerID = clientArgs.retailer;//startBuyerID = clientArgs.retailer
            let endBuyerID = clientArgs.buyer+startBuyerID-1;//endBuyerID = clientArgs.buyer+startID-1
            let buyerID = 'Client' + contx.clientIdx + '_TRADER'+Math.floor(Math.random()*(endBuyerID-startBuyerID+1)+startBuyerID).toString();
            
            let fPriceProduct = Math.floor(Math.random()*(10-3+1)+3);
            let fPriceService = Math.floor(Math.random()*(10-3+1)+3);
            let fQualityService = Math.floor(Math.random()*(10-3+1)+3);
            let fDelivery = Math.floor(Math.random()*(10-3+1)+3);
            let fQualityProduct = Math.floor(Math.random()*(10-3+1)+3);
            
            let args ={
                chaincodeFunction:'startTrade',
                chaincodeArguments:[commoID,sellerID,buyerID,fPriceProduct.toString(), fPriceService.toString(), fQualityService.toString(), fDelivery.toString(),fQualityProduct.toString()]
            }
            
            await bc.invokeSmartContract(contx, 'fabcar', 'v1', args, 1000);
        }
        
    }
};
