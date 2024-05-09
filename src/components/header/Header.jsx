import React, { useState, useEffect } from "react";
import "./header.scss";

import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";

const Header = () => {
    const [show, setShow] = useState("top"); // to apply styles to header based on scroll
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const controlHeader = () => {
      if(window.scrollY > 200) {
        if(window.scrollY > lastScrollY && !mobileMenu) { // we're going down
          setShow("hide");
        } else { // we're going up
          setShow("show");
        }
      } else {
        setShow("top");
      }

      setLastScrollY(window.scrollY);
    }

    useEffect(() => {
      window.addEventListener("scroll", controlHeader);

      return () => {
        window.removeEventListener("scroll", controlHeader);
      }
    }, [lastScrollY])

    /* when we navigate to another page, the location changes
    and we need to scroll on top of the page every single time */
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location])

    const openSearch = () => {
      setMobileMenu(false);
      setShowSearch(true);
    }

    const openMobileMenu = () => {
      setMobileMenu(true);
      setShowSearch(false);
    }

    const searchQueryHandler = (event) => {
      if (event.key === "Enter" && query.length > 0) {
        navigate(`/search/${query}`);

        // to close the search bar after we navigate to another page after 1 sec
        setTimeout(() => {
          setShowSearch(false);
        }, 1000)
      }
    }

    const navigationHandler = (type) => {
      if (type === 'movie') {
        navigate("/explore/movie");
      } else {
        navigate("/explore/tv");
      }

      setMobileMenu(false);
    }

    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
          <ContentWrapper>
            <div className="logo" onClick={() => {navigate("/")}}>
              <img src={logo} alt="" />
            </div>

            <ul className="menuItems">
              <li className="menuItem" onClick={() => {navigationHandler('movie')}}>Movies</li>
              <li className="menuItem" onClick={() => {navigationHandler('tv')}}>TV Shows</li>
              <li className="menuItem">
                <HiOutlineSearch onClick={openSearch} />
              </li>
            </ul>

            <div className="mobileMenuItems">
              <HiOutlineSearch onClick={openSearch} />

              {mobileMenu ? <VscChromeClose onClick={() => {setMobileMenu(false)}} /> : <SlMenu onClick={openMobileMenu} />}
            </div>
          </ContentWrapper>

          {showSearch &&
            <div className="searchBar">
              <ContentWrapper>
                <div className="searchInput">
                  <input 
                    type="text"
                    placeholder="Search for a movie or tv show...."
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyUp={searchQueryHandler}
                  />
                  <VscChromeClose onClick={() => {setShowSearch(false)}} />
                </div>
              </ContentWrapper>
            </div>
          }
        </header>
    );
};

export default Header;