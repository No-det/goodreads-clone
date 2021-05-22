import { useCallback, useContext, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Input, Select } from "antd";

import Logo from "../../assets/logoME.svg";
import Search from "../../assets/search.svg";
import googleIcon from "../../assets/google.svg";

import { AuthContext } from "../../contexts/AuthContext";
import { signInWithGoogle } from "../../firebase/firebase";
import "./index.scss";
import debounce from "lodash/debounce";
import { SearchContext } from "../../contexts/SearchContext";
import Genre from "../Genre";

const { Option } = Select;

const Navbar = ({ children }) => {
  const history = useHistory();
  const { user, reviews } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const { setSearchResults, setIsSearching } = useContext(SearchContext);

  const signIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) history.push("/reviews");
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = ({ target }) => {
    setSearch(target.value);
    debounceSearch(target.value);
    if (!target.value) setIsSearching(false);
    else setIsSearching(true);
  };

  const searchReviews = (value) => {
    let newSearch = reviews?.filter((review) =>
      review.bookName.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(newSearch);
    console.log(newSearch);
  };

  const debounceSearch = useCallback(
    debounce((value) => searchReviews(value), 200),
    []
  );

  return (
    <>
      <div className="navMain">
        <Link to="/">
          <div className="logoContainer">
            <img src={Logo} alt="logo" />
            <h2>readMe</h2>
          </div>
        </Link>
        {user ? (
          <div className="actionContainer">
            <Genre />
            <Input
              className="customInputSearch"
              type="text"
              placeholder="Search for a book"
              onChange={onChange}
              allowClear
              value={search}
            />
            <div className="searchBtn">
              <img src={Search} alt="search icon" />
            </div>
          </div>
        ) : (
          <div className="googleButton" onClick={signIn}>
            <img src={googleIcon} alt="G" />
            Signin with Google
          </div>
        )}
      </div>
      <div className="navContent">{children}</div>
    </>
  );
};

export default Navbar;
