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
                    code: 2,
                    dictLabel: "test02",
                    dictValue: "001",
                    dictParentCode: null,
                    status: "\u0000",
                    remark: null,
                    lang: null
                },
                createTime: faker.date.recent(),
                VNFFileName: faker.name.firstName(),
                address: "192.168.0.1:8080",
            }
        })
    },
    getVNFType: {
        code: 200,
        message: "OK",
        body: [
            {
                code: 0,
                dictLabel: "DRA",
                dictValue: "DRA",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 1,
                dictLabel: "MME",
                dictValue: "MME",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 2,
                dictLabel: "PCRF",
                dictValue: "PCRF",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 3,
                dictLabel: "SPGW",
                dictValue: "SPGW",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 4,
                dictLabel: "FW",
                dictValue: "FW",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 5,
                dictLabel: "DNS",
                dictValue: "DNS",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 6,
                dictLabel: "TAS",
                dictValue: "TAS",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 7,
                dictLabel: "HSS",
                dictValue: "HSS",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            }
        ],
        "total": 7,
        "pageTotal": 1
    },
    createVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    updateVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    uploadVNFFile: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    deleteVNFTest: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    getMeterSys: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                id: n + 1,
                name: faker.name.findName(),
                vendor: faker.company.companyName(),
                address: faker.internet.url(),
                createTime: faker.date.recent(),
                updateTime: faker.date.recent(),
                username: faker.name.findName(),
                password: faker.internet.password()
            }
        })
    },
    loginMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    updateMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    deleteMeterSys: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    getTestMeter: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                id: n + 1,
                name: faker.name.findName(),
                vendor: faker.company.companyName(),
                version: faker.random.number(),
                type: faker.database.type(),
                createTime: faker.date.recent(),
                updateTime: null,
                fileName: "test.casr",
                flag: 0,
                "typeCH": {
                    "code": n + 101001,
                    "dictLabel": "FW",
                    "dictValue": "1",
                    "dictParentCode": null,
                    "status": "\u0000",
                    "remark": null,
                    "lang": null
                }
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
                SUTType: faker.database.type(),
                VNFtype: faker.database.type(),
                PublishORG: faker.company.companyName(),
                publishTime: faker.date.recent(),
                caseMgt: [
                    {
                        id: n + 12,
                        name: 'testCase01',
                        description: 'This is Description name',
                        status: n > 1 ? 0 : 1,
                    },
                    {
                        id: n + 13,
                        name: 'testCase02',
                        description: 'This is Description name',
                        status: n > 1 ? 0 : 1,
                    }
                ]
            }
        })
    },
    getTestSpecSUTType: {
        code: 200,
        message: "OK",
        body: [
            {
                code: "10101",
                dictLabel: "FW",
                dictValue: "1",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: 10102,
                dictLabel: "MME",
                dictValue: 3,
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            },
            {
                code: "10103",
                dictLabel: "PCRF",
                dictValue: "2",
                dictParentCode: null,
                status: "\u0000",
                remark: null,
                lang: null
            }
        ],
        total: 3,
        pageTotal: 1
    },
    getTestSpecVNFType: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: ['VNF01', 'PNF01', 'XNF01', 'NFVI01']
    },
    addTestSpec: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    updateTestSpec: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    deleteTestSpec: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    getVIM: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(10, function (n) {
            return {
                id: n + 1,
                status: (n + 1) % 2 === 0 ? 0 : 1,
                cloudOwner: faker.name.firstName(),
                cloudRegionId: faker.random.number().toString(),
                cloudType: faker.random.word(),
                cloudVersion: 'V' + faker.random.number(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
                authUrl: faker.internet.url(),
                sslCacert: faker.internet.protocol(),
                sslInsecure: faker.internet.ipv6(),
                cloudDomain: faker.internet.domainName(),
                tenant: faker.internet.userName(),
                createTime: faker.date.recent(),
                updateTime: null,
                defaultTenant: faker.random.word(),
                cloudTypeCH: {
                    code: faker.random.number().toString(),
                    dictLabel: faker.random.word(),
                    dictValue: faker.random.number().toString(),
                    dictParentCode: null,
                    status: "\u0000",
                    remark: null,
                    lang: null
                }
            }
        })
    },
    getcloudType: {
        "code": 200,
        "message": "OK",
        "body": [
            {
                "code": "1001",
                "dictLabel": "openstack",
                "dictValue": "1",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "1003",
                "dictLabel": "vmware",
                "dictValue": "3",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "1002",
                "dictLabel": "Azure",
                "dictValue": "2",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "1004",
                "dictLabel": "FusionSphere",
                "dictValue": "4",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "1005",
                "dictLabel": "StarlingX",
                "dictValue": "5",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            }
        ],
        "total": 5,
        "pageTotal": 1
    },
    loginVIM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    updateVIM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    deleteVIM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    getVNFM: {
        code: 200,
        message: 'SUCCESS',
        total: 50,
        body: _.times(26, function (n) {
            return {
                id: n + 1,
                name: faker.name.firstName(),
                type: faker.random.word(),
                vendor: faker.random.word(),
                version: 'V' + faker.random.number(),
                url: faker.internet.url(),
                vim: faker.name.firstName(),
                certificateUrl: faker.internet.url(),
                username: faker.internet.userName(),
                password: faker.internet.password(),
                createTime: faker.date.recent(),
                updateTime: null
            }
        })
    },
    loginVNFM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    updateVNFM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    deleteVNFM: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    getTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        total: 20,
        body: _.times(10, function (n) {
            if (n > 3) {
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
                testENV: [{ title: 'Test VIM ENV', text: 'name' }, { title: 'Test VNFM ENV', text: 'name' }],
                testCase: ['Test Case01', 'Test Case02', 'Test Case03']
            }
        })
    },
    getTestCaseMGTs: {
        code: 200,
        message: 'SUCCESS',
        total: 25,
        body: _.times(10, function (n) {
            if (n % 2 === 0) {
                n = 0
            } else n = 1;
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
    getTestJobSUTType: {
        "code": 200,
        "message": "OK",
        "body": [
            {
                "code": "101",
                "dictLabel": "VNF",
                "dictValue": "1",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "102",
                "dictLabel": "PNF",
                "dictValue": "2",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            },
            {
                "code": "103",
                "dictLabel": "NFVI",
                "dictValue": "3",
                "dictParentCode": null,
                "status": "\u0000",
                "remark": null,
                "lang": null
            }
        ],
        "total": 3,
        "pageTotal": 1
    },
    getSUTName: {
        "code": 200,
        "message": "OK",
        "body": [
            {
                "id": 1,
                "name": "ZTE_vPCRF",
                "type": 101002,
                "vendor": null,
                "version": null,
                "createTime": null,
                "updateTime": null,
                "flag": 0,
                "fileName": null,
                "typeCH": null,
                "address": "10.10.1"
            },
            {
                "id": 2,
                "name": "Nokia_vSPGW",
                "type": 101003,
                "vendor": null,
                "version": null,
                "createTime": null,
                "updateTime": null,
                "flag": 0,
                "fileName": null,
                "typeCH": null,
                "address": "10.10.2"
            },
            {
                "id": 3,
                "name": "Ericsson_vFW",
                "type": 101004,
                "vendor": null,
                "version": null,
                "createTime": null,
                "updateTime": null,
                "flag": 0,
                "fileName": null,
                "typeCH": null,
                "address": "10.10.3"
            },
            {
                "id": 4,
                "name": "Ebupt_vDNS",
                "type": 101005,
                "vendor": null,
                "version": null,
                "createTime": null,
                "updateTime": null,
                "flag": 0,
                "fileName": null,
                "typeCH": null,
                "address": "10.10.4"
            }
        ],
        "total": 4,
        "pageTotal": 1
    },
    getJobSpecification: {
        "code": 200,
        "message": "OK",
        "body": [
            {
                "id": 6,
                "name": "11",
                "version": null,
                "vnfType": 0,
                "publishOrg": null,
                "publishTime": null,
                "caseMgt": null,
                "vnfTypeCH": null,
                "sutTypeCH": null
            },
            {
                "id": 8,
                "name": "666",
                "version": null,
                "vnfType": 0,
                "publishOrg": null,
                "publishTime": null,
                "caseMgt": null,
                "vnfTypeCH": null,
                "sutTypeCH": null
            },
            {
                "id": 1001,
                "name": "MME-SPEC",
                "version": null,
                "vnfType": 0,
                "publishOrg": null,
                "publishTime": null,
                "caseMgt": null,
                "vnfTypeCH": null,
                "sutTypeCH": null
            }
        ],
        "total": 3,
        "pageTotal": 1
    },
    getTestCaseList: {
        "code": 200,
        "message": "OK",
        "body": [
            {
                "id": 1000,
                "number": 1000,
                "name": "vFW-Function-Policy",
                "description": "The Firewall Policy can match the traffic's src security zone, dst security zone, src IP address, dst IP address, TCP/UDP port, and the action of policy rule can take effect right.",
                "version": "v1.0",
                "status": null
            },
            {
                "id": 2000,
                "number": 2000,
                "name": "vFW-Function-Web-Proxy",
                "description": "vFirewall can match and inspect HTTP traffic and HTTPS traffic, corresponding actions can take effect.",
                "version": "v1.0"
            },
        ],
        "total": 2,
        "pageTotal": 1
    },
    deleteTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    downloadTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        body: null
    },
    runTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        body: {
            "createTime": 1573907509154,
            "updateTime": 1573915021597,
            "id": 26,
            "jobId": 393178433819721700,
            "jobName": "Demo-Job-01",
            "jobStatus": "STARTED",
            "jobProgress": 100,
            "executionType": "ONCE",
            "fixedExecutionInterval": null,
            "fixedExecutionUnit": null,
            "cronExpression": null,
            "executionStartTime": "2019-11-16 14:40:36",
            "lastSuccessExecutionStartTime": "2019-11-16 14:36:36",
            "lastFailExecutionStartTime": null,
            "successExecutionCount": 6,
            "failExecutionCount": 0,
            "endpoint": "/portal/business/jobs/case/start",
            "remark": "Demo-Job-01",
            "sut": {
                "id": 1003,
                "name": "vFW",
                "type": 101004,
                "vendor": null,
                "version": null,
                "createTime": null,
                "updateTime": null,
                "flag": 101,
                "fileName": null,
                "typeCH": null
            },
            "spec": {
                "id": 1000,
                "name": "FW-SPEC",
                "version": null,
                "vnfType": 101004,
                "publishOrg": null,
                "publishTime": null,
                "caseMgt": null,
                "vnfTypeCH": null,
                "sutTypeCH": null
            }

        }
    },
    stopTestJobMGT: {
        code: 200,
        message: 'SUCCESS',
        body: null
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
        code: 200,
        message: "OK"
    }
}