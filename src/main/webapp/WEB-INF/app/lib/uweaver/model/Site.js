/**
 * Created by jasonlin on 6/12/14.
 */
define(['uweaver/lang', 'uweaver/model/Model', 'uweaver/validator',
    'uweaver/Logger', 'uweaver/net'], function(lang, Model, validator, Logger, net) {
    var declare = lang.declare;

    var Site = declare(Model, {
        /**
         * constructors
         */
        initialize: initialize,

        /**
         * public interfaces
         */
        login: login,
        privileges: privileges,

        /**
         * protected members
         */
        logger: new Logger("Site"),
        resource: 'sites',
        constraints: {
            id: 'required alphaNumeric',
            name: 'required alphaNumeric',
            email: 'email',
            effectiveDate: 'date',
            expireDate: 'date'
        }
    });

    function initialize(config) {

        Model.prototype.initialize.apply(this, arguments);

        config || (config = {});

        var defaults = {
            id: 'default',
            name: undefined,
            email: undefined,
            effectiveDate: undefined,
            expiredDate: undefined,
            domain: undefined
        };

        _.defaults(config, defaults);
    }

    function sitemap(options) {
        options || (options = {});

        var settings = {
            action: 'sitemap',
            method: 'GET',
            data: {},
            context: this
        };

        _.defaults(settings, options);

        var promise = net.request(this.url(settings), settings);

        return promise;
    }


    function login(username, password) {
        var options = {
            action: 'login',
            method: 'GET',
            data: {
                username: username,
                password: password
            },
            context: this
        };

        var promise = net.request(this.url(options), options);

        promise.then(function(response) {
            var item = response.items[0];
            this.set(item);
            this.trigger("login");
        }, this);

        return promise;
    }

    function privileges() {
        var options = {
            action: 'privileges',
            method: 'GET',
            data: {
                credential: this.get('credential')
            },
            context: this
        };

        var promise = net.request(this.url(options), options);

        promise.then(function(response) {
            this._privileges = response.items;
        }, this);

        return promise;
    }

    return Site;
});