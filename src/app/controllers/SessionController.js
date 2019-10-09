/* eslint-disable class-methods-use-this */
const { User } = require('../models/');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).send({ message: 'Invalid login information' });
    }

    return res.status(200).send({
      user,
      token: user.generateToken(),
    });
  }
}

module.exports = new SessionController();
