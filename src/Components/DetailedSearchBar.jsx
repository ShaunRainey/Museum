import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import metRequests from "../Utilities/metMuseumApi";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import PageBar from "./PageBar";
import Loading from "./Loading";
import handleError from "../Utilities/handleError";
import vamRequests from "../Utilities/vamMuseum";
import FilterMuseum from "./FilterMuseum";

function DetailedSearch({artworks, setArtworks, currentPage, setCurrentPage,itemsPerPage, loading, setLoading,museum, setMuseum, handleMuseumChange, searchInitiated, setSearchInitiated}) {

  const [totalResults, setTotalResults] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Form choices
  const [department, setDepartment] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxPages, setMaxPages] = useState(4);
  const [resultsPerPage, setResultsPerPage] = useState(itemsPerPage);
  const [sortBy, setSortBy] = useState("No Sort");

  let searchString = `/search?departmentId=${department || "*"}&q=${keyword || "*"}`;

  // Add keyword to the above searchString
  const handleKeywordChange = (event) => {
    event.preventDefault();
    setKeyword(event.target.value)
  }

  // Add department to the above searchstring
  const handleDepartmentChange = (event) => {
    const selectedDepartmentName = event.target.value;
    const selectedDepartment = departments.find((department) => Object.keys(department)[0] === selectedDepartmentName);

    const departmentId = Object.values(selectedDepartment)[0]
    setDepartment(departmentId);
  };

  // Pass a value to the function that makes the API call
  const handleResultsPerPageChange = (event) => {
    let selectedValue = event.target.value;
    if (selectedValue.length > 2) { selectedValue = "9" }
    setResultsPerPage(Number(selectedValue));
  };
  itemsPerPage = resultsPerPage

  // Pass a value to the function that makes the API call
  const handleMaximumPages = (event) => {
    let selectedValue = event.target.value;
    if (selectedValue.length > 2) { selectedValue = "20" }
    setMaxPages(Number(selectedValue));
  };

  // Determines how the information that returns from the API is arranged
  const handleSortBy = (event) => {
    const selectedValue = event.target.value;
    setSortBy(selectedValue)
  }

 useEffect(() => {
  setSearchInitiated(false);  // Reset search when the museum changes
  setTotalResults([]);        // Clear the previous search results
  setArtworks([]);            // Clear the artworks
  setCurrentPage(1);
  setKeyword("")          // Reset the page to 1
}, [museum]);

  useEffect(() => {
    if (museum === "The Met Museum") {
      const fetchDepartments = async () => {
        const departmentArray = [];
        const metDepartments = await metRequests.getDepartments();
        metDepartments.forEach((department) => {
          let id = department["departmentId"]
          let name = department["displayName"]
          departmentArray.push({ [name]: id })
        })
        setDepartments(departmentArray)
      }
      fetchDepartments()
    }
  }, [museum])

  useEffect(() => {
    if (museum === "The Met Museum") {
      const fetchAllArtworks = async () => {
        if (!searchInitiated) return; // Do nothing if the search hasn't been initiated
        setLoading(true);
        setArtworks([])

        if (totalResults.length === 0) {
          const validObjects = await metRequests.getSearchElements(searchString, resultsPerPage, maxPages);

          if (sortBy === "Origin date (old - new)") {
            validObjects.sort((a, b) => (a["objectBeginDate"] || 0) - (b["objectBeginDate"] || 0))
          }
          else if (sortBy === "Origin date (new - old)") {
            validObjects.sort((a, b) => (b["objectBeginDate"] || 0) - (a["objectBeginDate"] || 0))
          }
          else if (sortBy === "Title (A-Z)") {
            validObjects.sort((a, b) => (a["title"] || "").toLowerCase().localeCompare((b["title"] || "").toLowerCase()))
          }
          else if (sortBy === "Title (Z-A)") {
            validObjects.sort((a, b) => (b["title"] || "").toLowerCase().localeCompare((a["title"] || "").toLowerCase()))
          }
          else if (sortBy === "Artist (A-Z)") {
            validObjects.sort((a, b) => (a["artistDisplayName"] || "").toLowerCase().localeCompare((b["artistDisplayName"] || "").toLowerCase()))
          }
          else if (sortBy === "Artist (Z-A)") {
            validObjects.sort((a, b) => (b["artistDisplayName"] || "").toLowerCase().localeCompare((a["artistDisplayName"] || "").toLowerCase()))
          }
          else if (sortBy === "Department (A-Z)") {
            validObjects.sort((a, b) => (a["department"] || "").toLowerCase().localeCompare((b["department"] || "").toLowerCase()))
          }
          else if (sortBy === "Department (Z-A)") {
            validObjects.sort((a, b) => (b["department"] || "").toLowerCase().localeCompare((a["department"] || "").toLowerCase()))
          }
          else if (sortBy === "Acquisition (Newest)") {
            validObjects.sort((a, b) => (a["accessionYear"] || 0) - (b["accessionYear"] || 0))
          }
          else if (sortBy === "Acquisition (Oldest)") {
            validObjects.sort((a, b) => (b["accessionYear"] || 0) - (a["accessionYear"] || 0))
          }

          setTotalResults(validObjects);
          setArtworks(validObjects.slice(0, itemsPerPage));
        } else {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          setArtworks(totalResults.slice(startIndex, endIndex));
        }

        setLoading(false);
      };

      fetchAllArtworks();
    }
  }, [currentPage, totalResults, searchInitiated, museum]);

  useEffect(() => {
  // This will trigger when the museum, search, page, results per page, etc., change
  if (museum === "Victoria and Albert Museum") {
    console.log("🚀 useEffect triggered for VAM museum");

    // Calling fetchVamArtworks inside the effect
    const fetchVamArtworks = async () => {
      console.log("🔍 fetchVamArtworks() called");

      setLoading(true);
      setArtworks([]); // Clear previous results

      if (!searchInitiated) {
        console.log("⏳ Skipping fetch - search not initiated");
        return;
      }

      // Fetch data only if no results are saved or if resultsPerPage has changed
      if (totalResults.length === 0 || resultsPerPage !== itemsPerPage) {
        console.log("🛠 Fetching new objects from VAM API...");

        // Fetch objects from the VAM API
        const validObjects = await vamRequests.fetchObjectsWithImages(1000, keyword, sortBy);
        
        console.log("📦 API Response:", validObjects.length, "objects");

        const actualResults = validObjects.slice(0, maxPages * resultsPerPage);
        setTotalResults(actualResults); // Set the total results
        console.log("✅ totalResults updated:", actualResults.length);
      }

      // Slice the results for pagination
      const startIndex = (currentPage - 1) * resultsPerPage;
      let endIndex = startIndex + resultsPerPage;

      // Fix the case where endIndex is out of bounds
      if (endIndex > totalResults.length) {
        endIndex = totalResults.length;
      }

      const paginatedResults = totalResults.slice(startIndex, endIndex);
      console.log("🎨 Rendering:", paginatedResults.length, "artworks");

      if (paginatedResults.length === 0 && currentPage > 1) {
        console.log("⚠️ No artworks found, resetting to page 1");
        setCurrentPage(1); // If no artworks found, reset to page 1
      } else {
        setArtworks(paginatedResults); // Display artworks for current page
      }

      setLoading(false);
    };

    // Trigger the API call
    fetchVamArtworks();
  }
}, [currentPage, totalResults, searchInitiated, museum, maxPages, resultsPerPage]);



  const totalItems = totalResults.length;
  const totalPages = Math.ceil(totalItems / resultsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0)
  };

  const handleSearchInitiate = () => {
    setSearchInitiated(true); // Trigger the rendering of artworks
  };

  if (!searchInitiated && museum === "The Met Museum") {
    return (
      <Container className="text-center mt-5">
        <Row>
          <Col xs={12} md={12}>
            <div className="p-3 bg-light">
              <h5>Search Box:</h5>

              <Form>
                <FilterMuseum museum={museum} handleMuseumChange={handleMuseumChange} />

                <Form.Group className="mb-3">
                  <Form.Label>Filter by Department</Form.Label>
                  <Form.Control as="select" onChange={handleDepartmentChange}>
                    <option>All</option>
                    {departments.map((department) => {
                      return <option key={Object.keys(department)}>{Object.keys(department)}</option>
                    })}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Keyword</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Please enter a single keyword"
                    onChange={handleKeywordChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Maximum Pages</Form.Label>
                  <p className="smallprint">(A higher number will increase API response time. Recommended to stay below 20)</p>
                  <Form.Control as="select" onChange={handleMaximumPages}>
                    <option>Default (4)</option>
                    <option>2</option>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Results Per Page</Form.Label>
                  <p className="smallprint">(A higher number will increase API response time. Recommended to stay below 20)</p>
                  <Form.Control as="select" onChange={handleResultsPerPageChange}>
                    <option>Default (9)</option>
                    <option>3</option>
                    <option>6</option>
                    <option>9</option>
                    <option>12</option>
                    <option>15</option>
                    <option>30</option>
                    <option>60</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Control as="select" onChange={handleSortBy}>
                    <option>No Sort</option>
                    <option>Origin date (old - new)</option>
                    <option>Origin date (new - old)</option>
                    <option>Title (A-Z)</option>
                    <option>Title (Z-A)</option>
                    <option>Artist (A-Z)</option>
                    <option>Artist (Z-A)</option>
                    <option>Department (A-Z)</option>
                    <option>Department (Z-A)</option>
                    <option>Recently Added</option>
                    <option>Acquisition (Newest)</option>
                    <option>Acquisition (Oldest)</option>
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" size="lg" onClick={handleSearchInitiate}>
                  Search
                </Button>

              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!searchInitiated && museum === "Victoria and Albert Museum") {
    return (
      <Container className="text-center mt-5">
        <Row>
          <Col xs={12} md={12}>
            <div className="p-3 bg-light">
              <h5>Search Box:</h5>

              <Form>

                <FilterMuseum museum={museum} handleMuseumChange={handleMuseumChange} />

                <Form.Group className="mb-3">
                  <Form.Label>Keyword</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Please enter a single keyword"
                    onChange={handleKeywordChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Maximum Pages</Form.Label>
                  <p className="smallprint">(A higher number will increase API response time. Recommended to stay below 20)</p>
                  <Form.Control as="select" onChange={handleMaximumPages}>
                    <option>Default (4)</option>
                    <option>2</option>
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Results Per Page</Form.Label>
                  <p className="smallprint">(A higher number will increase API response time. Recommended to stay below 20)</p>
                  <Form.Control as="select" onChange={handleResultsPerPageChange}>
                    <option>Default (9)</option>
                    <option>3</option>
                    <option>6</option>
                    <option>9</option>
                    <option>12</option>
                    <option>15</option>
                    <option>30</option>
                    <option>60</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Control as="select" onChange={handleSortBy}>
                    <option>No Sort</option>
                    <option>Origin date (old - new)</option>
                    <option>Origin date (new - old)</option>
                    <option>Place of Origin (A-Z)</option>
                    <option>Place of Origin (Z-A)</option>
                    <option>Artist (A-Z)</option>
                    <option>Artist (Z-A)</option>
                  </Form.Control>
                </Form.Group>

                <Button variant="primary" size="lg" onClick={handleSearchInitiate}>
                  Search
                </Button>

              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Form>
          <FilterMuseum museum={museum} handleMuseumChange={handleMuseumChange} />
        </Form>
      </Row>

      <Row>
        {artworks.map((artwork) => (
          <Col md={4} key={museum === "The Met Museum" ? artwork.objectID : artwork.systemNumber} className="mb-4">
            <Link to={museum === "The Met Museum" ? `/met-artwork/${artwork.objectID}` : `/vam-artwork/${artwork.systemNumber}`}>
              <Card className="custom-card">
                <Card.Img
                  variant="top"
                  src={museum === "The Met Museum" ? artwork.primaryImageSmall : `https://framemark.vam.ac.uk/collections/${artwork._primaryImageId}/full/600,400/0/default.jpg`}
                  alt="Artwork"
                  className="Card-img"
                />
                <Card.Body className="custom-card-body">
                  <Card.Title className="mb-2">
                    {museum === "The Met Museum" ? artwork.title : artwork._primaryTitle || "Untitled"}
                  </Card.Title>
                  <Card.Text className="custom-card-text">
                    {museum === "The Met Museum" ? artwork.artistDisplayName : artwork._primaryMaker?.name || "Unknown Artist"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Row className="mt-3">
        <Col>
          <PageBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default DetailedSearch;
