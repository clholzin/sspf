define(["marionette", "jquery", "jquery-ui","jquery-ui-touch"], function (Marionette, $) {
    Marionette.Region.Dialog = Marionette.Region.extend({
        onShow: function (view) {
            this.listenTo(view, "dialog:close", this.closeDialog);
            this.listenTo(view, "dialog:checkData", this.beforeClose);
            var self = this;
            this.$el.dialog({
                modal: true,
                title: view.title,
                draggable: true,
                width: "auto",
                height:"auto",
                position: { my: "top", at: "top", of: window },
                dialogClass: 'animated slideInTop',
                closeOnEscape: true,
                show: {
                    effect: "fadeIn",
                    duration: 150
                },
                hide: {
                    effect: "fadeIn",
                    duration: 100
                },
                create: function (event, ui) {
                    $("body").css({overflow: 'hidden'});
                },
                beforeClose: function (event, ui) {
                    if (confirm('Are you sure, date entered may not be saved.')) {
                        $("body").css({overflow: 'inherit'});
                        self.closeDialog();
                    }
                }
            });
        },
        beforeClose: function () {
            var self = this;
            if (confirm('Are you sure, date entered may not be saved.')) {
                //$("body").css({overflow: 'inherit'});
                self.closeDialog();
            }
        },
        closeDialog: function () {
            this.stopListening();
            this.empty();
            $("body").css({overflow: 'inherit'});
            this.$el.dialog("destroy");
        }
    });

    return Marionette.Region.Dialog;
});
