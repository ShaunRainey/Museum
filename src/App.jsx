import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router";

import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";

import FeaturedArtworks from "./Components/FeaturedArtworks.jsx";
import IndividualArtwork from "./Components/IndividualArtwork.jsx";
import NavBar from "./Components/NavBar.jsx";
import AllArtworks from "./Components/AllArtworks.jsx";
import DetailedSearch from "./Components/DetailedSearchBar.jsx";
import SavedExhibitions from "./Components/SavedExhibitions.jsx";
import ViewExhibition from "./Components/ViewExhibition.jsx";
import VamIndividualArtwork from "./Components/VamIndividualArtwork.jsx";

/* 
Implement picture zoom
*/

function App() {
  const [artworks, setArtworks] = useState([]);
  const [artPiece, setArtPiece] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validObjectIDs, setValidObjectIDs] = useState([]); // To store all valid object IDs
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [museum, setMuseum] = useState("The Met Museum");
  const [artworkIDs, setArtworkIDs] = useState([]);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleMuseumChange = (event) => {
    setArtworks([]);
    setMuseum(event.target.value);
  };

  return (
    <Container>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Row>
              <Col>
                <FeaturedArtworks
                  artPiece={artPiece}
                  setArtPiece={setArtPiece}
                  artworkIDs={artworkIDs}
                  setArtworkIDs={setArtworkIDs}
                  artworks={artworks}
                  setArtworks={setArtworks}
                  loading={loading}
                  setLoading={setLoading}
                  museum={museum}
                  setMuseum={setMuseum}
                  handleMuseumChange={handleMuseumChange}
                />
              </Col>
            </Row>
          }
        />

        <Route
          path="/met-artwork/:objectID"
          element={
            <IndividualArtwork
              museum={museum}
              artPiece={artPiece}
              setArtPiece={setArtPiece}
              loading={loading}
              setLoading={setLoading}
            />
          }
        />

        <Route
          path="/vam-artwork/:objectID"
          element={
            <VamIndividualArtwork
              museum={museum}
              artPiece={artPiece}
              setArtPiece={setArtPiece}
              loading={loading}
              setLoading={setLoading}
            />
          }
        />

        <Route
          path="/all-artworks/"
          element={
            <AllArtworks
              artworks={artworks}
              setArtworks={setArtworks}
              loading={loading}
              setLoading={setLoading}
              validObjectIDs={validObjectIDs}
              setValidObjectIDs={setValidObjectIDs}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              museum={museum}
              setMuseum={setMuseum}
              handleMuseumChange={handleMuseumChange}
            />
          }
        />

        <Route
          path="/detailed-search"
          element={
            <DetailedSearch
              artworks={artworks}
              setArtworks={setArtworks}
              loading={loading}
              setLoading={setLoading}
              validObjectIDs={validObjectIDs}
              setValidObjectIDs={setValidObjectIDs}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              museum={museum}
              setMuseum={setMuseum}
              handleMuseumChange={handleMuseumChange}
              searchInitiated={searchInitiated}
              setSearchInitiated={setSearchInitiated}
            />
          }
        />

        <Route path="/saved-exhibitions" element={<SavedExhibitions />} />

        <Route
          path="/exhibition/:exhibitionName"
          element={<ViewExhibition />}
        />
      </Routes>
    </Container>
  );
}

export default App;
