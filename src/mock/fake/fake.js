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
                VNFTestVersion: 'V' + faker.random.number(),
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
    createVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: {
            id: faker.random.number(),
            VNFTestName: faker.name.firstName(),
            VNFTestVendor: faker.random.word(),
            VNFTestVersion: 'V' + faker.random.word(),
            VNFTypeName: faker.name.lastName(),
            createTime: faker.date.recent(),
        }
    },
    updateVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: {
            id: faker.random.number(),
            VNFTestName: faker.name.firstName(),
            VNFTestVendor: faker.random.word(),
            VNFTestVersion: 'V' + faker.random.number(),
            VNFTypeName: faker.name.lastName(),
            createTime: faker.date.recent(),
        }
    },
    getVIM: {
        code: 200,
        message: 'SUCCESS',
        total:50,
        body:  _.times(10,function(n){
            return {
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                ownerDefinedType: faker.random.word(),
                cloudZone: faker.random.word(),
                userName: faker.internet.userName(),
                passwd: faker.internet.password(), 
                authUrl: faker.internet.url(),
                tenant: faker.internet.userName()
            }
        })
    },
    loginVIM: {
        code: 200,
        message: 'SUCCESS',
        body:  _.times(10,function(n){
            return {
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                ownerDefinedType: faker.random.word(),
                cloudZone: faker.random.word(),
                userName: faker.internet.userName(),
                passwd: faker.internet.password(), 
                authUrl: faker.internet.url(),
                tenant: faker.internet.userName(),
            }
        })
    },
    updateVIM: {
        code: 200,
        message: 'SUCCESS',
        body:  _.times(10,function(n){
            return {
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                ownerDefinedType: faker.random.word(),
                cloudZone: faker.random.word(),
                userName: faker.internet.userName(),
                passwd: faker.internet.password(), 
                authUrl: faker.internet.url(),
                tenant: faker.internet.userName(),
            }
        })
    },
    deleteVIM: {
        code: 200,
        message: 'SUCCESS'
    },
    getVNFM: {
        code: 200,
        message: 'SUCCESS',
        total:50,
        body:  _.times(10,function(n){
            return {
                VNFMname: faker.name.firstName(),
                VNFMtype: faker.random.word(),
                VNFMvendor: faker.random.word(),
                VNFMversion: 'V' + faker.random.number(),
                url: faker.internet.url(),
                vim: faker.name.firstName(),
                authUrl: faker.internet.url(),
                userName: faker.internet.userName(),
                passwd: faker.internet.password()
            }
        })
    },
    loginVNFM: {
        code: 200,
        message: 'SUCCESS',
        body: {
            VNFMname: faker.name.firstName(),
            VNFMtype: faker.random.word(),
            VNFMvendor: faker.random.word(),
            VNFMversion: 'V' + faker.random.number(),
            url: faker.internet.url(),
            vim: faker.name.firstName(),
            authUrl: faker.internet.url(),
            userName: faker.internet.userName(),
            passwd: faker.internet.password()
        }
    },
    updateVNFM: {
        code: 200,
        message: 'SUCCESS',
        body: {
            VNFMname: faker.name.firstName(),
            VNFMtype: faker.random.word(),
            VNFMvendor: faker.random.word(),
            VNFMversion: 'V' + faker.random.number(),
            url: faker.internet.url(),
            vim: faker.name.firstName(),
            authUrl: faker.internet.url(),
            userName: faker.internet.userName(),
            passwd: faker.internet.password()
        }
    },
    deleteVNFM: {
        code: 200,
        message: 'SUCCESS'
    },
}