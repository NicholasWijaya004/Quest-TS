const users = require('../../schemas/registry');
const shortid = require('shortid');
const crypto = require('crypto');
module.exports = async (req, res) => {
  //Cek dalam request body, apakah ada username dan password. Apabila salah satunya tidak ada, maka error
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
  if (query.length > 0) {
    return res.status(400).json({
      Status: 400,
      Message: 'email lu uda kepake anjing',
    });
  }
  await users
    .findOneAndUpdate(
      {
        email: req.body.email,
        password: req.body.password,
      },
      {
        email: req.body.email,
        password: req.body.password,
        token: shortid.generate(),
      },
      {
        upsert: true,
      }
    )
    .catch((err) => {
      return res.status(500).json({
        Status: 500,
        Message: 'Failed to write database.',
      });
    });
  return res.json({
    Status: 200,
    Message: 'Finished registry',
  });
};
