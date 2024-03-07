import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const AdminContext = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [alert, setAlert] = useState({isError: false, errMsg: '', errType: ''});
  // const [zipcode, setZipcode] = useState([]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  useEffect(()=>{
    if(!alert.isError) return
    setTimeout(() => {
      setAlert({isError: false, errMsg: '', errType: ''})
    }, 5000);
  },[alert])

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  const [categories, setCategories] = useState(null);
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndCountries = async () => {
      try {
        const responseCategories = await fetch(
          import.meta.env.VITE_APP_BASE_API +
            "/api/v1/products/get-all-category"
        );
        const responseCountries = await fetch(
          import.meta.env.VITE_APP_BASE_API + "/api/v1/products/get-all-country"
        );
        if (!responseCategories.ok || !responseCountries.ok) {
          throw new Error(
            `HTTP error! status: ${responseCategories.status}, ${responseCountries.status}`
          );
        }
        const dataCategories = await responseCategories.json();
        const dataCountries = await responseCountries.json();
        setCategories(dataCategories.data);
        setCountries(dataCountries.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategoriesAndCountries();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
       
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        products,
        setProducts,
        faqs,
        setFaqs,
        countries,
        categories,
        reviews,
        setReviews,
        blogs,
        setBlogs,
        setAlert,
        alert,
      
      }}
    >
    {children ? children : null}
    </StateContext.Provider>
  );
};

export const useAdminState = () => useContext(StateContext);
