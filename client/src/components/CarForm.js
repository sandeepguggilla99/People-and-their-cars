// Author
// Sandeep Guggilla

import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

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

const ADD_CAR = gql`
  mutation AddCar(
    $year: Int!
    $make: String!
    $model: String!
    $price: Float!
    $personId: ID!
  ) {
    addCar(
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const CarForm = () => {
  /* The line `const { loading, error, data } = useQuery(GET_PEOPLE);` is using the `useQuery` hook
  from Apollo Client to fetch data from the GraphQL server using the `GET_PEOPLE` query. */
  const { loading, error, data } = useQuery(GET_PEOPLE);

  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  const [personId, setPersonId] = useState("");

  /* The code snippet you provided is defining a mutation operation using the `useMutation` hook from
  Apollo Client. */
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = people.map((person) => {
        if (person.id === addCar.personId) {
          return {
            ...person,
            cars: [...person.cars, addCar],
          };
        }

        return person;
      });

      cache.writeQuery({
        query: GET_PEOPLE,

        data: { people: updatedPeople },
      });
    },
  });

  /**
   * The handleSubmit function prevents the default form submission, adds a new car with specified
   * details, and resets the input fields.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    addCar({
      variables: {
        year: parseInt(year),
        make,
        model,

        price: parseFloat(price),
        personId,
      },
    });
    setYear("");
    setMake("");
    setModel("");
    setPrice("");

    setPersonId("");
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error</p>;
  }

  return (
    /* This code snippet is defining a form component in React that allows users to add a new car
    entry. Here's a breakdown of what each part of the form is doing: */
    <form onSubmit={handleSubmit}>
      <h2>Add Car</h2>
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Make"
        value={make}
        onChange={(e) => setMake(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <select
        value={personId}
        onChange={(e) => setPersonId(e.target.value)}
        required
      >
        <option value="">Select a person</option>
        {data.people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </option>
        ))}
      </select>

      <button type="submit">Add Car</button>
    </form>
  );
};

export default CarForm;
