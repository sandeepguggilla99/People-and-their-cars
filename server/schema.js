const { gql } = require("graphql-tag");
const { v4: uuidv4 } = require("uuid");

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
    person: Person
  }

  type Query {
    people: [Person]
    cars: [Car]
    personWithCars(id: ID!): Person
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    addCar(
      year: Int!
      make: String!
      model: String!
      price: Float!
      personId: ID!
    ): Car
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    updateCar(
      id: ID!
      year: Int
      make: String
      model: String
      price: Float
      personId: ID
    ): Car
    deletePerson(id: ID!): Person
    deleteCar(id: ID!): Car
  }
`;

let people = [
  { id: "1", firstName: "Bill", lastName: "Gates" },
  { id: "2", firstName: "Steve", lastName: "Jobs" },
];

let cars = [
  {
    id: "1",
    year: 2019,
    make: "Toyota",
    model: "Corolla",
    price: 40000,
    personId: "1",
  },
  {
    id: "2",
    year: 2018,
    make: "Lexus",
    model: "LX 600",
    price: 13000,
    personId: "1",
  },
  {
    id: "3",
    year: 2017,
    make: "Honda",
    model: "Civic",
    price: 20000,
    personId: "1",
  },
  {
    id: "4",
    year: 2019,
    make: "Acura",
    model: "MDX",
    price: 60000,
    personId: "2",
  },
];

const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    personWithCars: (_, { id }) => {
      const person = people.find((person) => person.id === id);

      if (person) {
        return {
          ...person,
          cars: cars.filter((car) => car.personId === id),
        };
      }

      return null;
    },
  },

  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = { id: uuidv4(), firstName, lastName };
      people.push(newPerson);

      return newPerson;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: uuidv4(), year, make, model, price, personId };

      cars.push(newCar);
      return newCar;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const personIndex = people.findIndex((person) => person.id === id);
      if (personIndex === -1) {
        return null;
      }

      const updatedPerson = { ...people[personIndex], firstName, lastName };
      people[personIndex] = updatedPerson;

      return updatedPerson;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const carIndex = cars.findIndex((car) => car.id === id);

      if (carIndex === -1) {
        return null;
      }

      const updatedCar = {
        ...cars[carIndex],
        year,
        make,
        model,
        price,
        personId,
      };

      cars[carIndex] = updatedCar;

      return updatedCar;
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex((person) => person.id === id);

      if (personIndex === -1) {
        return null;
      }

      const deletedPerson = people.splice(personIndex, 1)[0];

      cars = cars.filter((car) => car.personId !== id);

      return deletedPerson;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) {
        return null;
      }

      const deletedCar = cars.splice(carIndex, 1)[0];
      return deletedCar;
    },
  },
  Person: {
    cars: (person) => cars.filter((car) => car.personId === person.id),
  },
  Car: {
    person: (car) => people.find((person) => person.id === car.personId),
  },
};

module.exports = { typeDefs, resolvers };
