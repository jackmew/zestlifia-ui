/**
 * Created by jasonlin on 6/12/14.
 */
define(['uweaver/lang', 'uweaver/data/Item'], function(lang, Item) {
    var declare = lang.declare;

    var Activity = declare(Item, {
        resource: 'activities',

        defaults: {
            id: undefined,
            name: undefined,
            activities: undefined
        },

        constraints: {
            id: 'required alphaNumeric',
            name: 'required'
        }
    });

    return Activity;
});