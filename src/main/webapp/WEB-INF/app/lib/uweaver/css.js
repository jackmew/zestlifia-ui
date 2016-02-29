/**
 * Created by jasonlin on 6/20/14.
 */

define([], function(){
    /**
     * Loader Plugin API method
     */
    function load(name, req, onLoad, config) {
        var url = req.toUrl(name + '.css');
        loadCss(url);
        onLoad(url);
    }

    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    return {
        load: load
    }
});