import User from '../models/User'

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */

export async function getUser (req, res) {
  await User.findOne({ _id: req.params.id })
  .select(`-password`)
  .exec((err, user) => {
    if (err) {
      res.status(500)
      .send(err)
    }
    res.send(user)
  })
}
