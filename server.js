// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 1000;

// Middleware to parse incoming JSON requests
app.use(express.json());



// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing data file:", error);
    return [];
  }
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};


// TODO:  Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// TODO: Handle GET request at the root route
// Handle GET request at the root route (Basically doing the request from the TODO Handle GET Request)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

app.delete("/data/:id", (req, res) => {
  const currentData = readData();
  const newData = currentData.filter((item) => item.id !== req.params.id);
  if (currentData.length === newData.length) {
    return res.status(404).json({ message: "Data not found" });
  }
  writeData(newData);
  res.json({ message: "Data deleted successfully" });
});


// app.get("/data/:id", (req, res) => {
//   const data = readData();
//   const item = data.find((item) => item.id === req.params.id);
//   if (!item) {
//     return res.status(404).json({ message: "Data not found" });
//   }
//   res.json(item);
// });

// Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
  const currentData = readData();
  const index = currentData.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Data not found" });
  }
  const updatedData = { ...currentData[index], ...req.body };
  currentData[index] = updatedData;
  writeData(currentData);
  res.json({ message: "Data updated successfully", data: updatedData });
});

// Handle DELETE request to delete data by ID
app.delete("/data/:id", (req, res) => {
  const currentData = readData();
  const newData = currentData.filter((item) => item.id !== req.params.id);
  if (currentData.length === newData.length) {
    return res.status(404).json({ message: "Data not found" });
  }
  writeData(newData);
  res.json({ message: "Data deleted successfully" });
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
