require([
    'Application',
    'domReady!'
], function(Application) {

    uweaver.traceDependency('Panel');

    window.application = new Application();

    application.run();

});