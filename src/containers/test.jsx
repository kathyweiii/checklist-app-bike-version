const optionCells = {
  A: ["是", "否", "是", "否", "否", "否"],
  B: ["是", "無需", "是"],
  C: ["無需", "無需", "無需"],
  D: ["是", "是", "是", "是", "是", "是"],
};

const roadNames = ["路名1", "路名2", "路名3"];

// Initialize an object to hold the grouped options by road names
const groupedByRoadNames = {};

// Loop through each road name and assign options accordingly
roadNames.forEach((roadName, index) => {
  groupedByRoadNames[roadName] = []; // Initialize the array for each road name

  // Collect options for each road name from the optionCells
  Object.keys(optionCells).forEach((sheetKey) => {
    const options = optionCells[sheetKey];
    const roadIndex = index; // Determine the index for the current road name

    // Calculate the correct option index based on the road name
    if (roadIndex < options.length) {
      groupedByRoadNames[roadName].push(options[roadIndex]);
    }
  });
});

// Output the result
console.log(groupedByRoadNames);
