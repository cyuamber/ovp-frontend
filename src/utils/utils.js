import moment from 'moment';

export default {
    // change the menu key to router path
    transformUrlpathstr(str) {
        let pathstr = str.toLowerCase().replace(/\s*/g, "");
        pathstr = pathstr.replace(/\/*/g, "")
        return pathstr
    },
    getLastDaysPeriod(period) {
        let timeArr = [];
        for (let i = 0; i < period; i++) {
            let tiemItem = moment().subtract(i, "days").format("MM-DD");
            timeArr.push(tiemItem)
        }
        return timeArr.reverse()
    }
}