/**
 * Created by jasonlin on 6/13/14.
 */
define(['uweaver/lang', 'uweaver/store/Store', 'uweaver/model/User'], function(lang, Store, User) {
    var declare = lang.declare;

    var UserStore = declare(Store, {
        /**
         * protected members
         */
        model: User
    });

    return UserStore;
});