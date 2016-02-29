/**
 * Created by jasonlin on 6/12/14.
 */
define(['uweaver/lang', 'uweaver/model/Model', 'uweaver/validator',
    'uweaver/Logger', 'uweaver/net'], function(lang, Model, validator, Logger, net) {
    var declare = lang.declare;

    var User = declare(Model, {
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
        logger: new Logger("User"),
        resource: 'users',
        constraints: {
            username: 'required alphaNumeric',
            email: 'required email',
            effectiveDate: 'date',
            expireDate: 'date'
        }
    });

    function initialize(config) {

        Model.prototype.initialize.apply(this, arguments);

        config || (config = {});

        var defaults = {
            username: undefined,
            password: undefined,
            name: undefined,
            email: undefined,
            note: undefined,
            effectiveDate: undefined,
            expireDate: undefined,
            credential: undefined
        };

        _.defaults(config, defaults);

        this.on('change:credential', function(){
            this.logger.debug(Logger.PROBE, "onChange");
        });

        this.on('invalid', function(model, error) {
            this.logger.debug(Logger.INVALIDATE, "onInvalid", error);
        });
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

    return User;
});