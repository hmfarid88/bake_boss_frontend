import axios from 'axios';

module.exports = async (req:any, res:any) => {
  const { method, body, query } = req;
  const path = query.path || '';
  const url = `http://165.22.209.96:8080${path}`;

  try {
    const response = await axios({
      method,
      url,
      data: body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error:any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  }
};
