# redirect-https

Redirect from HTTP to HTTPS using meta redirects

```bash
npm install --save redirect-https
```

```javascript
var http = require('http');
var server = http.createServer();

server.on('request', require('redirect-https')({
  port: 443
, body: '<!-- Hello! Please use HTTPS instead -->'
}));
```

# Why meta redirects?

When something is broken (i.e. insecure), you don't want it to kinda work, you want developers to notice.

Using a meta redirect will break requests from `curl` and api calls from a programming language, but still have all the SEO and speed benefits of a normal `301`.

```html
<html><head>
<meta http-equiv="refresh" content="0;URL='https://example.com/foo'" />
</head><body>
<!-- Hello Mr. Developer! Please use https instead. Thank you! -->
</html>
```

# Other strategies

If your application is properly separated between static assets and api, then it would probably be more beneficial to return a 200 OK with an error message inside
