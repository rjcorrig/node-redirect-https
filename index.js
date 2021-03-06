'use strict';

module.exports = function (opts) {
  var escapeHtml = require('escape-html');

  if (!opts) {
    opts = {};
  }
  if (isNaN(opts.port)) {
    opts.port = 443;
  }
  if (!('body' in opts)) {
    opts.body = "<!-- Hello Mr Developer! We don't serve insecure resources around here."
      + "\n    Please use HTTPS instead. -->";
  }
  opts.body = opts.body.replace(/{{\s+PORT\s+}}/i, opts.port);

  return function (req, res, next) {
    if (req.connection.encrypted
      || 'https' === req.protocol
      || (opts.trustProxy && 'https' === req.headers['x-forwarded-proto'])
    ) {
      next();
      return;
    }

    var url = req.url;
    var host = req.headers.host || '';
		if (!/:\d+/.test(host) && 443 !== opts.port) {
			// we are using standard port 80, but we aren't using standard port 443
			host += ':80';
		}
    var newLocation = 'https://'
      + host.replace(/:\d+/, ':' + opts.port) + url
      ;
    //var encodedLocation = encodeURI(newLocation);
    var escapedLocation = escapeHtml(newLocation);
    var body = opts.body
          .replace(/{{\s*HTML_URL\s*}}/ig, escapeHtml(decodeURIComponent(newLocation)))
          .replace(/{{\s*URL\s*}}/ig, escapedLocation)
          .replace(/{{\s*UNSAFE_URL\s*}}/ig, newLocation)
          ;

    var metaRedirect = ''
      + '<html>\n'
      + '<head>\n'
      //+ '  <style>* { background-color: white; color: white; text-decoration: none; }</style>\n'
      + '  <META http-equiv="refresh" content="0;URL=\'' + escapedLocation + '\'">\n'
      + '</head>\n'
      + '<body>\n' + body + '\n</body>\n'
      + '</html>\n'
      ;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(metaRedirect);
  };
};
