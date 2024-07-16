const express = require("express");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();

const fetchGitHubDataAllPRs = async () => {
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };
  const date = "2024-05-09";
  const labelsQuery =
    "label:level1,level2,level3,gssoc24,GSSoC'24,gssoc,gssoc'24,GSSOC'2024,GSSOC,GSSOC'24";
  try {
    const response = await axios.get(
      `https://api.github.com/search/issues?q=type:pr+is:merged+created:>${date}+${labelsQuery}&per_page=100`,
      { headers }
    );
    const data = response.data;
    return data.total_count;
  } catch (err) {
    throw new Error("Error fetching data from GitHub API");
  }
};

const fetchGitHubData = async (username) => {
  const prs = [];
  let page = 1;
  const date = "2024-05-09";
  const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };

  const calculatePoints = (labels) => {
    const pointsMap = {
      level1: 10,
      level2: 25,
      level3: 45,
    };
    return labels.reduce((total, label) => total + (pointsMap[label] || 0), 0);
  };
  const labelsQuery =
    "label:level1,level2,level3,gssoc24,GSSoC'24,gssoc,gssoc'24,GSSOC'2024,GSSOC,GSSOC'24";

  while (true) {
    const response = await axios.get(
      `https://api.github.com/search/issues?q=author:${username}+type:pr+created:>${date}+is:merged+${labelsQuery}&per_page=100&page=${page}`,
      { headers }
    );
    const data = response.data;
    if (data.items.length === 0) break;

    const prDetailsResponses = await Promise.all(
      data.items.map((pr) => axios.get(pr.url, { headers }))
    );

    prDetailsResponses.forEach((prDetailsResponse, index) => {
      const pr = data.items[index];
      if (prDetailsResponse.data.pull_request.merged_at) {
        const points = calculatePoints(pr.labels.map((label) => label.name));
        prs.push({
          title: pr.title,
          repo: pr.repository_url.split("/").slice(-2).join("/"),
          labels: pr.labels.map((label) => label.name),
          merged: prDetailsResponse.data.pull_request.merged_at,
          link: prDetailsResponse.data.html_url,
          points,
        });
      }
    });

    page++;
  }

  const aggregatedData = prs.reduce((acc, pr) => {
    const repoIndex = acc.findIndex((item) => item.repo === pr.repo);
    if (repoIndex !== -1) {
      acc[repoIndex].data.push(pr);
      acc[repoIndex].totalPoints += pr.points;
    } else {
      acc.push({ repo: pr.repo, data: [pr], totalPoints: pr.points });
    }
    return acc;
  }, []);

  return aggregatedData;
};

// Route to get user data
router.post("/get-data", async (req, res) => {
  const { username } = req.body;
  try {
    let user = await User.findOne({ username });
    const pullRequests = await fetchGitHubData(username);
    if (!user) {
      user = new User({ username, lastUpdated: null });
      await user.save();
    }
    res.json({
      username: user.username,
      lastUpdated: user.lastUpdated,
      pullRequests: pullRequests,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/get-all-prs", async (req, res) => {
  try {
    const pullRequests = await fetchGitHubDataAllPRs();
    res.json({ totalMergedPRs: pullRequests });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Route to update user data
router.put("/update-now", async (req, res) => {
  const { username, date } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      user.lastUpdated = date;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
