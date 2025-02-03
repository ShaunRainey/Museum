import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from 'react-router'
import QuickSearch from "./QuickSearch";
import handleError from "../Utilities/handleError";

function NavBar() {

  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    // Update the URL with the new search query
    navigate(`/all-artworks?query=${encodeURIComponent(searchTerm)}`);

    // Could not get the state to behave as intended, would keep pictures the same unless manually refreshed. This window reload fixes that.
    window.location.reload();
  }

  const handleAllArtworksClick = () => {
    // Reset the URL to remove any query parameters
    navigate("/all-artworks");
    window.location.reload();
  };


  return (
    <nav className="navBar">
      <Container>
        <Row>
          <Col md={2}>
            <Link to="/" onClick={()=> {window.reload()}}>Home</Link>
          </Col>

          <Col md={2}>
            <Link to="/all-artworks/" onClick={handleAllArtworksClick}>All Artworks</Link>
          </Col>

          <Col md={2}>
            <Link to="/detailed-search" onClick={()=> {window.reload()}} >Detailed Search</Link>
          </Col>

          <Col md={2}>
            <Link to="/saved-exhibitions">Saved Exhibitions</Link>
          </Col>

          {/* <Col md={2}>
            <Link to="/account-settings">Account Settings</Link>
          </Col> */}

          <Col md={4}>
            <QuickSearch onSearch = {handleSearch} />
          </Col>
        </Row>
      </Container>
    </nav>
  );
}

export default NavBar;