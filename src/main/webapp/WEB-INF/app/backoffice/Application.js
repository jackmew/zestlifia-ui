define(['underscore', 'jquery',
    'uweaver/wm/Workbench', 'uweaver/data/Sites', 'uweaver/data/Activities', 'uweaver/data/User'], function (_, $, Workbench, Sites, Activities, User) {

    var declare = uweaver.lang.declare;

    var Base = null;

    function initialize() {
        var sites = new Sites();
        var user = new User();
        var activities = new Activities();

        this._wm = new Workbench({
            sites: sites,
            activities: activities,
            user: user
        });
    }

    function run() {
        var wm = this._wm;
        wm.render();
    }

    var props = {
        _wm: undefined
    };

    var Application = declare(Base, {
        initialize: initialize,
        run: run
    }, props);

    return Application;
});