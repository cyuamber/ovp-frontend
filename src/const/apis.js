const baseUrl = '/portal/business'
export default {
  //mock api
  mock: {
    address: '/address',
    customerinfo: '/customer/info',
    xurantest: '/xuran/test/json',
    alarmformdata: '/alarm/formdata/v1/multiple',
    home: '/home',
    deleteaddress: '/delete/address',
    putname: '/articles'
  },
  getCurrentLanguage: '/lang/local',
  uploadFile: baseUrl + '/files/upload',
  downloadFile: baseUrl + '/files/:filealias/:filename',
  dashboard: {
    liveCaseAmount: baseUrl + '/dashboard/statisticLiveCaseAmount',
    PassCaseAmount7Days: baseUrl + '/dashboard/statisticPassCaseAmount7Days',
    jobsFlowAmount: baseUrl + '/dashboard/statisticJobsFlowAmount',
    sutAmount: baseUrl + '/dashboard/sutAmount',
    jobsAmount: baseUrl + '/dashboard/statisticJobsAmount',
    testEnvAmount: baseUrl + '/dashboard/testEnvAmount'
  },
  vimVnfmMgt: {
    vimEnvMgtTable: baseUrl + '/vimEnvMgt',
    manoEnvMgtTable: baseUrl + '/manos',
    cloudRegionID: baseUrl + '/cloudRegionID',
    cloudType: baseUrl + '/types/300',
    MANOType: baseUrl + '/types/200',
    vimEnvMgtInsert: baseUrl + '/vimEnvMgt/insert',
    vimEnvMgtUpdate: baseUrl + '/vimEnvMgt/update',
    vimEnvMgtDelete: baseUrl + '/vimEnvMgt/:id/delete',
    vnfmEnvMgtTable: baseUrl + '/vnfmEnvMgt',
    vnfmEnvMgtInsert: baseUrl + '/vnfmEnvMgt/insert',
    vnfmEnvMgtUpdate: baseUrl + '/vnfmEnvMgt/update',
    vnfmEnvMgtDelete: baseUrl + '/vnfmEnvMgt/:id/delete',
    manoMgtInsert: baseUrl + '/manos/insert',
    manoMgtUpdate: baseUrl + '/manos/:manoId/update',
    manoMgtDelete: baseUrl + '/manos/:id/delete'
  },
  instrumentMgs: {
    instrumentMgsTable: baseUrl + '/instrumentMgs',
    instrumentMgsInsert: baseUrl + '/instrumentMgs/insert',
    instrumentMgsUpdate: baseUrl + '/instrumentMgs/update',
    instrumentMgsDelete: baseUrl + '/instrumentMgs/:id/delete'
  },
  suiteMgt: {
    suiteMgtTable: baseUrl + '/suiteMgt',
    suiteMgtInsert: baseUrl + '/suiteMgt/insert',
    suiteMgtUpdate: baseUrl + '/suiteMgt/update',
    suiteMgtDelete: baseUrl + '/suiteMgt/:id/delete',
    suiteType: baseUrl + '/types/:flag'
  },
  sutMgt: {
    sutMgtTable: baseUrl + '/sutMgt',
    sutMgtInsert: baseUrl + '/sutMgt/insert',
    sutMgtUpdate: baseUrl + '/sutMgt/update',
    sutMgtDelete: baseUrl + '/sutMgt/:id/delete',
    sutMgtType: baseUrl + '/types/:flag'
  },
  testJobMgt: {
    testJobTable: baseUrl + '/jobs',
    testJobInsert: baseUrl + '/jobs/insert',
    testJobUpdate: baseUrl + '/jobs/:jobId/update',
    testJobDelete: baseUrl + '/jobs/:jobId/delete',
    testJobStart: baseUrl + '/jobs/:jobId/start',
    testJobStop: baseUrl + '/jobs/:jobId/stop',
    testJobProgress: baseUrl + '/jobs/:jobId',
    testJobDetail: baseUrl + '/jobs/cases/:jobId/:ExecutionStartTime',
    testJobSUTType: baseUrl + '/types/100',
    testJobSUTName: baseUrl + '/sutName/:code',
    testJobSpec: baseUrl + '/testSpec/:type',
    testJobTestCase: baseUrl + '/testCase/jobCase',
    testJobDownLoad: baseUrl + '/jobs/cases/download/:jobId',
    testFailedDetail: baseUrl + '/jobs/case/executions/retrieve/:requestId',
    testJobCaseExecutions: baseUrl + '/jobs/case/executions/list/:requestId',
    testJobCaseVNFUplaod: baseUrl + '/jobs/:jobId/csars/upload',
    testJobCaseVNFReupload: baseUrl + '/jobs/:jobId/csars/reupload'
  },
  TestSpecMgt: {
    specMgtTable: baseUrl + '/specMgt',
    testCaseTable: baseUrl + '/testCase/:specId',
    specMgtInsert: baseUrl + '/specMgt/insert',
    specMgtUpdate: baseUrl + '/specMgt/update',
    specMgtDelete: baseUrl + '/specMgt/:id/delete',
    TestSpecSUTType: baseUrl + '/types/100',
    TestSpecVNFType: baseUrl + '/types/:flag',
    testCaseList: baseUrl + '/testCase/box/:flag/:subSutType',
    specMgtCaseActivate: baseUrl + '/testCase/updateStatus/:id/:status'
  }
}
