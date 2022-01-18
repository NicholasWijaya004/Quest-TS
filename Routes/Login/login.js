const users = require('../../schemas/registry');
const crypto = require('crypto');
module.exports = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      Status: 400,
      Message: 'username and password body required',
    });
  }
  if (!req.body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    return res.status(400).json({
      Status: 400,
      Message: 'Email Invalid',
    });
  }
  req.body.email = crypto.createHash('sha256').update(req.body.email).digest('base64');
  req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64');
  const query = await users.find({ email: req.body.email });
  if (query.length == 0) {
    return res.status(200).json({
      Status: 200,
      Message: 'Email or password is invalid.',
    });
  }
  if (req.body.password != query[0].password) {
    return res.status(400).json({
      Status: 400,
      Message: 'Email or password is invalid.',
    });
  }
  return res.status(200).json({
    Status: 200,
    Message: 'Logged in',
    Data: {
      token: query[0].token,
    },
  });
};
