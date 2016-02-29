/**
 * Created by jasonlin on 6/13/14.
 */
define(['uweaver/lang', 'uweaver/store/Store', 'uweaver/model/Site'], function(lang, Store, Site) {
    var declare = lang.declare;

    var SiteStore = declare(Store, {
        /**
         * public interfaces
         */

        /**
         * protected members
         */
        model: Site
    });


    return SiteStore;
});