const restify = require('restify');

module.exports = (posts) => {


  const server = restify.createServer();

  server.use(restify.plugins.bodyParser());
  server.use(restify.plugins.queryParser());


  server.get('/people',  (req, res, next) => {
    posts.index().then((result) =>
        res.send(200, result)
    )
  });

  server.post('/people', (req, res, next) =>
    posts.create(req.body.post).then((result)=>
        res.send(201, result)
    )
  );

  server.get('/people/:id', (req, res, next) =>
    posts.show(req.params.id).then((result)=>
        res.send(200, result)
    )
  );

  server.put('/people/:id', (req,res,next) =>
    posts.update(req.params.id, req.body.doc).then((result)=>
      res.send(200, result)
    )
  );

  server.del('/people/:id', (req, res, next) =>
    posts.destroy(req.param.id).then((result) =>
    res.send(200, result)
    )
  )


  return server;
};