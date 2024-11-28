import JSON5 from 'https://cdn.skypack.dev/json5';
import serialize from 'https://esm.sh/serialize-javascript';

// Main function to try parsing with different methods
export function parseJsonString(jsonString) {
  // First try parsing with JSON.parse
  if (isValidJson(jsonString)) {
    return JSON.parse(jsonString);
  }

  // Next, try parsing with JSON5
  let result = attemptParse(jsonString, JSON5.parse);
  if (result !== undefined) return result;

  // Finally, if it looks like a JavaScript object or array, try deserialize
   
  if(isValidJsonObject(jsonString)){
   result = attemptParse(jsonString, serialize);
  }
  
  
  if (result !== undefined) return result;
  

  // If all parsing methods fail, throw an error
  throw new Error("Failed to parse JSON string with available methods.");
}

// Helper function to attempt parsing with a given parser
function attemptParse(jsonString, parser) {
  try {
    return parser(jsonString);  // Try to parse with the provided parser
  } catch (e) {
    // In case of an error, return undefined
    return undefined;
  }
}

// Function to check if JSON is valid (using JSON.parse)
function isValidJson(jsonString) {
  return attemptParse(jsonString, JSON.parse) !== undefined;
}

// Function to check if the parsed object is a valid JSON object or array
function isValidJsonObject(parsed) {
  return (typeof parsed === 'object' && parsed !== null) || Array.isArray(parsed);
}
