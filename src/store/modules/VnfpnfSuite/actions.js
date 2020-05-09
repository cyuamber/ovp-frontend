import { axiosget, axiospost, axiosput, axiosdelete } from '../../../utils/http';
import API from '../../../const/apis';
import { axiosgetType } from '../../../const/constant';
import state from './state';
import * as types from './mutations_types';

const actions = {
  getTableData ({ dispatch, commit, state }, obj) {
    let req = {
      pageNum: state.pagination.current,
      pageSize: state.pagination.pageSize
    };
    Object.keys(obj).forEach(item => {
      if (obj[item] !== '' && obj[item] !== undefined) {
        req[item] = obj[item];
      }
    });
    dispatch('loading/tableLoading', true, { root: true });
    req.flag = state.currentTab;
    let axiosrequest = axiosgetType ? axiospost : axiosget;
    axiosrequest(API.suiteMgt.suiteMgtTable, req).then(
      res => {
        if (res.code === 200) {
          commit(types.UPDATE_TABLE_DATA, res);
          dispatch('loading/tableLoading', false, { root: true });
          if (req.createTime || req.name)
            dispatch(
              'loading/showLoading',
              { type: 'success', toast: 'Successfully get table data' },
              { root: true }
            );
        } else {
          if (req.createTime || req.name)
            dispatch(
              'loading/showLoading',
              { type: 'failed', toast: 'Network exception, please try again' },
              { root: true }
            );
        }
      },
      () => {
        if (req.createTime || req.name)
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: 'Network exception, please try again' },
            { root: true }
          );
      }
    );
  },
  getVNFOptions ({ commit }) {
    let url = API.suiteMgt.suiteType.replace(':flag', state.currentTab);
    axiosget(url).then(res => {
      if (res.code === 200) {
        commit(types.UPDATE_VNF_OPTIONS, res.body);
      } else {
        this.$message.error('Network exception, please try again');
      }
    });
  },
  getSystemOptions ({ commit }) {
    let url = API.instrumentMgs.instrumentMgsTable;
    axiosget(url).then(res => {
      if (res.code === 200) {
        commit(types.UPDATE_SYSTEM_OPTIONS, res.body);
      } else {
        this.$message.error('Network exception, please try again');
      }
    });
  },
  clearOptions ({ commit }) {
    commit(types.UPDATE_VNF_OPTIONS, []);
  },
  getPagination ({ commit }, { pagination }) {
    commit(types.UPDATE_PAGINATION, pagination);
  },
  clearPagination ({ commit }) {
    commit(types.UPDATE_PAGINATION, { current: 1, total: 0 });
  },
  uploadVNFFile ({ commit }, { formData, message }) {
    axiospost(API.uploadFile, { file: formData }, true).then(
      res => {
        commit(types.UPDATE_TOKEN, null);
        if (res.code === 200) message.success('Upload successfully');
        else message.error('Upload failed');
      },
      () => {
        message.error('Network exception, please try again');
        commit(types.UPDATE_TOKEN, null);
      }
    );
  },
  createOrEditTestMeter ({ dispatch, state }, { data, isEdit, message }) {
    let url = isEdit ? API.suiteMgt.suiteMgtUpdate : API.suiteMgt.suiteMgtInsert;
    let axiosType = isEdit ? axiosput : axiospost;
    axiosType(url, data).then(
      res => {
        if (res.code === 200) {
          dispatch(
            'loading/showLoading',
            {
              type: 'success',
              toast: isEdit
                ? 'Successfully updated'
                : 'Has been added successfully'
            },
            { root: true }
          );
          let obj = {
            flag: state.currentTab,
            pageNum: state.pagination.current,
            pageSize: state.pagination.pageSize
          };
          dispatch('getTableData', obj);
        } else if (res.code === 417) {
          message.error(res.body);
        } else
          dispatch(
            'loading/showLoading',
            { type: 'failed', toast: isEdit ? 'Update failed' : 'add failed' },
            { root: true }
          );
      },
      () => {
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        );
      }
    );
  },
  deleteTestMeter ({ dispatch, state }, { id, message }) {
    let url = API.suiteMgt.suiteMgtDelete.replace(':id', id);
    axiosdelete(url).then(res => {
      if (res.code === 200) {
        dispatch(
          'loading/showLoading',
          { type: 'success', toast: 'Deleted successfully' },
          { root: true }
        );
        let obj = {
          flag: state.currentTab,
          pageNum: state.pagination.current,
          pageSize: state.pagination.pageSize
        };
        dispatch('getTableData', obj);
      } else if (res.code === 417) {
        message.error(res.body);
      } else
        dispatch(
          'loading/showLoading',
          { type: 'failed', toast: 'Network exception, please try again' },
          { root: true }
        );
    });
  },
  downloadFile ({ dispatch }, { fileName, fileAliasName }) {
    let url = API.downloadFile
      .replace(':filealias', fileAliasName)
      .replace(':filename', fileName);
    window.open(window.location.protocol + '//' + window.location.host + url);
    dispatch(
      'loading/showLoading',
      { type: 'success', toast: 'DownLoad File successfully' },
      { root: true }
    );
  }
};

export default actions;