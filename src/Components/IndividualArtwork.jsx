import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import metRequests from "../Utilities/metMuseumApi";
import { useParams } from "react-router";
import Loading from "./Loading";
import handleError from "../Utilities/handleError";

function IndividualArtwork({museum, artPiece, setArtPiece, loading, setLoading}) {
  const {objectID} = useParams(); 

  useEffect(() => {
    setLoading(true);

    const fetchArtPiece = async () => {
      try {
        let artPieceData;

        // Only fetch data for the Met Museum
        if (museum === "The Met Museum") {
          artPieceData = await metRequests.getObjectByID(objectID);
        }

        setArtPiece(artPieceData);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtPiece();
  }, [objectID, museum]);

  const saveToExhibition = (artPiece) => {
    if (!artPiece) {
      alert("No artwork data available to save.");
      return;
    }

    const exhibitions = JSON.parse(localStorage.getItem("exhibitions")) || {};
    const exhibitionName = prompt("Enter the exhibition name:");

    if (!exhibitionName) return;

    // Ensure exhibition entry exists with correct museum
    if (!exhibitions[exhibitionName]) {
      exhibitions[exhibitionName] = { museum: "met", artworks: [] };
    }

    exhibitions[exhibitionName].artworks.push({ ...artPiece, museum: "met" });

    localStorage.setItem("exhibitions", JSON.stringify(exhibitions));

    alert(`${artPiece?.title || "Untitled"} saved to "${exhibitionName}"`);
  };

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  } else {
    if (artPiece) {
      return (
        <Container className="mt-4">
          <Row className="align-items-start">
            <Col md={5} className="d-flex flex-column align-items-center">
              <img
                src={artPiece["primaryImage"] || "default-image.jpg"}
                alt={artPiece.title || "Artwork"}
                className="Individual-Artwork img-fluid mb-3"
              />
              <Button variant="dark" onClick={() => saveToExhibition(artPiece)}>
                Save to Exhibition
              </Button>
            </Col>

            <Col md={7}>
              <h1 className="fw-bold">{artPiece.title || "Untitled"}</h1>
              <p><strong>Date:</strong> {artPiece.objectDate || "Unknown"}</p>
              <p><strong>Creator:</strong> {artPiece._primaryMaker?.name || "Unknown"}</p>
              <p><strong>Originating from:</strong> {artPiece.place || "Unknown"}</p>
              <p>{artPiece._primaryDescription || "No description available."}</p>

              <p>For more information, please visit:</p>
              <a
                href={artPiece.objectURL || `https://www.metmuseum.org/art/collection/${artPiece.objectID}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artPiece.objectURL || "Met Collection Page"}
              </a>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default IndividualArtwork;
