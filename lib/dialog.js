function loginDialog(connect) {

    var dialog = $('<div />').attr('class', 'form').attr('title', 'Connect to a server');

    var form = $('<form />').attr('action', './').attr('method', 'post').appendTo(dialog);

    $('<div />').append($('<label />').append($('<span />').text('BIMserver: ')).append($('<input />').attr('type', 'text').attr('name', 'server').val('http://127.0.0.1:8082/'))).appendTo(form);
    $('<div />').append($('<label />').append($('<span />').text('Email: ')).append($('<input />').attr('type', 'text').attr('name', 'email').val('admin@bimserver.org'))).appendTo(form);
    $('<div />').append($('<label />').append($('<span />').text('Password: ')).append($('<input />').attr('type', 'password').attr('name', 'password').val('admin'))).appendTo(form);

    $(form).find('input').keydown(
        function (event) {
            var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
            if (keycode == 13) {
                $(form).submit();
            }
        });

    $(form).submit(function (e) {

        e.preventDefault();

        $(dialog).find('div.state').remove();

        var serverURL = $.trim($(dialog).find('input[name="server"]').val());
        var email = $.trim($(dialog).find('input[name="email"]').val());
        var password = $.trim($(dialog).find('input[name="password"]').val());

        var ok = true;

        if (serverURL == '') {
            ok = false;
            $(dialog).find('input[name="server"]').addClass('ui-state-error');
        } else {
            $(dialog).find('input[name="server"]').removeClass('ui-state-error')
        }

        if (email == '') {
            ok = false;
            $(dialog).find('input[name="email"]').addClass('ui-state-error');
        } else {
            $(dialog).find('input[name="email"]').removeClass('ui-state-error')
        }

        if (password == '') {
            ok = false;
            $(dialog).find('input[name="password"]').addClass('ui-state-error');
        } else {
            $(dialog).find('input[name="password"]').removeClass('ui-state-error')
        }

        if (ok) {

            $(dialog).closest('div.ui-dialog')
                .find('.ui-dialog-buttonpane')
                .find('button:contains("Connect")')
                .attr('disabled', 'disabled').addClass('disabled');

            if (connect(serverURL, email, password)) {
                $(dialog).dialog('close');
            }
        }
    });

    $(dialog).dialog({
        autoOpen: true,
        width: 450,
        modal: true,
        closeOnEscape: false,

        open: function (event, ui) {
            $(".ui-dialog .ui-dialog-titlebar-close").hide();
        },

        buttons: {
            "Connect": function () {
                $(form).submit();
            }
        },

        close: function () {
            $(dialog).remove();
        }
    });
}