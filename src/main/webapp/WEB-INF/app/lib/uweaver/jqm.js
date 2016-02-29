/**
 * Created by jasonlin on 6/20/14.
 */
define(['jquery', 'uweaver/_base/jquery.mobile/jquery.mobile',
        'css!uweaver/_base/jquery.mobile/jquery.mobile'], function($, jqm) {

    function load(name, req, onLoad, config) {
        // Prevents all anchor click handling
        $.mobile.linkBindingEnabled = false;

        // Disabling this will prevent jQuery Mobile from handling hash changes
        $.mobile.hashListeningEnabled = false;

        $.mobile.ignoreContentEnabled = true;

        onLoad(jqm);
    }

    return {
        load: load
    };
});