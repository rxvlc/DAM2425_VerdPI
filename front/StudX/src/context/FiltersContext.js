import React, { createContext, useState, useContext } from "react";

// Creamos el contexto de filtros
const FiltersContext = createContext();

export const useFilters = () => {
  return useContext(FiltersContext);
};

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    nativeLanguage: "",
    targetLanguage: "",
    academicLevel: "", // Solo mantenemos academicLevel
    beginDate: "",
    endDate: "",
    quantityStudentsMin: 0,
    quantityStudentsMax: 0,
    university: "",
  });

  const updateFilter = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <FiltersContext.Provider value={{ filters, updateFilter }}>
      {children}
    </FiltersContext.Provider>
  );
};
