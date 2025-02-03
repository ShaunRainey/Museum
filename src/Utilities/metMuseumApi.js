import axios from "axios";
import handleError from "./handleError.js";

// https://collectionapi.metmuseum.org/public/collection/v1/objects

// 54 is a non existent ID

// 25422 is an interesting example, 35 is a highlight

const metMuseum = axios.create({
  baseURL: "https://collectionapi.metmuseum.org/public/collection/v1",
});

const getValidObjectNumbers = (searchWords) => {
  // returns an array of numbers
  let searchString = "/search?q=isHighlight";

  if (searchWords) {
    const searchArray = searchWords.split(" ");
    searchString = "/search?q=";
    searchArray.forEach((string) => {
      searchString += string + "+";
    });
    searchString = searchString.slice(0, searchString.length - 1);
  }

  return metMuseum
    .get(searchString)
    .then((response) => {
      // console.log("Valid object numbers: ",response.data.objectIDs)
      return response.data.objectIDs;
    })
    .catch(handleError);
};

const getTotalObjectNumbers = () => {
  // returns a single number
  return metMuseum
    .get("/objects")
    .then((response) => {
      return response.data.total;
    })
    .catch(handleError);
};

const getObjectByID = async (objectID) => {
  try {
    // Await the promise returned by the API call
    const response = await metMuseum.get(`/objects/${objectID}`);

    // Check if data and objectID exist in the response
    if (response.data && response.data.objectID) {
      return response.data;
    }

    // If objectID doesn't exist in response data, return null or handle it as needed
    return null;
  } catch (error) {
    // Catch any errors that occur during the async request
    console.error(`Error fetching object with ID ${objectID}:`, error);
    handleError(error); // You can call your custom error handler here if needed
    return null; // Return null or handle error as needed
  }
};

const getDepartments = () => {
  // returns an array of objects
  return metMuseum
    .get("/departments")
    .then((response) => {
      return response.data.departments;
    })
    .catch(handleError);
};

const validIDCache = []; // Cache to store all valid object IDs

const getAllImagedArtworks = async (
  searchWords,
  page = 1,
  itemsPerPage = 9
) => {
  let searchString = "/search?q=isHighlight";

  // Apply search query if available
  if (searchWords) {
    const searchArray = searchWords.split(" ");
    searchString = "/search?q=";
    searchArray.forEach((string) => {
      searchString += string + "+";
    });
    searchString = searchString.slice(0, searchString.length - 1);
  }

  try {
    const response = await metMuseum.get(searchString);
    const objectIDs = response.data.objectIDs;

    // Ensure the cache contains enough valid IDs to render the requested page
    const requiredValidIDs = page * itemsPerPage;

    let currentIndex = validIDCache.length; // Start checking where the cache ends
    while (
      validIDCache.length < requiredValidIDs &&
      currentIndex < objectIDs.length
    ) {
      const id = objectIDs[currentIndex];
      try {
        const artworkResponse = await metMuseum.get(`/objects/${id}`);
        if (artworkResponse.data.primaryImageSmall) {
          validIDCache.push(artworkResponse.data); // Add valid artwork object to the cache
        }
      } catch (error) {
        console.log(`Error fetching artwork with ID ${id}:`, error);
        // Skip invalid IDs
      }
      currentIndex++;
    }

    // Slice the cache to return only the items for the requested page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedArtworks = validIDCache.slice(startIndex, endIndex);

    return paginatedArtworks;
  } catch (error) {
    console.log("Error fetching artwork list:", error);
    return [];
  }
};

const getRandomImagedArtworks = async (count = 9) => {
  const validIDs = await getValidObjectNumbers();
  const randomIDs = [];

  while (randomIDs.length < count) {
    const randomIndex = Math.floor(Math.random() * validIDs.length);
    const randomID = validIDs[randomIndex];

    try {
      const artwork = await getObjectByID(randomID);

      if (artwork && artwork.primaryImageSmall) {
        randomIDs.push(randomID);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(`Artwork with ID ${randomID} not found (404).`);
      } else {
        console.error(`Error fetching artwork with ID ${randomID}:`, error);
      }
    }
  }
  return randomIDs;
};

const getSearchElements = async (
  searchString = "/search?q=isHighlight",
  itemsPerPage = 9,
  numberOfPages = 4
) => {
  const response = await metMuseum.get(searchString);
  const objectIDs = response.data.objectIDs;

  let newArray = [];

  let index = 0;
  while (
    index < objectIDs.length &&
    newArray.length < numberOfPages * itemsPerPage
  ) {
    const id = objectIDs[index];
    try {
      const artworkResponse = await metMuseum.get(`/objects/${id}`);
      if (artworkResponse.data.primaryImageSmall) {
        newArray.push(artworkResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
    index++;
  }

  return newArray;
};

export default {
  getValidObjectNumbers,
  getTotalObjectNumbers,
  getObjectByID,
  getRandomImagedArtworks,
  getDepartments,
  getAllImagedArtworks,
  getSearchElements,
};
