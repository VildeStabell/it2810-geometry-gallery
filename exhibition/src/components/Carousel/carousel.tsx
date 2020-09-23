import React from "react";
import "./carousel.css";
import "../../installations/installation1.css";
import "../../installations/installation2.css";
import "../../installations/installation3.css";
import "../../installations/installation4.css";
import "../../installations/installation5.css";
import "../../installations/installation6.css";
import "../../installations/installation7.css";
import "../../installations/installation8.css";
import "../../installations/installation9.css";
import InstallationContent from "../InstallationContent/installationContent";
import { allInstallations } from "../../installations/installations";
import InstallationInfo from "../InstallationInfo/installationInfo";
import Poetry from "../Poetry/poetry";
import Audio from "../Audio/audio";
import { FavoriteButton, favoriteInstallationIds } from "../Favorite/favorite";
import { InstallationIndexContext } from "../../state/installationIndexContext";
import {
  filteredInstallations,
  updateFilteredInstallations,
} from "../InstallationFilter/installationFilter";

interface CarouselProps {
  displayOnlyFavorites: Boolean;
  updateFilters: Boolean;
}

let currentInstallations = filteredInstallations;

/**
 * Carousel is the main component in the webapp. It displays
 * the installations, changes between which installation is
 * displayed and can display installations based on filters
 * or favorites.
 *
 * @var displayOnlyFavorites is a boolean representing
 *    whether favorited or filtered installations are
 *    displayed.
 */

class Carousel extends React.Component<CarouselProps, {}> {
  static contextType = InstallationIndexContext;
  context!: React.ContextType<typeof InstallationIndexContext>;

  componentDidUpdate() {
    sessionStorage.setItem(
      "carouselIndex",
      String(this.context.installationIndex)
    );

    const inst = currentInstallations[this.context.installationIndex];
    const star = document.getElementById("star");

    if (favoriteInstallationIds.some((favId) => favId === inst.id)) {
      star?.classList.add("filledStar");
    } else {
      star?.classList.remove("filledStar");
    }
  }

  render() {
    const { installationIndex, setInstallationIndex } = this.context;

    if (this.props.displayOnlyFavorites) {
      currentInstallations = favoriteInstallationIds.map(
        (favInstallationId) =>
          allInstallations.filter((inst) => inst.id === favInstallationId)[0]
      );
    } else if (this.props.updateFilters) {
      updateFilteredInstallations();
      currentInstallations = filteredInstallations;
    } else {
      currentInstallations = filteredInstallations;
    }

    const currentInstallation = currentInstallations[installationIndex];

    const changeInstallation = (next: Boolean) => {
      if (!this.props.displayOnlyFavorites) {
        currentInstallations = filteredInstallations;
      }
      if (next) {
        installationIndex >= currentInstallations.length - 1
          ? setInstallationIndex(0)
          : setInstallationIndex(installationIndex + 1);
      } else {
        installationIndex === 0
          ? setInstallationIndex(currentInstallations.length - 1)
          : setInstallationIndex(installationIndex - 1);
      }
    };

    return (
      <div id="carousel">
        <div className="arrows left" onClick={() => changeInstallation(false)}>
          <div className="leftArrow"></div>
        </div>

        <div id="installation">
          <InstallationContent installation={currentInstallation.shapes} />
          <Poetry
            url={currentInstallation.poemUrl}
            id={currentInstallation.poemId}
          />
        </div>
        <div id="audioFav">
          <Audio audioUrl={currentInstallation.audioUrl} />
          <FavoriteButton installation={currentInstallation} />
        </div>
        <div className="arrows right" onClick={() => changeInstallation(true)}>
          <div className="rightArrow"></div>
        </div>
        <div id="artInfo">
          <InstallationInfo
            installationTitle={currentInstallation.title}
            year={currentInstallation.year}
            artist={currentInstallation.artist}
          />
        </div>
      </div>
    );
  }
}

export default Carousel;
