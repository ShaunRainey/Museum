import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function MetExhibition({ exhibitionName, artworks }) {
  const navigate = useNavigate();

  if (!artworks || artworks.length === 0) {
    return (
      <Container>
        <h1>{exhibitionName} Exhibition</h1>
        <p>No artworks in this exhibition.</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>{exhibitionName} Exhibition (The Met Museum)</h1>
      <Row>
        {artworks.map((artPiece) => (
          <Col md={4} key={artPiece.objectID}>
            <Card>
              <Card.Img
                variant="top"
                src={artPiece?.primaryImageSmall || "https://via.placeholder.com/150"}
                alt={artPiece?.title || "Artwork"}
              />
              <Card.Body>
                <Card.Title>{artPiece?.title || "Untitled"}</Card.Title>
                <Card.Text>{artPiece?.artistDisplayName || "Unknown Artist"}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/met-artwork/${artPiece.objectID}`)}
                >
                  View Artwork
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MetExhibition;
