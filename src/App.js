import classes from "./App.module.css";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firestoreConfig";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function App() {
  const [leaderboard, setLeaderboard] = useState([
    {
      logo: "https://drive.google.com/uc?id=1LcddHYndHdc2pOc8e5AudjK8DkyuM1hT",
      branch: "CSE",
      points: 0,
    },
  ]);

  const getLeaderboard = async () => {
    console.log("getLeaderboard");
    const ldrbrd = [];
    const leaderboardRef = collection(db, "leaderboard");
    const leaderboardSnap = await getDocs(leaderboardRef);
    leaderboardSnap.forEach((doc) => {
      ldrbrd.push(doc.data());
    });
    console.log("ldrbrd", ldrbrd);
    setLeaderboard(ldrbrd);
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  const columns = [
    {
      field: "rank",
      headerName: "Rank",
      width: 100,
    },
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      renderCell: (item) => {
        console.log(item);
        return (
          <img
            src={item.row.logo}
            alt={item.row.branch}
            style={{ width: 50 }}
          />
        );
      },
    },
    {
      field: "branch",
      headerName: "Branch",
      width: 150,
    },
    {
      field: "score",
      headerName: "Score",
      width: 150,
    },
  ];

  const rows = leaderboard.map((item, index) => {
    return {
      id: index,
      rank: index + 1,
      logo: item.logo,
      branch: item.branch,
      score: item.points,
    };
  });

  rows.sort((a, b) => b.score - a.score);

  rows.forEach((item, index) => {
    item.rank = index + 1;
  });

  console.log(rows);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={classes.mainBody}
    >
      <h1>GC 2023 Leaderboard</h1>
      <div
        style={{
          width: 500,
          height: 550,
        }}
      >
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </div>
  );
}

export default App;
