var sendBTC = {
    'fiatRates': {
        'USD': null,
        'EUR': null,
        'RUB': null,
        'CNY': null,
    },
    'refreshQRCodeDelay': 400,
    'fiatSymbol': function(fiat) {
        return '<span class="fa fa-' + fiat.toLowerCase() + '"></span>';
    },
    'refreshQRCode': function(uri) {
        delete this.refreshQRCodeID;
        $('#send-btc-modal-qrcode').empty();
        $('#send-btc-modal-qrcode').qrcode(uri);
    },
    'refreshURI': function(delayQRCode) {
        var uri = 'bitcoin:' + this.address + '?amount=' + encodeURIComponent($('#send-btc-amount').val()) + '&label=' + encodeURIComponent($('#send-btc-label').val());
        $('#send-btc-uri').attr('href', uri);
        $('#send-btc-modal-form').attr('action', uri);
        if (this.refreshQRCodeID)
            clearTimeout(this.refreshQRCodeID);
        if (delayQRCode) {
            var me = this;
            this.refreshQRCodeID = setTimeout(function() { me.refreshQRCode(uri); }, me.refreshQRCodeDelay);
        } else {
            delete this.refreshQRCodeID;
            this.refreshQRCode(uri);
        }
    },
    'refreshBTC': function() {
        var rate = this.fiatRates[this.fiat];
        if (rate) {
            $('#send-btc-amount').val(($('#send-btc-fiat-amount').val() / rate).toFixed(8));
            this.refreshURI(true);
        }
    },
    'refreshFiat': function() {
        var rate = this.fiatRates[this.fiat];
        if (rate)
            $('#send-btc-fiat-amount').val(($('#send-btc-amount').val() * rate).toFixed(8));
    },
    'setFiat': function(fiat) {
        if (!(fiat in this.fiatRates))
            throw 'Invalid currency "' + fiat + '"';
        this.fiat = fiat;
        $('#send-btc-modal-fiat-symbol').html(this.fiatSymbol(fiat));
        this.refreshFiat();
    },
    'updateExchange': function() {
        var me = this;
        $.getJSON('https://blockchain.info/ticker', function(data, textStatus) {
            var options = $('#send-btc-modal-fiat-options');
            options.empty();
            var gotSome = false;
            for (fiat in me.fiatRates) {
                if (fiat in data) {
                    gotSome = true;
                    me.fiatRates[fiat] = data[fiat].last;
                    options.append(
                        '<li style="cursor:pointer;"><a onclick="sendBTC.setFiat(\'' + fiat + '\');">' +
                        me.fiatSymbol(fiat) + ' ' + fiat +
                        ' <span class="text-muted">' + me.fiatRates[fiat] + '</span>' +
                        '</a></li>'
                    );
                }
            }
            if (gotSome)
                options.append('<li role="separator" class="divider"></li>');
            options.append('<li style="cursor:pointer;"><a onclick="sendBTC.updateExchange();"><span class="text-muted">Fetch rates</span></a></li>');
            me.refreshFiat();
        });
    },
    'insertModal': function() {
        console.log('doin it');
        $('body').prepend('<div class="modal fade" id="send-btc-modal" tabindex="-1" role="dialog" aria-labelledby="send-btc-modal-title"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button><h4 class="modal-title" id="send-btc-modal-title">Send to <a id="send-btc-uri"><span id="send-btc-address"></span></a></h4></div><form id="send-btc-modal-form" class="form-horizontal" role="form"><div class="modal-body"><div class="form-group"><label class="control-label col-sm-2" for="send-btc-label">Label</label> <span class="input-group col-sm-9"><input type="text" id="send-btc-label" class="form-control" name="label" placeholder="subject" oninput="sendBTC.refreshURI(true);"></span></div><div class="form-group"><label class="control-label col-sm-2" for="send-btc-amount">Amount</label> <span class="input-group col-sm-9"><input type="number" id="send-btc-amount" class="form-control" name="amount" min="0" step="1e-8" oninput="sendBTC.refreshFiat();sendBTC.refreshURI(true);" required=""> <span class="input-group-addon" aria-hidden="true"><span class="fa fa-btc"></span></span></span></div><div class="form-group"><label class="control-label col-sm-2 sr-only" for="send-btc-fiat-amount">Fiat amount</label> <span class="input-group col-sm-9"><input type="number" id="send-btc-fiat-amount" class="form-control" min="0" step="1e-8" oninput="sendBTC.refreshBTC();"> <span class="input-group-btn"><button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="fa fa-caret-down"></span> <span id="send-btc-modal-fiat-symbol"></span></button><ul id="send-btc-modal-fiat-options" class="dropdown-menu"><li style="cursor:pointer;"><a onclick="sendBTC.updateExchange();"><span class="text-muted">Fetch rates</span></a></li></ul></span></span></div><div id="send-btc-modal-qrcode" class="text-center"></div></div><div class="modal-footer"><input type="submit" class="btn btn-primary" value="Open in wallet"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></form></div></div></div>');
    },
    'init': function() {
        this.insertModal();
        sendBTC.updateExchange();
        $('#send-btc-modal').on('show.bs.modal', function(event) {
            var trigger = $(event.relatedTarget);
            var address = trigger.data('address') || '';
            var label = trigger.data('label') || '';
            var amount = trigger.data('amount') || '0.0';
            var fiat = trigger.data('fiat') || 'USD';
        
            if (!$.isNumeric(amount) || amount < 0)
                throw 'Invalid amount "' + amount + '"';
            if (!(fiat in sendBTC.fiatRates))
                throw 'Invalid currency "' + fiat + '"';
        
            sendBTC.address = address;
            sendBTC.label = label;
            $('#send-btc-address').text(address);
            $('#send-btc-label').val(label);
            $('#send-btc-amount').val(amount);
            sendBTC.setFiat(fiat);
            sendBTC.refreshURI();
        });
    },
};
sendBTC.init();
