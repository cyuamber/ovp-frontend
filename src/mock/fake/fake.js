const faker = require("faker");
const _ = require("lodash");
faker.locale = "en";

module.exports = {
    customer: _.times(20, function (n) {
        return {
            id: n,
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            avatar: faker.internet.avatar()
        }
    }),
    home: _.times(10, function (n) {
        return {
            id: n,
            name: faker.name.findName(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            avatar: faker.internet.avatar()
        }
    }),
    createVNFType: {
            code: 200,
            message: 'SUCCESS',
            body: {
                id: faker.random.number(),
                VNFTypeName: faker.random.words(),
                createTime: faker.date.recent()
        }
    },
    updateVNFType: {
        code: 200,
        message: 'SUCCESS',
        body: {
            id: faker.random.number(),
            VNFTypeName: faker.random.words(),
            createTime: faker.date.recent()
        }
    },
    getVNFType: {
        code: 200,
        message: 'SUCCESS',
        total:50,
        body: _.times(10,function(n){
            return {
                id: n,
                VNFTypeName: faker.random.words(),
                createTime: faker.date.recent()
            }
        })
    },
    deleteVNFType: {
        code: 200,
        message: 'SUCCESS'
    },
    getVNFTest: {
        code: 200,
        message: 'SUCCESS',
        total:50,
        body:  _.times(10,function(n){
            return {
                id: n,
                VNFTestName: faker.name.firstName(),
                VNFTestVendor:faker.random.word(),
                VNFTestVersion:faker.random.word(),
                VNFTypeName: faker.name.lastName(),
                createTime: faker.date.recent(),
                VNFFileName: {}
            }
        })
    },
    deleteVNFTest: {
        code: 200,
        message: 'SUCCESS',
    },
    getMeterSys:{
        code: 200,
        message: 'SUCCESS',
        total:50,
        body: _.times(10,function(n){
            return {
                meterSysName: n,
                meterSysVendor: faker.company.companyName(),
                meterSysUrl: faker.internet.url(),
                createTime: faker.date.recent(),
                username:faker.name.findName(),
                password:faker.internet.password()
            }
        })
    },
    loginMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                meterSysName: n,
                meterSysVendor: faker.company.companyName(),
                meterSysUrl: faker.internet.url(),
                createTime: faker.date.recent()
            }
        })
    },
    updateMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                meterSysName: n,
                meterSysVendor: faker.company.companyName(),
                meterSysUrl: faker.internet.url(),
                createTime: faker.date.recent()
            }
        })
    },
    deleteMeterSys: {
        code: 200,
        message: 'SUCCESS'
    },
    getTestMeter:{
        code: 200,
        message: 'SUCCESS',
        total:50,
        body: _.times(10,function(n){
            return {
                tesyMeterName: n,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion: faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    createTestMeter:{
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                tesyMeterName: n,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion: faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    updateTestMeter:{
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                tesyMeterName: n,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion:faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    deleteTestMeter:{
        code: 200,
        message: 'SUCCESS'
    },
    getTestSpec:{
        code: 200,
        message: 'SUCCESS',
        total:50,
        body: _.times(10,function(n){
            return {
                testSpecId: n,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                VNFtype: faker.database.type(),
                publishTime: faker.date.recent(),
            }
        })
    },
    addTestSpec:{
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                testSpecId: n,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                VNFtype: faker.database.type(),
                publishTime: faker.date.recent(),
            }
        })
    },
    updateTestSpec:{
        code: 200,
        message: 'SUCCESS',
        body: _.times(10,function(n){
            return {
                testSpecId: n,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                VNFtype: faker.database.type(),
                publishTime: faker.date.recent(),
            }
        })
    },
    deleteTestSpec:{
        code: 200,
        message: 'SUCCESS'
    }
}