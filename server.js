var express = require('express'),
    ent = require('ent'),
    http = require('http'),
    cradle = require('cradle');

var app = express(),
    couch = new(cradle.Connection)().database('pasteme.it');

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.get('/api', function (req,res) {
  res.send({'here': 'what are you doing'}, 403);
});
app.get('/api/:id', function(req, res) {
  if(req.params.id) {
    couch.get(req.params.id, function (err,doc) {
      if(err){
        response = { 'error': 'Not found' };
        res.send(response);
      }
      response = { 'id': req.params.id, 'body': doc.paste.content };

    });
  }
  else {
    response = { 'error': 'Not found' };
    res.send(response);
  }
});

app.post('/api', function (req, res) {
  if(req.body.paste) {
    re = req.body.paste;
    if(re.content.length() > 0) {
      paste = {
        'content': ent.encode(re.content),
        'source': req.ip,
        'headers': req.headers,
        'date': new Date().UTC()
      };
      couch.save('', { 'paste': paste }, function (err, response) {
        if (err) {
          res.send({'error': 'Failed to save'}, 500);
        }
        res.send({'id': response.id, 'content': paste.content }, 200);
      });
    }
    else {
      res.send({'error': 'Malformed request.'}, 505);
    }
  }
  else {
     res.send({'error': 'Invalid request.'}, 505);
  }
});

http.createServer(app).listen('9999', function(){
  console.log("Express server listening on port 9999");
});
