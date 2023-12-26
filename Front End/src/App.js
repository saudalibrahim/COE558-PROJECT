import React, { useState, useEffect } from "react";
import "./App.css";

const customHeaders = {
  "Content-Type": "application/json",
};

const App = () => {
  const [userName, setUserName] = useState("Enter Your Name..."); // Default username
  const [inputValue, setInputValue] = useState(""); // Input field value
  const [outputValue, setOutputValue] = useState(""); // Output field value
  const [conversionType, setConversionType] = useState("milesToKm"); // Default conversion type
  const [conversionLogs, setConversionLogs] = useState([]); // Array to store conversion logs
  const [databaseContent, setDatabaseContent] = useState(""); // Database content from the Cloud Function

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConversionTypeChange = (e) => {
    setConversionType(e.target.value);
  };

  const handleConvert = () => {
    // Prepare the message object
    const message = {
      userName: userName,
      input: inputValue,
    };

    // Define the API endpoint based on the selected conversion type
    let endpoint = "";
    switch (conversionType) {
      case "milesToKm":
        endpoint = "https://v2apigatewaylast-crb61dv6.uc.gateway.dev/milesToKm";
        break;
      case "fahrenheitToC":
        endpoint = "https://v2apigatewaylast-crb61dv6.uc.gateway.dev/fahrenheitToC";
        break;
      case "poundsToKg":
        endpoint = "https://v2apigatewaylast-crb61dv6.uc.gateway.dev/poundsToKg";
        break;
      default:
        break;
    }

    // Make the API request
    fetch(endpoint, {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((json_obj) => {
        setOutputValue(json_obj.result); // Update the output value
      })
      .catch((err) => console.error(err));
  };

  const handleGetDatabaseContent = () => {
    // Fetch database content from the Cloud Function
    fetch("https://v2apigatewaylast-crb61dv6.uc.gateway.dev/dbContent")
      .then((res) => res.json())
      .then((data) => {
        // Set the fetched content in the state
        setDatabaseContent(JSON.stringify(data, null, 2));
        console.log(databaseContent);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="app-container">
      <div className="conversion-container">
        <h1 className="title">COE-558</h1>
        <h2 className="subtitle">Imperial To Metric Converter</h2>
        <div className="input-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            className="input-box"
            value={userName}
            onChange={handleUserNameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="inputValue">Input Value:</label>
          <input
            type="text"
            id="inputValue"
            className="input-field"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="conversionType">Conversion Type:</label>
          <select
            id="conversionType"
            className="select-field"
            value={conversionType}
            onChange={handleConversionTypeChange}
          >
            <option value="milesToKm">Miles to Kilometers</option>
            <option value="fahrenheitToC">Fahrenheit to Celsius</option>
            <option value="poundsToKg">Pounds to Kilograms</option>
          </select>
        </div>
        <div className="button-group">
          <button className="convert-button" onClick={handleConvert}>
            Convert
          </button>
          <button
            className="get-content-button"
            onClick={handleGetDatabaseContent}
          >
            Get Database Content
          </button>
        </div>
        <div className="output-group">
          <label htmlFor="outputValue">Output Value:</label>
          <input
            type="text"
            id="outputValue"
            className="output-field"
            value={outputValue}
            readOnly
          />
        </div>
      </div>
      <div className="log-container">
        <h2 className="log-title">Database Content</h2>
        <pre className="database-content">{databaseContent}</pre>
      </div>
    </div>
  );
};

export default App;
