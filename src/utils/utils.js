
export default {
    transformUrlpathstr(str) {
        let pathstr = str.toLowerCase().replace(/\s*/g, "");
        pathstr = pathstr.replace(/\/*/g, "")
        return pathstr
    }
}