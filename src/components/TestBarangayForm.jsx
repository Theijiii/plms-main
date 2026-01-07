import React, { useState } from "react";

export default function TestBarangayForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_initial: "",
    last_name: "",
    contact_number: "",
    birth_date: "",
    gender: "",
    civil_status: "",
    nationality: "",
    house_no: "",
    street: "",
    barangay: "",
    city_municipality: "",
    province: "",
    purpose: "",
    id_type: "",
    id_number: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [response, setResponse] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append fields
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    // Append attachments
    attachments.forEach((file) => {
      data.append("attachments[]", file);
    });

    try {
fetch("http://127.0.0.1:8000/api/test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

      const text = await res.text();

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("Failed to parse JSON:", text);
        json = { success: false, message: "Server returned non-JSON response" };
      }

      setResponse(json);
    } catch (err) {
      console.error("Network error:", err);
      setResponse({ success: false, message: "Network error" });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Barangay Clearance Form</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key === "birth_date" ? "date" : "text"}
            name={key}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={formData[key]}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        ))}

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-1"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>

      {response && (
        <div className="mt-4 p-2 border">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
