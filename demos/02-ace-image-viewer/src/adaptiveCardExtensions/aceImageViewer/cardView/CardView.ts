import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'AceImageViewerAdaptiveCardExtensionStrings';
import { IAceImageViewerAdaptiveCardExtensionProps, IAceImageViewerAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AceImageViewerAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IAceImageViewerAdaptiveCardExtensionProps, IAceImageViewerAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const cardButtons: ICardButton[] = [];

    if (this.state.currentIndex !== 0) {
      cardButtons.push(<ICardButton>{
        title: '<',
        id: '-1',
        action: {
          type: 'Submit',
          parameters: {}
        }
      });
    }
    if (this.state.currentIndex !== (this.state.roverPhotos.length - 1)) {
      cardButtons.push(<ICardButton>{
        title: '>',
        id: '1',
        action: {
          type: 'Submit',
          parameters: {}
        }
      });
    }

    return (cardButtons.length === 0)
      ? undefined
      : (cardButtons.length === 1)
        ? [cardButtons[0]]
        : [cardButtons[0], cardButtons[1]];
  }

  public get data(): IImageCardParameters {
    if (!this.properties.nasa_rover || !this.properties.mars_sol) {
      return {
        primaryText: `Select Mars rover & sol to display photos...`,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tharsis_and_Valles_Marineris_-_Mars_Orbiter_Mission_%2830055660701%29.png/240px-Tharsis_and_Valles_Marineris_-_Mars_Orbiter_Mission_%2830055660701%29.png',
        imageAltText: `Select Mars rover & sol to display photos...`,
        title: this.properties.title
      }
    } else {
      const rover = `${this.properties.nasa_rover.substring(0, 1).toUpperCase()}${this.properties.nasa_rover.substring(1)}`;
      const roverImage = this.state.roverPhotos[this.state.currentIndex];
      return {
        primaryText: `Photos from the Mars rover ${rover} on sol ${this.properties.mars_sol}`,
        imageUrl: roverImage.img_src,
        imageAltText: `Image ${roverImage.id} taken on ${roverImage.earth_date} from ${rover}'s ${roverImage.camera.full_name} camera.`,
        title: this.properties.title
      };
    }
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') { return; }

    let currentIndex = this.state.currentIndex;
    this.setState({ currentIndex: currentIndex + Number(action.id) });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
