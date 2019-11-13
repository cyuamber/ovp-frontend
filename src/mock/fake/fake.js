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
    deleteVNFType: {
        code: 200,
        message: 'SUCCESS'
    },
    getVNFTest: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                id: n + 1,
                name: faker.name.firstName(),
                vendor: faker.random.word(),
                version: 'V' + faker.random.number(),
                type: {
                    code: 1,
                    dictLabel: "test01",
                    dictValue: "001",
                    dictParentCode: null,
                    status: "\u0000",
                    remark: null,
                    lang: null
                },
                createTime: faker.date.recent(),
                VNFFileName: faker.name.firstName()
            }
        })
    },
    getVNFType: {
        "code": 200,
        "message": "OK",
        "body": [
            {
            "code": 1,
            "dictLabel": "test01",
            "dictValue": "test01",
            "dictParentCode": null,
            "status": "\u0000",
            "remark": null,
            "lang": null
            },
            {
                "code": 2,
                "dictLabel": "test02",
                "dictValue": "test02",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            }
        ],
        "total": 1,
        "pageTotal": 1
    },
    createVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: {
            name: faker.name.firstName(),
            vendor: faker.random.word(),
            version: 'V' + faker.random.number(),
            type: faker.name.lastName(),
            createTime: faker.date.recent(),
            VNFFileName: faker.name.firstName()
        }
    },
    updateVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: {
            id: faker.random.number(),
            name: faker.name.firstName(),
            vendor: faker.random.word(),
            version: 'V' + faker.random.number(),
            type: faker.name.lastName(),
            createTime: faker.date.recent(),
        }
    },
    uploadVNFFile: {
        code: 200,
        message: 'SUCCESS',
    },
    deleteVNFTest: {
        code: 200,
        message: 'SUCCESS',
    },
    getMeterSys: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                meterSysName: n + 1,
                meterSysVendor: faker.company.companyName(),
                meterSysUrl: faker.internet.url(),
                createTime: faker.date.recent(),
                username: faker.name.findName(),
                password: faker.internet.password()
            }
        })
    },
    loginMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function (n) {
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
        body: _.times(10, function (n) {
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
    getTestMeter: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                tesyMeterName: n + 1,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion: faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    getTestMeterVNFType: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: ['VNF', 'PNF', 'XNF', 'NFVI']
    },
    createTestMeter: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function (n) {
            return {
                tesyMeterName: n,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion: faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    updateTestMeter: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function (n) {
            return {
                tesyMeterName: n,
                tesyMeterVendor: faker.company.companyName(),
                tesyMeterVersion: faker.random.number(),
                tesyMeterType: faker.database.type(),
                createTime: faker.date.recent(),
            }
        })
    },
    deleteTestMeter: {
        code: 200,
        message: 'SUCCESS'
    },
    getTestSpec: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                testSpecId: n + 1,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                SUTType:faker.database.type(),
                VNFtype: faker.database.type(),
                PublishORG: faker.company.companyName(),
                publishTime: faker.date.recent(),
            }
        })
    },
    getTestSpecVNFType: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: ['VNF01','PNF01','XNF01','NFVI01']
    },
    addTestSpec: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function (n) {
            return {
                testSpecId: n,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                SUTType:faker.database.type(),
                VNFtype: faker.database.type(),
                PublishORG: faker.company.companyName(),
                publishTime: faker.date.recent(),
            }
        })
    },
    updateTestSpec: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function (n) {
            return {
                testSpecId: n,
                testSpecName: faker.commerce.productName(),
                testSpecVersion: faker.random.number(),
                SUTType:faker.database.type(),
                VNFtype: faker.database.type(),
                PublishORG: faker.company.companyName(),
                publishTime: faker.date.recent(),
            }
        })
    },
    deleteTestSpec: {
        code: 200,
        message: 'SUCCESS'
    },
    getVIM: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                id:n+1,
                status: (n+1)%2===0 ? 0:1,
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
                authUrl: faker.internet.url(),
                sslCacert:faker.internet.protocol(),
                sslInsecure:faker.internet.ipv6(),
                cloudDomain:faker.internet.domainName(),
                tenant: faker.internet.userName(),
                createTime: faker.date.recent(),
                defaultTenant: faker.random.word(),
            }
        })
    },
    cloudRegionID: {
        "code": 200,
        "message": "OK",
        "body": ["openstack","windriver","vmware"],
        "total": 3,
        "pageTotal": 1
    },
    getcloudType: {
        "code": 200,
        "message": "OK",
        "body": ["openstack","windriver","vmware"],
        "total": 0,
        "pageTotal": 0
    },
    loginVIM: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function () {
            return {
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                userName: faker.internet.userName(),
                passwd: faker.internet.password(),
                ownerDefinedType: faker.random.word(),
                authUrl: faker.internet.url(),
                cloudZone: faker.random.word(),
                tenant: faker.internet.userName(),
            }
        })
    },
    updateVIM: {
        code: 200,
        message: 'SUCCESS',
        body: _.times(10, function () {
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
        total: 50,
        body: _.times(10, function () {
            return {
                VNFMname: faker.name.firstName(),
                VNFMtype: faker.random.word(),
                VNFMvendor: faker.random.word(),
                VNFMversion: 'V' + faker.random.number(),
                url: faker.internet.url(),
                vim: faker.name.firstName(),
                authUrl: faker.internet.url(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
                createTime: faker.date.recent(),
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
            username: faker.internet.userName(),
            password: faker.internet.password()
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
            username: faker.internet.userName(),
            password: faker.internet.password()
        }
    },
    deleteVNFM: {
        code: 200,
        message: 'SUCCESS'
    },
    getTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        total: 20,
        body: _.times(10, function (n){
            if(n>3){
                n = 0
            }
            return {
                jobId: faker.random.uuid(),
                VNFName: faker.name.lastName(),
                jobName: faker.name.firstName(),
                createTime: faker.date.recent(),
                status: n,
                testSpeciflcation: faker.random.word(),
                jobDescription: faker.random.word(),
                testENV: [{title: 'Test VIM ENV', text: 'name'},{title: 'Test VNFM ENV', text: 'name'}],
                testCase: ['Test Case01', 'Test Case02', 'Test Case03']
            }
        })
    },
    getTestCaseMGTs:{
        code: 200,
        message: 'SUCCESS',
        total: 25,
        body: _.times(10, function (n){
            if(n%2 === 0){
                n = 0
            }else n = 1;
            return {
                testCaseNm: faker.random.number(),
                testCaseName: faker.name.firstName(),
                testCaseVersion: faker.random.number(),
                testCaseDes: faker.random.word(),
                testCaseState: n,
                publishTime: faker.date.recent(),
            }
        })
    },
    createTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        body: {
            jobId: faker.random.uuid(),
            VNFName: faker.name.firstName(),
            jobName: faker.name.lastName(),
        }
    },
    getSUTName: {
        code: 200,
        message: 'SUCCESS',
        body: {
            SUTName:  [faker.name.lastName(),faker.name.firstName(),]
        }
    },
    getJobSpecification: {
        code: 200,
        message: 'SUCCESS',
        body: {
            JobSpecification:  [faker.name.lastName(),faker.name.firstName()]
        }
    },
    getTestCaseList: {
        code: 200,
        message: 'SUCCESS',
        body: {
            testCaseList: [{name: 'Test Case01'}, {name: 'Test Case02'}, {name: 'Test Case03'}]
        }
    },
    deleteTestJobMGT: {
        code: 200,
        message: 'SUCCESS'
    },
    downloadTestJobMGT: {
        code: 200,
        message: 'SUCCESS'
    },
    runTestJobMGT: {
        code: 200,
        message: 'SUCCESS'
    },
    getProgress: {
        code: 200,
        message: 'SUCCESS',
        body: {
            progress: 99,
        }
    },
    getCurrentLanguage: {
        body: "en_US",
        statusCode: "100",
        message: "OK"
    }
}