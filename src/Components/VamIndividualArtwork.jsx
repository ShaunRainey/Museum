import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import vamRequests from "../Utilities/vamMuseum";
import { useParams } from "react-router";
import Loading from "./Loading";
import handleError from "../Utilities/handleError";

function VamIndividualArtwork({ artPiece, setArtPiece, loading, setLoading }) {
  const { objectID } = useParams();

  // This useEffect allows the page to be refreshed or a link to be sent. As the object is effectively drawn from the URL, the previous
  // page/states don't matter.
  useEffect(() => {
    setLoading(true);
    const fetchArtPiece = async (objectID) => {
      try {
        const artPieceData = await vamRequests.fetchIndividualObject(objectID);
        console.log(artPieceData);
        setArtPiece(artPieceData);
      } catch (error) {
        handleError(error);
      }
    };
    fetchArtPiece(objectID);
    setLoading(false);
  }, [objectID, setArtPiece, setLoading]);

  const saveToExhibition = (artPiece) => {
    if (!artPiece) {
      alert("No artwork data available to save.");
      return;
    }

    const exhibitions = JSON.parse(localStorage.getItem("exhibitions")) || {};
    const exhibitionName = prompt("Enter the exhibition name:"); // Ask user for exhibition name

    if (!exhibitionName) {
      return;
    }

    // Ensure exhibition entry exists with correct museum identifier
    if (!exhibitions[exhibitionName]) {
      exhibitions[exhibitionName] = { museum: "vam", artworks: [] }; // ✅ Set museum as "vam"
    }

    exhibitions[exhibitionName].artworks.push({ ...artPiece, museum: "vam" }); // ✅ Ensure artwork has museum field

    localStorage.setItem("exhibitions", JSON.stringify(exhibitions));

    alert(`${artPiece?.titles?.[0]?.title || "Untitled"} saved to "${exhibitionName}"`);
  };

  if (loading || !artPiece) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="align-items-center">
        {/* Left Column: Image + Button */}
        <Col md={5} className="d-flex flex-column align-items-center">
          <img
            src={`https://framemark.vam.ac.uk/collections/${artPiece["images"]?.[0]}/full/600,400/0/default.jpg`}
            alt={artPiece["titles"]?.[0]?.["title"] || "Artwork"}
            className="artwork-image img-fluid mb-3" // Replaced className to match Met style
          />
          <Button variant="dark" onClick={() => saveToExhibition(artPiece)}>
            Save to Exhibition
          </Button>
        </Col>

        {/* Right Column: Text Information */}
        <Col md={7}>
          <h1>{artPiece["titles"]?.[0]?.["title"] || "Untitled"}</h1>
          <p>Date: {artPiece?.["productionDates"]?.[0]?.["date"]?.["text"] || "Unknown Date of Origin"}</p>
          <p>Creator: {artPiece?.["artistMakerPerson"]?.[0]?.["name"]?.["text"] || "Unknown Artist"}</p>
          <p>Originating from: {artPiece?.["placesOfOrigin"]?.[0]?.["place"]?.["text"] || "Unknown Origin"}</p>
          <p>{artPiece?.["briefDescription"] || "No description available."}</p>
          <p>For more information, please visit:</p>
          <p>
            <a href={`https://collections.vam.ac.uk/item/${objectID}/`}>
              {`https://collections.vam.ac.uk/item/${objectID}/`}
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default VamIndividualArtwork;
