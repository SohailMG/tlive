import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

export function useLocalStorageArray(key) {
  const [items, setItems] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      console.log("fetching saved channels from local storage");
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("error");
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(error);
    }
  }, [key, items]);

  const addItem = (item) => {
    console.log("adding item :" + item);
    // setSaved([...value, item]);
    setItems((prevValue) => [...prevValue, item]);
    window.location = window.location;
  };

  const removeItem = (item) => {
    console.log("removing item: " + item);

    setItems((prevValue) =>
      prevValue.filter((i) => i.toLowerCase() !== item.toLowerCase())
    );
    window.location = window.location;
    console.log("after removing item ", items);
  };

  return [items, addItem, removeItem];
}
