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
}