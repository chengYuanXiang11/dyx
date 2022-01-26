import styled from "styled-components";
// css in js
const VideoCss = styled.div`
  width: ${(props) => (props.width ?props.width+'px' : "500px")};
  height: ${(props) => (props.height ?props.height+'px' : "auto")};
  color: #00ff00;
`;
export {VideoCss}