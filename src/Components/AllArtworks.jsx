import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useLocation, Link } from "react-router"; // Updated import for 'react-router-dom'
import Loading from "./Loading";
import metRequests from "../Utilities/metMuseumApi";
import vamRequests from "../Utilities/vamMuseum";
import PageBar from "./PageBar";
import FilterMuseum from "./FilterMuseum";
import handleError from "../Utilities/handleError";

function AllArtworks({
  artworks,
  setArtworks,
  validObjectIDs,
  setValidObjectIDs,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  loading,
  setLoading,
  museum,
  setMuseum,
  handleMuseumChange,
}) {
  const location = useLocation();
  const queryWords = new URLSearchParams(location.search).get("query") || ""; // Get query param

  // Reset to the first page whenever the museum changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever the museum changes
  }, [museum, setCurrentPage]);

  // Fetch artworks based on selected museum
  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      setArtworks([]); // Reset artworks
      try {
        if (museum === "The Met Museum") {
          // Get all valid object IDs for the search query
          const validIDs = await metRequests.getValidObjectNumbers(queryWords);
          setValidObjectIDs(validIDs);

          // Get artworks for the current page
          const imagedArtworks = await metRequests.getAllImagedArtworks(
            queryWords,
            currentPage,
            itemsPerPage
          );
          setArtworks(imagedArtworks);
          setLoading(false);
        } else if (museum === "Victoria and Albert Museum") {
          // Fetch artworks from V&A (1000 artworks)
          const allArtworks = await vamRequests.fetchObjectsWithImages(1000); // Fetch 1000 artworks (this can be dynamic if needed)

          // Calculate the start and end index for pagination
          const startIdx = (currentPage - 1) * itemsPerPage; // Index to start the slice
          const endIdx = startIdx + itemsPerPage; // Index to end the slice

          // Paginate the results by slicing the array to get the current page data
          const paginatedArtworks = allArtworks.slice(startIdx, endIdx);

          // Set the paginated artworks for the current page
          setArtworks(paginatedArtworks);
          setLoading(false);
        }
      } catch (error) {
        handleError(error);
      }
    };

    fetchArtworks();
  }, [queryWords, currentPage, museum, itemsPerPage]); // Re-run this effect when queryWords, currentPage, or museum changes

  // Calculate the total pages based on all valid object IDs
  const totalItems = validObjectIDs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

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
          <FilterMuseum
            museum={museum}
            handleMuseumChange={handleMuseumChange}
          />
        </Form>
      </Row>

      <Row>
        {artworks.map((artwork) => (
          <Col
            md={4}
            key={
              museum === "The Met Museum"
                ? artwork.objectID
                : artwork.systemNumber
            }
            className="mb-4"
          >
            <Link
              to={
                museum === "The Met Museum"
                  ? `/met-artwork/${artwork.objectID}`
                  : `/vam-artwork/${artwork.systemNumber}`
              }
            >
              <Card className="custom-card">
                <Card.Img
                  variant="top"
                  src={
                    museum === "The Met Museum"
                      ? artwork.primaryImageSmall
                      : `https://framemark.vam.ac.uk/collections/${artwork._primaryImageId}/full/600,400/0/default.jpg`
                  }
                  alt="Artwork"
                  className="Card-img"
                />
                <Card.Body className="custom-card-body">
                  <Card.Title className="mb-2">
                    {museum === "The Met Museum"
                      ? artwork.title
                      : artwork._primaryTitle || "Untitled"}
                  </Card.Title>
                  <Card.Text className="custom-card-text">
                    {museum === "The Met Museum"
                      ? artwork.artistDisplayName
                      : artwork._primaryMaker?.name || "Unknown Artist"}
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

export default AllArtworks;
