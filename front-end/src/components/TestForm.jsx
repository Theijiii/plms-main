import React, { useState } from "react";

export default function TestForm() {
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        
const response = await fetch("http://127.0.0.1:8000/test");

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ success: false, message: "Network error" });
    }
  };

  return (
    <div>
      <h2>Laravel Test</h2>
      <button onClick={handleSubmit}>Test API</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
