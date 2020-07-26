import React, { useState } from "react";
import ExperienceItem from "./experiences/experience.item.component";
import { useSelector, useDispatch } from "react-redux";

import handleOfferSearch from "../../../helpers/filter.offers";
import ShowModal from "../../modal/modal.component";

import { Link } from "react-router-dom";
import "./discover.component.styles.scss";

const Main = () => {
  const dispatch = useDispatch();

  const [startIndex, setStartIndex] = useState(0);
  const [finalIndex, setFinalIndex] = useState(1);

  //1. We have to select our full data from the state
  const offersFullData = useSelector(({ data }) => data.destinations);

  const noOfferMatch = [
    offersFullData.find((element) => element.id.toString() === "404"),
  ];

  //2. Check which input the user passed..
  const searchInput = useSelector((state) => state.searchInput);

  const filteredSearch = handleOfferSearch(
    searchInput,
    noOfferMatch,
    offersFullData
  );

  let slicedResults = [];
  slicedResults = [...filteredSearch].filter((elem, index) => {
    if (filteredSearch.length === 1) {
      return index === 0;
    }
    return index >= startIndex && index <= finalIndex;
  });

  const previousCard = () => {
    if (startIndex === 0) {
      return;
    }
    setStartIndex(startIndex - 1);
    setFinalIndex(finalIndex - 1);
  };

  const nextCard = () => {
    if (finalIndex === filteredSearch.length - 2) {
      return;
    }
    setStartIndex(startIndex + 1);
    setFinalIndex(finalIndex + 1);
  };


  const [modalIsOpen, setIsOpen] = useState(false);
  const [dataModal, setDataModal] = useState({});

  /**
   * 1. This function set the status of the Modal to Open.
   * 2. It updates the local state with the Data to render the modal.
   * 3. It checks if the item is on the Favorites and pass (false or true)
   */
  function openModal(props) {
    const isOnFavorites = true;

    setIsOpen(true);
    setDataModal({ ...props, isOnFavorites});
  }

  function closeModal() {
    setIsOpen(false);
  }

  const addWishList = (offerID, productName) => {
    dispatch({
      type: "ADD_FAVORITE",
      payload: { id: offerID, name: productName },
    });
  };

  return (
    <div className="aside-main">
      <h2>Discover</h2>
      <nav>
        <Link to="places">Places</Link>
        <Link to="experiences">Experiences</Link>
        <Link to="housings">Housings</Link>
      </nav>

      <ShowModal
        data={dataModal}
        closeModal={closeModal}
        addWishList={addWishList}
        modalIsOpen={modalIsOpen}
      />

      <div className="aside-main__carrousel">
        {slicedResults.map(({ ...item }) => (
          <ExperienceItem key={item.id} {...item} openModal={openModal} />
        ))}
      </div>
      <div className="pagination">
        <ion-icon name="chevron-back-outline" onClick={previousCard}></ion-icon>
        <ion-icon name="chevron-forward-outline" onClick={nextCard}></ion-icon>
      </div>
    </div>
  );
};

export default Main;
