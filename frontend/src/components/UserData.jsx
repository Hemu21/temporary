import React from "react";

const UserData = ({ user, onUpdate }) => {
  const data = user;
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
        <table className="w-[96%] m-auto">
          <thead> 
            <tr>
              <th>S.No</th>
              <th>Repo</th>
              <th>Title</th>
              <th>Labels</th>
              <th>Merged</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {data.pullRequests.map((repoData, repoIndex) => (
              repoData.data.map((pr, prIndex) => (
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
                    <td>{pr.labels.join(", ")}</td>
                    <td>
                      {pr.merged
                        ? new Date(pr.merged).toLocaleString()
                        : "Not Merged"}
                    </td>
                    {prIndex === 0 && (
                      <td rowSpan={repoData.data.length}>{repoData.totalPoints}</td>
                    )}
                  </tr>
                </React.Fragment>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserData;
