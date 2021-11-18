import React from "react";
import moment from "moment";
const Msg = ({ data, onExit }: any) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "200px",
        top: "100px",
        backgroundColor: "yellow",
        padding: "30px",
        border: "1px solid black",
      }}
    >
      <button onClick={() => onExit(null)}>X</button>
      <p>Mobile: {data.Mobile}</p>
      <p>Set at: {moment(data.start).format("h:mm:ss a")}</p>
      <p>Persons: {data.numOfDiners}</p>
    </div>
  );
};

export default Msg;
