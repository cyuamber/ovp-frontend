
export default {
    // change the menu key to router path
    transformUrlpathstr(str) {
        let pathstr = str.toLowerCase().replace(/\s*/g, "");
        pathstr = pathstr.replace(/\/*/g, "")
        return pathstr
    }
}