import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function VamExhibition({ exhibitionName, artworks }) {
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
      <h1>{exhibitionName} Exhibition (V&A Museum)</h1>
      <Row>
        {artworks.map((artPiece) => (
          <Col md={4} key={artPiece.systemNumber}>
            <Card>
              <Card.Img
                variant="top"
                src={`https://framemark.vam.ac.uk/collections/${artPiece.images?.[0]}/full/600,400/0/default.jpg`}
                alt={artPiece?.titles?.[0]?.title || "Artwork"}
              />
              <Card.Body>
                <Card.Title>{artPiece?.titles?.[0]?.title || "Untitled"}</Card.Title>
                <Card.Text>{artPiece?.briefDescription || "No description available"}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/vam-artwork/${artPiece.systemNumber}`)}
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

export default VamExhibition;
