var mdns = require('mdns'),
browser = mdns.createBrowser(mdns.tcp('ipp'));

browser.on('serviceUp', function (rec) {
    console.log(rec.name, 'http://'+rec.host+':'+rec.port+'/'+rec.txtRecord.rp);
});

browser.on('serviceChanged', function (rec) {
    console.log(rec.name, 'http://'+rec.host+':'+rec.port+'/'+rec.txtRecord.rp);
});

browser.on('error', function (err) { console.log(err);});

browser.start();
console.log(browser);

