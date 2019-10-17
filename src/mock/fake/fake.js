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
    }
}