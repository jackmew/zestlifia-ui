/**
 * Created by jasonlin on 7/13/14.
 */
define(['uweaver/environment'], function (environment) {

    var appContext = environment.appContext();
    var appName = environment.appName();


    function sound(name) {
        return appContext + "/lib/uweaver/resources/sound/" + name + ".ogg";
    }

    function image(name) {
        var ext = (name.indexOf('\.')===-1) ? ".png" : "";
        return appContext + appName + "/resources/image/" + name + ext;
    }

    function audio(name) {
        var ext = (name.indexOf('\.')===-1) ? ".ogg" : "";
        return appContext + appName + "/resources/audio/" + name + ext;
    }


    return {
        sound: sound,
        image: image,
        audio: audio
    };
});