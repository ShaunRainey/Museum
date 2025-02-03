import vamRequests from "../Utilities/vamMuseum"
import { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from 'react-router'
import Loading from "./Loading";
import handleError from "../Utilities/handleError";

function VamRandom({artPiece, setArtPiece, artworks, setArtworks, loading, setLoading, museum}) {
  
  useEffect(() => {
    const getArtworks = async () => {
      
      setLoading(true)

      try { 
        const imagedArtworks = await vamRequests.fetchRandomObjects(1000); //The number entered here will just increase randomness. Min 100.
        setArtworks(imagedArtworks);
        console.log(imagedArtworks)
      }
      catch (error) {
        handleError(error)
        setLoading(false)
      }
      setLoading(false)
    };
    getArtworks();
  }, [museum]) // Runs the API call again if the museum filter is switched
  

 if(loading){
    return (<Loading/>)
  } else{
      
      return (
          <Container>
        <Row>
          {artworks.map((artwork) => (
              
              <Col md={4} className="mb-4" key={artwork["systemNumber"]} >
              <Link to={`/vam-artwork/${artwork["systemNumber"]}`}>
                <Card className="custom-card">
                  <Card.Img
                    variant="top"
                    src={`https://framemark.vam.ac.uk/collections/${artwork["_primaryImageId"]}/full/600,400/0/default.jpg`}
                    alt="Artwork"
                    className="Card-img"
                    onClick={()=>{setArtPiece(artwork)}}
                    />
                  <Card.Body className="custom-card-body">
                    <Card.Title className="mb-2">
                      {artwork["_primaryTitle"] || "Untitled"}
                    </Card.Title>
                    <Card.Text className="custom-card-text">
                      {artwork["_primaryMaker"]["name"] || "Unknown Artist"}
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
}

export default VamRandom;
