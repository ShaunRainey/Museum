import { Card, Container, Row, Col, Form } from "react-bootstrap";
import handleError from "../Utilities/handleError";
import FilterMuseum from "./FilterMuseum";
import VamRandom from "./VamRandom";
import MetRandom from "./MetRandom";

function FeaturedArtworks({artPiece, setArtPiece, artworkIDs, setArtworkIDs, artworks, setArtworks, loading, setLoading,museum, setMuseum, handleMuseumChange}) {

  if(museum === "The Met Museum"){
    return (
      <Container> 

        <Row>
          <Form>
            <FilterMuseum museum={museum} handleMuseumChange={handleMuseumChange} />
          </Form>
        </Row>

          <MetRandom artworkIDs={artworkIDs} setArtworkIDs={setArtworkIDs} artworks={artworks} setArtworks={setArtworks} loading = {loading} setLoading = {setLoading} museum={museum} setMuseum={setMuseum}/>
      </Container>
  );
  } else if (museum === "Victoria and Albert Museum"){
      return (
        <Container>   

          <Row>
            <Form>
              <FilterMuseum museum={museum} handleMuseumChange={handleMuseumChange} />
            </Form>
          </Row>

            <VamRandom artPiece={artPiece} setArtPiece={setArtPiece} artworkIDs={artworkIDs} setArtworkIDs={setArtworkIDs} artworks={artworks} setArtworks={setArtworks} loading = {loading} setLoading = {setLoading} museum={museum} setMuseum={setMuseum}/>
        </Container>
    );
  }
  
}
export default FeaturedArtworks;