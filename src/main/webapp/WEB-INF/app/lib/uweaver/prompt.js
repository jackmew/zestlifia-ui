/**
 * Created by jasonlin on 7/6/14.
 */
define(['jquery', 'underscore', 'uweaver/i18n', 'uweaver/resource', 'uweaver/widget/Messagebox'],
    function ($, _, i18n, resource, Messagebox) {

        function info(message, options) {
            options || (options = {});

            alert(message);
            return;

            var defaults = {
                title: "Hint"
            };

            _.defaults(options, defaults);

            var labels = {
                ok: "OK"
            };

            var messagebox = new Messagebox({
                labels: i18n.translate(labels),
                buttons: Messagebox.OK,
                title: i18n.translate(options.title),
                message: i18n.message(message),
                icon: resource.icon("info")
            });

            messagebox.render();
        }

        function warn(message, options) {
            options || (options = {});

            alert(message);
            return;

            var defaults = {
                title: "Warning"
            };

            _.defaults(options, defaults);

            var labels = {
                ok: "OK"
            };

            var messagebox = new Messagebox({
                labels: i18n.translate(labels),
                buttons: Messagebox.OK,
                title: i18n.translate(options.title),
                message: i18n.message(message),
                explanation: i18n.message(options.explanation),
                icon: resource.icon("warning")
            });

            messagebox.render();
        }

        function error(message, options) {
            options || (options = {});

            alert(message);
            return;

            var defaults = {
                title: "Error"
            };

            _.defaults(options, defaults);

            var labels = {
                ok: "OK"
            };

            var messagebox = new Messagebox({
                labels: i18n.translate(labels),
                buttons: Messagebox.OK,
                title: i18n.translate(options.title),
                message: i18n.message(message),
                explanation: i18n.message(options.explanation),
                icon: resource.icon("warning")
            });

            messagebox.render();
        }

        function confirm(message, options) {
            options || (options = {});

            var defaults = {
                title: "Confirm"
            };

            _.defaults(options, defaults);

            var labels = {
                yes: "YES",
                no: "NO",
                cancel: "CANCEL"
            };

            var messagebox = new Messagebox({
                labels: i18n.translate(labels),
                buttons: Messagebox.YESNOCANCEL,
                title: i18n.translate(options.title),
                message: i18n.message(message),
                icon: resource.icon("question")
            });

            messagebox.render();
        }

        function input(message, options) {
            options || (options = {});

            var defaults = {
                title: "Input"
            };

            _.defaults(options, defaults);

            var labels = {
                yes: "YES",
                no: "NO",
                cancel: "CANCEL"
            };

            var messagebox = new Messagebox({
                labels: i18n.translate(labels),
                buttons: Messagebox.YESNOCANCEL,
                title: i18n.translate(options.title),
                message: i18n.message(message),
                icon: resource.icon("question")
            });

            messagebox.render();
        }

        function wait() {

        }

        function progress() {

        }

        function done() {

        }

        return {
            info: info,
            warn: warn,
            error: error,
            confirm: confirm,
            input: input,
            wait: wait,
            progress: progress,
            done: done
        };
    });