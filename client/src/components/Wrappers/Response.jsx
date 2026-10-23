import FieldList from "./FieldList";

const Response = ({ parameters, hideTitle = false }) => (
  <FieldList title={hideTitle ? null : "Response"} fields={parameters} />
);

export default Response;
