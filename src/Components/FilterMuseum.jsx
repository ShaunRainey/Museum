import { Row, Form } from "react-bootstrap";

function FilterMuseum({ museum, handleMuseumChange }) {
  return (
    <Row>
      <Form.Group className="mb-3">
        <Form.Label>Filter by Museum</Form.Label>
        <Form.Control 
          as="select" 
          value={museum}  // Bind the dropdown to the `museum` state
          onChange={handleMuseumChange}  // Handle the change event to update the state
        >
          <option value="The Met Museum">The Met Museum</option>
          <option value="Victoria and Albert Museum">Victoria and Albert Museum</option>
        </Form.Control>
      </Form.Group>
    </Row>
  );
}

export default FilterMuseum;
