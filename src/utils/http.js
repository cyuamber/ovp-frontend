
import axios from 'axios';

axios.defaults.withCredentials = true; // set cross-origin

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "x-requested-with,content-type"
});

export default {
    axiospost(url, data) {
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                headers: getHeaders(),
            }).then((res) => {
                resolve(res.data);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    axiosget: (url, data) => new Promise((resolve, reject) => {
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        axios.get(url, {
            params: data,
            headers: getHeaders(),
        }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        });
    }),
    axiosmock: (url, param, data) => new Promise((resolve) => {
        console.log('%ccurrenturl', 'padding: 3px; background: #009fff; color: #fff; border-radius: 3px;', url)
        console.log('%ccurrentparams', 'padding: 3px; background:#ff0024; color: #fff; border-radius: 3px;', param)
        resolve(data);
    })
};
