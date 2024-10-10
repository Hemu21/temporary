/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";

const UserData = ({ user, onUpdate }) => {
  const data = user;
  console.log(data);
  const limitRepos = useMemo(
    () => [
      "iamrahulmahato/master-web-development",
      "beRajeevKumar/Frontend_Mentor",
      "AlgoGenesis/C",
      "abhisheks008/DL-Simplified",
      "UppuluriKalyani/ML-Nexus",
      "Kushal997-das/Project-Guidance",
      "swaraj-das/Collect-your-GamingTools",
      "Aryan-Chharia/Computer-Vision-Projects",
      "Niketkumardheeryan/ML-CaPsule",
      "Puskar-Roy/create-my-api",
      "rohitinu6/Stock-Price-Prediction",
      "mdazfar2/HelpOps-Hub",
      "UTSAVS26/PyVerse",
      "recodehive/machine-learning-repos",
      "UTSAVS26/PySnippets",
      "yashasvini121/predictive-calc",
    ],
    []
  );
  const [totalPointsSum, setTotalPointsSum] = useState(0);
  const [totalPRsCount, setTotalPRsCount] = useState(0);
  const spamKeywords = useMemo(
    () => [
      ".md",
      "readme",
      "template",
      "document",
      "contributing",
      "workflow",
      "bot",
      "action",
      "docs",
    ],
    []
  );
  useEffect(() => {
    let totalPointsSum = 0;
    let _totalPRsCount = 0;
    data.pullRequests.forEach((repoData) => {
      totalPointsSum += repoData.totalPoints;
      _totalPRsCount += repoData.data.length;
    });
    setTotalPointsSum(totalPointsSum);
    setTotalPRsCount(_totalPRsCount);
  }, []);
  const calculatePoints = (labels) => {
    let points = 0;
    labels.forEach((label1) => {
      const label = label1.toLowerCase();
      if (label === "level1") points += 10;
      if (label === "level2") points += 25;
      if (label === "level3") points += 45;
      if (label === "level 1") points += 10;
      if (label === "level 2") points += 25;
      if (label === "level 3") points += 45;
      if (label === "level-1") points += 10;
      if (label === "level-2") points += 25;
      if (label === "level-3") points += 45;
      if (label === "postman") points += 500;
    });
    return points;
  };
  const isRepoLimited = (repo) => {
    return limitRepos.some((limitedRepo) => {
      if (limitedRepo.endsWith("/*")) {
        return repo.startsWith(limitedRepo.replace("/*", ""));
      }
      return repo === limitedRepo;
    });
  };
  const regex = /level[ -]?([123])/i;
  return (
    <div>
      <div className="w-[95%] m-auto flex p-4 justify-evenly rounded-lg">
        <h1 className="text-black text-xl font-semibold">{data.username}</h1>
        <p className="text-black text-xl font-semibold">
          Last Updated:{" "}
          <span className="text-black text-lg font-normal">
            {data.lastUpdated || "Never"}
          </span>
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-800 w-[130px] h-[40px] rounded-lg text-white font-semibold"
          onClick={onUpdate}
        >
          Update Now
        </button>
      </div>
      <div>
        <h2 className="text-black text-xl font-semibold text-center">
          Pull Requests
        </h2>
        <table className="w-[96%] m-auto mb-10">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Repo</th>
              <th>Title</th>
              <th>Labels</th>
              <th>Merged</th>
              <th>PRs Count</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {data.pullRequests.map((repoData, repoIndex) => {
              const repoIsLimited = isRepoLimited(repoData.repo);
              let seenSpamPR = false;
              let spamPoints = 0;
              repoData.data.forEach((pr) => {
                const isSpam = spamKeywords.some((keyword) =>
                  pr.title.toLowerCase().includes(keyword)
                );
                const prPoints = calculatePoints(pr.labels);

                if (isSpam && seenSpamPR) {
                  spamPoints += prPoints;
                } else if (isSpam && !seenSpamPR) {
                  seenSpamPR = true;
                }
              });

              const totalRepoPoints = repoData.data.reduce(
                (acc, pr) => acc + calculatePoints(pr.labels),
                0
              );
              const pointsDifference = repoIsLimited
                ? totalRepoPoints - 200
                : spamPoints;

              return repoData.data.map((pr, prIndex) => (
                <React.Fragment key={`${repoIndex}-${prIndex}`}>
                  {prIndex === 0 && repoIndex !== 0 && (
                    <tr className="separator">
                      <td colSpan="6"></td>
                    </tr>
                  )}
                  <tr>
                    {prIndex === 0 && (
                      <td rowSpan={repoData.data.length}>{repoIndex + 1}</td>
                    )}
                    {prIndex === 0 && (
                      <td rowSpan={repoData.data.length}>
                        <a
                          className="hover:underline"
                          href={`https://github.com/${pr.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repoData.repo}
                        </a>
                      </td>
                    )}
                    <td>
                      <a
                        className="hover:underline"
                        href={pr.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pr.title}
                      </a>
                    </td>
                    <td>
                      {pr.labels
                        .map((label, index) =>
                          regex.test(label) ? (
                            <span
                              key={index}
                              style={{ color: "red", fontWeight: "bold" }}
                            >
                              {label}
                            </span>
                          ) : (
                            <span key={index}>{label}</span>
                          )
                        )
                        .reduce((prev, curr) => [prev, ", ", curr])}
                    </td>
                    <td>
                      {pr.merged
                        ? new Date(pr.merged).toLocaleString()
                        : "Not Merged"}
                    </td>
                    {prIndex === 0 && (
                      <td rowSpan={repoData.data.length}>
                        {repoData.data.length}
                      </td>
                    )}
                    {prIndex === 0 && (
                      <td rowSpan={repoData.data.length}>
                        {totalRepoPoints}
                        <br />
                        {repoIsLimited && pointsDifference > 0 && (
                          <span className="text-red-500">
                            {" "}
                            (Points exceeded 150. Remove {pointsDifference}{" "}
                            points)
                          </span>
                        )}
                        {spamPoints > 0 && (
                          <span className="text-red-500">
                            {" "}
                            (Found spam PRs. Remove {spamPoints} points)
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              ));
            })}
            <tr className="border-4 border-black">
              <th colSpan="5" className="text-center font-bold text-xl">
                Total PRs and Points done by {data.username}
              </th>
              <th className="text-center font-bold text-xl">{totalPRsCount}</th>
              <th className="text-center font-bold text-xl">
                {totalPointsSum}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NamedUserData = React.memo(UserData);
export default NamedUserData;
