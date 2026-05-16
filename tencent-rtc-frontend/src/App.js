import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/usersig")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        console.log("backend response:", result);
      })
      .catch((err) => {
        console.error("error fetching backend:", err);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 React + Node Connection Test</h1>

      {!data && <p>Loading...</p>}

      {data && (
        <div>
          <p><b>User ID:</b> {data.userId}</p>
          <p><b>UserSig:</b> {data.userSig}</p>
        </div>
      )}
    </div>
  );
}

export default App;