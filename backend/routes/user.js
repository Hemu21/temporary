const express = require('express');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

const fetchGitHubData = async (username) => {
    const prs = [];
    let page = 1;
    const date = '2024-05-09';
    const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };

    while (true) {
      const response = await axios.get(`https://api.github.com/search/issues?q=author:${username}+type:pr+created:>${date}&per_page=100&page=${page}`, { headers });
      const data = response.data;
      if (data.items.length === 0) break;
  
      for (const pr of data.items) {
        const prDetails = await axios.get(pr.url, { headers });
        prs.push({
          title: pr.title,
          repo: pr.repository_url.split('/').slice(-2).join('/'),
          labels: pr.labels.map(label => label.name),
          merged: prDetails.data.closed_at,
          link: prDetails.data.html_url,
          repo_url: prDetails.data.repository_url,
        });
      }
      page++;
    }
    return prs;
  };

// Route to get user data
router.post('/get-data', async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.findOne({ username });
    const pullRequests = await fetchGitHubData(username);
    if (!user) {
      user = new User({ username, lastUpdated: null });
      await user.save();
    }
    res.json({ username: user.username, lastUpdated: user.lastUpdated, pullRequests: pullRequests });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to update user data
router.put('/update-now', async (req, res) => {
  const { username, date } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      user.lastUpdated = date;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
