export default (req, res) => {

    const {
        query: { homesId },
      } = req

    res.statusCode = 200
    res.json({ name: homesId })
  }