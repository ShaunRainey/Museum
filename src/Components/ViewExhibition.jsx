import { useParams, useNavigate } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function ViewExhibition() {
  const { exhibitionName } = useParams();
  const [exhibition, setExhibition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const exhibitions = JSON.parse(localStorage.getItem("exhibitions")) || {};
    setExhibition(exhibitions[exhibitionName] || { artworks: [] });
  }, [exhibitionName]);

  const deleteArtwork = (artPieceID) => {
    if (!exhibition) return;

    const updatedExhibition = {
      ...exhibition,
      artworks: exhibition.artworks.filter(
        (artPiece) =>
          (artPiece.museum === "vam"
            ? artPiece.systemNumber
            : artPiece.objectID) !== artPieceID
      ),
    };

    const exhibitions = JSON.parse(localStorage.getItem("exhibitions")) || {};
    exhibitions[exhibitionName] = updatedExhibition;
    localStorage.setItem("exhibitions", JSON.stringify(exhibitions)); // Update localStorage

    setExhibition(updatedExhibition);
  };

  if (!exhibition || exhibition.artworks.length === 0) {
    return (
      <Container>
        <h1>{exhibitionName} Exhibition</h1>
        <p>No artworks in this exhibition.</p>
      </Container>
    );
  }

return (
  <Container>
    <h1>{exhibitionName} Exhibition</h1>
      <Row className="g-4">
        {exhibition.artworks.map((artPiece) => (
          <Col md={4} key={artPiece.systemNumber || artPiece.objectID}>
            <Card className="custom-card card-container">
              <Card.Img
                variant="top"
                src={artPiece.museum === "vam"
                ? `https://framemark.vam.ac.uk/collections/${artPiece.images?.[0]}/full/600,400/0/default.jpg`
                : artPiece?.primaryImageSmall || "https://via.placeholder.com/150"}
                alt={artPiece?.titles?.[0]?.title || artPiece?.title || "Artwork"}
                className="Card-img"
              />
              <Card.Body className="custom-card-body">
              <Card.Title className="card-title">{artPiece?.titles?.[0]?.title || artPiece?.title || "Untitled"}</Card.Title>
                <div className="button-group">

              <Button
              variant="dark"
              onClick={() => navigate(artPiece.museum === "vam" ? `/vam-artwork/${artPiece.systemNumber}`: `/met-artwork/${artPiece.objectID}`)}>
              View Artwork
              </Button>
              
              <Button
              variant="danger"
              onClick={() => deleteArtwork(artPiece.museum === "vam" ? artPiece.systemNumber : artPiece.objectID)}>
              Delete
              </Button>
                  
              </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

  </Container>
);
}

export default ViewExhibition;
