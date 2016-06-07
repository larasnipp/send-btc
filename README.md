# send-btc

This is a super simple way to receive bitcoin online.

## Building

This package includes a shitty build system that minifies all source files
into a single script called `send-btc.min.js`. The build system is just a node script that depends on
[fs](https://www.npmjs.com/package/fs), [minimize](https://www.npmjs.com/package/minimize), and
[node-minify](https://www.npmjs.com/package/node-minify). Run:

```bash
node build
```

## Dependencies

You have to include (using major CDNs as examples):

```html
<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
<!-- Font Awesome CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
<!-- jQuery JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js" integrity="sha384-8C+3bW/ArbXinsJduAjm9O7WNnuOcO+Bok/VScRYikawtvz4ZPrpXtGfKIewM9dK" crossorigin="anonymous"></script>
<!-- jQuery QR-code JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js" integrity="sha384-0B/45e2to395pfnCkbfqwKFFwAa7zXdvd42eAFJa3Vm8KZ/jmHdn93XdWi//7MDS" crossorigin="anonymous"></script>
<!-- Bootstrap JS -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
```

somewhere in your page before including:

```html
<script src="send-btc.min.js"></script>
```

## Usage

Use whatever you want for the button.
I like to use the BitPay donate button images:

![small](https://bitpay.com/img/donate-sm.png) ![medium](https://bitpay.com/img/donate-md.png) ![large](https://bitpay.com/img/donate-lg.png)

The widget uses a Bootstrap [modal](http://getbootstrap.com/javascript/#modals)
to interact with the user.
It can be opened from HTML using Bootstrap's [data attributes](http://getbootstrap.com/javascript/#js-data-attrs)
(or using the equivalent JavaScript):

```html
<a data-toggle="modal" data-target="#send-btc-modal"
 data-address="1GTw1pfrxEV6tNwRQxwocnMRoF9B7LjmJ2" data-label="Donate plz" data-amount="1.0" data-fiat="USD">
    <img src="https://bitpay.com/img/donate-md.png" />
</a>
```

There is a single global modal window `#send-btc-modal` whose attributes
`address`, `label`, `amount`, and `fiat` can change each time it opens,
so having multiple widgets on the same page is as easy as setting up
another link to the same modal with new parameters.
Modals should never be open simultaneously.

`amount` is in bitcoin.
`fiat` is the ISO currency code of the preferred native conversion.
Currently, this must be one of "CNY", "RUB", "EUR", or "USD".

The user is given the option to modify `label`, `amount`, and `fiat`
(which is superfluous to the transaction anyway) and then
open a [bitcoin URI](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki),
scan a QR code in the modal window,
or simply copy-paste the recipient's public address for settling however she pleases.

In the future we could add a minimal bill / receipt printing component for people who like paper.

