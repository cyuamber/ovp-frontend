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
    },
    pasteContent(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);

        const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;

        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
    }
}