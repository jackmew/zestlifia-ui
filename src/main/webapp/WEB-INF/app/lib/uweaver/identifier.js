/**
 * Created by jasonlin on 8/18/14.
 */
define(['underscore'], function (_) {

    function randomUUID() {
        return _.uniqueId();
    }

    return {
        randomUUID: randomUUID
    }

});