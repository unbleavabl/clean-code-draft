import { useState, useEffect } from "react";
import axios from "axios";
import CharacterList from "./Components/CharacterList";
import Loading from "./Components/Loading";

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [people, setPeople] = useState([]);
  const [homeWorld, setHomeWorld] = useState([]);
  // const [species, setSpecies] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(
    "https://swapi.dev/api/people/"
  );
  const [backPageUrl, setBackPageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPeople = async (pageUrl) => {
    console.log("fetching url ", pageUrl);
    const { data } = await axios.get(pageUrl);
    setNextPageUrl(data.next);
    setBackPageUrl(data.previous);
    return data.results;
  };

  // Get People
  async function getPeople(pageUrl) {
    setLoading(true);
    const persons = await fetchPeople(pageUrl);

    const homeWorldUrl = await Promise.all(
      persons.map((thing) => {
        console.log("fetching url ", thing.homeworld);
        return axios.get(thing.homeworld);
      })
    );

    const newPersons = persons.map((person) => {
      return {
        ...person,
        homeworld: homeWorldUrl.find(
          (url) => url.config.url === person.homeworld
        ),
      };
    });

    const newPersons2 = newPersons.map((person) => {
      return {
        ...person,
        homeWorld: person.homeworld.data.name,
      };
    });
    setPeople(newPersons2);
  }

  //   // Get Species
  async function getSpecies() {
    // const persons = await fetchPeople();
    const speciesUrl = await Promise.all(
      // filter by length to get all with [0] together since all are arrays of [0]
      // map to create array of each one with an array of [0]
      people
        .filter((thing) => thing.species.length)
        .map((thing) => {
          console.log('fetching url ', thing.species);
          return axios.get(thing.species[0]);
        })
    );

    const newSwapi = people.map((person) => {
      return {
        ...person,
        species: speciesUrl.find((info) => info.data.url === person.species[0]),
      };
    });
    const newSwapi2 = newSwapi.map((person) => {
      if (person.species == undefined) {
        return { ...person, species: "Human" };
      } else {
        return { ...person, species: person.species.data.name };
      }
    });

    setCharacters(newSwapi2);
    setLoading(false);
  }

  async function getCharacters(pageUrl) {
    await getPeople(pageUrl);
    getSpecies();
  }

  useEffect(() => {
    getCharacters(nextPageUrl);
  }, []);

  return (
    <div>
      <button onClick={(e) => getCharacters(backPageUrl)}>Back Page</button>
      <button onClick={(e) => getCharacters(nextPageUrl)}>Next Page</button>
      {loading && <Loading />}
      {!loading && <CharacterList list={characters} />}
    </div>
  );
};

export default App;
