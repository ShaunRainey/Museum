import axios from "axios";
import handleError from "./handleError.js";

const vamMuseum = axios.create({ baseURL: "https://api.vam.ac.uk/v2/objects/search" })

const fetchObjectsWithImages = async (numOfResults, query, sortBy) => {
    let queryString = "sculpture";
    let sort;
    let order;
    // These sort functions are supported by the API call directly
    if (sortBy === "Origin date (old - new)") { sort = "date"; order = "asc"; }
    if (sortBy === "Origin date (new - old)") { sort = "date"; order = "desc"; }
    if (sortBy === "Place of Origin (A-Z)") { sort = "place"; order = "asc"; }
    if (sortBy === "Place of Origin (Z-A)") { sort = "place"; order = "desc"; }
    if (sortBy === "Artist (A-Z)") { sort = "artist"; order = "asc"; }
    if (sortBy === "Artist (Z-A)") { sort = "artist"; order = "desc"; }

    try {
        if (query) {//allows multi word queries to be submitted
            queryString = query.split(" ").join("&");
        }

        const outputObjects = [];
        let pageIndex = 1;
        let totalFetched = 0;

        const params = {
            q: queryString,
            images_exist: 1,
            page: pageIndex,
            page_size: 100,
        };

        if (sortBy !== "No Sort" && sort && order) {  // If there is a valid sort method, assign values to order_by and order_sort
        params.order_by = sort;
        params.order_sort = order;
        }


        while (totalFetched < numOfResults) {
            if (outputObjects.length >= numOfResults) break;

            const response = await vamMuseum.get("", { params });
            let results = response.data.records;

            results.forEach((object) => {
                if (object["_primaryTitle"] && object["_primaryMaker"]["name"] !== "Unknown") { //Checks to see that objects have desired properties for rendering
                    outputObjects.push(object);
                    totalFetched++;
                }
            });

            if (results.length < 100) break;

            pageIndex++;
            params.page = pageIndex;
        }

        return outputObjects.length ? outputObjects.slice(0, numOfResults) : []; // Ensure an array is returned to avoid unpredictable behaviour

    } catch (error) {
        handleError(error);
        return []; // Return empty array on failure
    }
};



const fetchIndividualObject = async (ID)=> {
    try{
        const object = await axios.get(`https://api.vam.ac.uk/v2/museumobject/${ID}`)
        return object.data.record
    } catch (error) {
        handleError(error)
    }
}

const fetchRandomObjects = async (num = 200) => {
    
    try {
        const imagedObjects = await fetchObjectsWithImages(num);
        //If imagedObjects is undefined or null, calling .length on it would cause an error.
        if (!imagedObjects || imagedObjects.length === 0) { 
            return [];
        }
    
        // Fisher-Yates Shuffle
        const shuffleArray = (arr) => {
            for (let i = arr.length - 1; i > 0; i--) { //Starts from the back of the array and counts down to index 0
                const j = Math.floor(Math.random() * (i + 1)); //Generates a random index j
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
            }
            return arr;
        };
    
        const shuffledObjects = shuffleArray(imagedObjects);
    
        return shuffledObjects.slice(0, 9);
    } catch (error){
        handleError(error)
    }
};



export default {fetchObjectsWithImages, fetchRandomObjects, fetchIndividualObject}

