/**
 * Created by jasonlin on 6/20/14.
 */
define(['underscore', 'jquery', 'uweaver/lang', 'uweaver/resource', 'i18n', 'uweaver/prompt',
        'uweaver/wm/WindowManager', 'uweaver/widget/Form',
        'uweaver/Logger',
        'text!./tpl/Logon.html'],
    function(_, $, lang, resource, i18n, prompt, WindowManager, Form , Logger, tpl) {
        var declare = lang.declare;

        var Logon = declare(WindowManager, {

            logger: new Logger("Logon"),

            form: undefined,

            cache: undefined,

            initialize: initialize,
            prepare: prepare,

            execute: execute,
            login: login,
            reset: reset,

            onFormExecute: function(command, event) {
                this.execute(command);
            }
        });

        function initialize(config) {

            WindowManager.prototype.initialize.apply(this, arguments);

            var defaults = {
                logo: resource.image('logo'),
                title: i18n.translate('Logon'),
                footnote: i18n.translate('Power by uWeaver')
            };
            _.defaults(config, defaults);

            this.tpl = tpl;

            this.cache = {};

        }

        function prepare() {
            this.$component = this.$("[data-role=page]");
            var form = new Form({
                el:this.$('form')
            });

            form.render({enhance: false});

            this.form = form;

            this.listenTo(form, 'all', _.bind(this.onFormExecute, this));

        }

        function reset() {

        }

        function execute(command) {
            switch (command.toUpperCase()) {
                case Logon.COMMAND.RESET:
                    this.reset();
                    break;
                case Logon.COMMAND.LOGIN:
                    this.login();
                    break;
                default:
                    var event = {
                        data: this.values(),
                        context: this
                    };

                    this.trigger(command, event);
                    break;
            }
        }

        function login() {
            var form = this.form;

            form.disable();

            if(!form.validate({prompt:true, mark:true})) {
                form.enable();
                return;
            }

            if(!(this.model && this.model.login)) {
                var values = form.values();
                var event = {
                    data: values,
                    context: this
                };

                this.trigger('login', event);
                form.enable();
                return;
            }

            var promise = this.model.login({async: false});

            promise.then(
                function(response) {
                    prompt.info("Login successfully.");
                },
                function(error) {
                    prompt.warn("Login failed!");
                }
            );

            promise.always(
                function() {
                    form.enable();
                }
            );
        }

        // Enumeration of build in commands
        Logon.COMMAND = {
            RESET: 'RESET',
            LOGIN: 'LOGIN'
        };

        return Logon;
    });