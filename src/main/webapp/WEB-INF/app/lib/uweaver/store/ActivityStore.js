/**
 * Created by jasonlin on 9/16/14.
 */
define(['uweaver/lang', 'uweaver/data/Store', 'uweaver/model/Activity',
    'uweaver/net', 'uweaver/Deferred'], function(lang, Store, Activity, net, Deferred) {
    var declare = lang.declare;

    var ActivityStore = declare(Store, {
        model: Activity,
        sitemap: sitemap
    });

    function sitemap(options) {
        options || (options = {});

        var defaults = {
            async: false,
            action: 'sitemap',
            method: 'GET'
        };

        _.defaults(options, defaults);

        var promise = net.request(this.url(options), options);

        var deferred = new Deferred();
        promise.then(
            function(response) {
                var data = response.items;
                deferred.resolve(data);
            },
            function() {
                deferred.reject();
            }
        );
        return deferred.promise();
    }

    return ActivityStore;
});