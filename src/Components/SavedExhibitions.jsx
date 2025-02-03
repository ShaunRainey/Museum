import { Container, ListGroup, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState } from "react";

function SavedExhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState(
    JSON.parse(localStorage.getItem("exhibitions")) || {}
  );

  const deleteExhibition = (exhibitionName) => {
    if (window.confirm(`Are you sure you want to delete "${exhibitionName}"?`)) {
      const updatedExhibitions = { ...exhibitions };
      delete updatedExhibitions[exhibitionName];
      localStorage.setItem("exhibitions", JSON.stringify(updatedExhibitions));
      setExhibitions(updatedExhibitions);
      alert(`Exhibition "${exhibitionName}" deleted.`);
    }
  };

  return (
    <Container>
      <h1>Saved Exhibitions</h1>
      {Object.keys(exhibitions).length > 0 ? (
        <ListGroup>
          {Object.keys(exhibitions).map((exhibition) => (
            <ListGroup.Item key={exhibition}>
              <Row>
                <Col xs={6}>
                  <span
                    onClick={() => navigate(`/exhibition/${exhibition}`)}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    {exhibition}
                  </span>
                </Col>
                <Col xs={3}>
                  {/* Display museum source as a badge */}
                  <Badge bg={exhibitions[exhibition].museum === "vam" ? "info" : "secondary"}>
                    {/* {exhibitions[exhibition].museum.toUpperCase()} */}
                  </Badge>
                </Col>
                <Col xs={3} className="text-end">
                  <Button variant="danger" size="sm" onClick={() => deleteExhibition(exhibition)}>
                    Delete
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No exhibitions saved yet.</p>
      )}
    </Container>
  );
}

export default SavedExhibitions;
