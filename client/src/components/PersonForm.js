// Author
// Sandeep Guggilla

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const PersonForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [addPerson] = useMutation(ADD_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addPerson({ variables: { firstName, lastName } });
    setFirstName("");
    setLastName("");
  };

  return (
    /* This code snippet is a React component called `PersonForm` that represents a form for adding a new
person. */
    <form onSubmit={handleSubmit}>
      <h2>Add Person</h2>
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <button type="submit">Add Person</button>
    </form>
  );
};

export default PersonForm;
