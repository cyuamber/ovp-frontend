module.exports = {
  '/articles/:user': '/articles?user=:user',
  '/:resource/:id/show': '/:resource/:id',
  '/lang/local': '/getCurrentLanguage',
  '/lang/local?language=:language': '/getCurrentLanguage',
  ///////<-------------Dashboard--------->/////
  '/portal/business/dashboard/statisticLiveCaseAmount': '/_getLiveCaseAmount',
  '/portal/business/dashboard/statisticPassCaseAmount7Days':
    '/_getPassCaseAmount7Days',
  '/portal/business/dashboard/statisticJobsFlowAmount': '/_getJobsFlowAmount',
  '/portal/business/dashboard/sutAmount': '/_getSutAmount',
  '/portal/business/dashboard/statisticJobsAmount': '/_getJobAmount',
  '/portal/business/dashboard/testEnvAmount': '/_getTestEnvAmount',
  ///////<-------------VimEnv--------->/////
  '/portal/business/vimEnvMgt?pageNum=:pageNum&pageSize=:pageSize': '/_getVIM',
  '/portal/business/manos?pageNum=:pageNum&pageSize=:pageSize': '/_getMANOList',
  '/portal/business/cloudType/1000': '/getcloudType',
  '/POST/portal/business/vimEnvMgt/insert': '/loginVIM',
  '/PUT/portal/business/vimEnvMgt/update': '/updateVIM',
  '/DELETE/portal/business/vimEnvMgt/:id/delete': '/deleteVIM',
  '/portal/business/vnfmEnvMgt?pageNum=:pageNum&pageSize=:pageSize':
    '/_getVNFM',
  '/POST/portal/business/vnfmEnvMgt/insert': '/loginVNFM',
  '/PUT/portal/business/vnfmEnvMgt/update': '/updateVNFM',
  '/DELETE/portal/business/vnfmEnvMgt/:id/delete': '/deleteVNFM',
  '/portal/business/types/200': '/getMANOType',
  '/PUT/portal/business/manos/insert': '/updateVNFM',
  '/PUT/portal/business/manos/:manoId/update': '/updateVNFM',
  '/PUT/portal/business/manos/:manoId/delete': '/updateVNFM',
  ///////<-------------Instrument MGS MGT--------->/////
  '/portal/business/instrumentMgs': '/_getMeterSys',
  '/POST/portal/business/instrumentMgs/insert': '/loginMeterSys',
  '/PUT/portal/business/instrumentMgs/update': '/updateMeterSys',
  '/DELETE/portal/business/instrumentMgs/:name/delete': '/deleteMeterSys',
  ///////<-------------Instrument Package MGT--------->/////
  '/portal/business/suiteMgt?pageNum=:pageNum&pageSize=:pageSize&flag=:flag':
    '/_getTestMeter',
  '/portal/business/suiteMgt?pageSize=:pageSize&flag=:flag': '/_getTestMeter',
  // "/portal/business/instrumentMgs": "/_getMeterSys",
  '/POST/portal/business/suiteMgt/insert': '/loginMeterSys',
  '/PUT/portal/business/suiteMgt/update': '/updateMeterSys',
  '/DELETE/portal/business/suiteMgt/:id/delete': '/deleteMeterSys',
  '/portal/business/files/:filealias/:filename': '/_downloadFile',
  ///////<-------------TestSUT--------->/////
  '/portal/business/sutMgt?flag=:flag&pageNum=:pageNum&pageSize=:pageSize':
    '/_getVNFTest',
  '/POST/portal/business/sutMgt/insert': '/createVNFTest',
  '/PUT/portal/business/sutMgt/update': '/updateVNFTest',
  '/DELETE/portal/business/sutMgt/:id/delete': '/deleteVNFTest',
  '/portal/business/types/:flag': '/getVNFType',
  '/PUT/portal/business/files/upload': '/updateVNFTest',
  ///////<-------------Test Spec MGT--------->/////
  '/portal/business/specMgt?pageNum=:pageNum&pageSize=:pageSize':
    '/_getTestSpec',
  '/portal/business/testCase/:specId': '/_getTestCaseTable',
  '/POST/portal/business/specMgt/insert': '/addTestSpec',
  '/PUT/portal/business/specMgt/update': '/updateTestSpec',
  '/DELETE/portal/business/specMgt/:id/delete': '/deleteTestSpec',
  '/PUT/portal/business/testCase/updateStatus/:id/:status': '/updateTestSpec',
  '/portal/business/types/100': '/_getTestSpecSUTType',
  '/portal/business/testCase/box/:flag/:subSutType': '/_getTestCaseList',
  ///////<-------------Test Job--------->/////
  '/portal/business/jobs?pageNum=:pageNum&pageSize=:pageSize':
    '/_getTestJobMGT',
  '/portal/business/sutName/:code': '/getSUTName',
  '/portal/business/testSpec/:type': '/getJobSpecification',
  '/portal/business/testCase/jobCase?specId=:specId&sutId=:sutId':
    '/_getTestCaseList',
  '/POST/portal/business/jobs/insert': '/addTestSpec',
  '/PUT/portal/business/jobs/:jobId/update': '/addTestSpec',
  '/PUT/portal/business/jobs/:jobId/start': '/runTestJobMGT',
  '/PUT/portal/business/jobs/:jobId/stop': '/stopTestJobMGT',
  '/portal/business/jobs/:jobId': '/_getJobProgress',
  '/portal/business/jobs/cases/:jobId/:ExecutionStartTime': '/_testJobDetail',
  '/portal/business/jobs/case/executions/list/:requestId':
    '/_getcaseExecutionsList',
  '/portal/business/jobs/case/executions/list/:requestId?jobId=:jobId':
    '/_getcaseInstrumentList', //2020.12.01新增
  '/portal/business/jobs/cases/download/:jobId': '/_downloadFile',
  '/portal/business/testCase/:caseId/:sutId': '/_downloadFile',
  ///////<-------------general interface--------->/////
  '/api/*': '/$1',
  '/*/*': '/$1_$2',
  '/*/*/*': '/$1_$2_$3',
  '/*/*/*/*': '/$1_$2_$3_$4',
  '/*/*/*/*/*': '/$1_$2_$3_$4_$5'
}
