import React from "react";

const Character = (props) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>{props.name}</th>
            <th>{props.birthYear}</th>
            <th>{props.height}</th>
            <th>{props.mass}</th>
            <th>{props.homeWorld}</th>
            <th>{props.species}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Character;

