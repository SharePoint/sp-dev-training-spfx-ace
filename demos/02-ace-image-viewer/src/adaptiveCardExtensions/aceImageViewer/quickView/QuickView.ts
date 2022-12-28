import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'AceImageViewerAdaptiveCardExtensionStrings';
import { IAceImageViewerAdaptiveCardExtensionProps, IAceImageViewerAdaptiveCardExtensionState } from '../AceImageViewerAdaptiveCardExtension';
import { IMarsRoverPhoto } from '../nasa.service';

export class QuickView extends BaseAdaptiveCardView<
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState,
  IMarsRoverPhoto
> {
  public get data(): IMarsRoverPhoto {
    return this.state.roverPhotos[this.state.currentIndex];
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
