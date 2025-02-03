import metRequests from "../Utilities/metMuseumApi";
import { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router'
import Loading from "./Loading";
import handleError from "../Utilities/handleError";

function MetRandom({artworkIDs, setArtworkIDs, artworks, setArtworks, loading, setLoading, museum, setMuseum, handleMuseumChange}) {

  useEffect(() => {
    const getArtworksIDs = async () => {
      setLoading(true);  

      try {
        const imagedArtworks = await metRequests.getRandomImagedArtworks();

        const artworkPromises = imagedArtworks.map((ID) => {
          return metRequests.getObjectByID(ID);
        });
        const artworkData = await Promise.all(artworkPromises);

        setArtworks(artworkData);
      } catch (error) {
          handleError(error)
          setLoading(false);
      }
      setLoading(false); 
    };
    getArtworksIDs();
  }, [museum]);  // Runs the API call again if the museum filter is switched

  if (loading) {
    return <Loading />
  }

  return (
    <Container>

      <Row>
        {artworks.map((artwork) => (
          <Col md={4} key={artwork["objectID"]} className="mb-4">
            <Link to={`/met-artwork/${artwork.objectID}`}>
              <Card className="custom-card">
                <Card.Img
                  variant="top"
                  src={artwork["primaryImageSmall"]}
                  alt="Artwork"
                  className="Card-img"
                />
                <Card.Body className="custom-card-body">
                  <Card.Title className="mb-2">
                    {artwork.title || "Untitled"}
                  </Card.Title>
                  <Card.Text className="custom-card-text">
                    {artwork.artistDisplayName || "Unknown Artist"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MetRandom;
