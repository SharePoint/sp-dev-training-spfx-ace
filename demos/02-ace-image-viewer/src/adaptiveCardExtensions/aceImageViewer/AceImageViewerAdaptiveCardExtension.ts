import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AceImageViewerPropertyPane } from './AceImageViewerPropertyPane';
import { isEmpty } from '@microsoft/sp-lodash-subset'
import {
  fetchRoverPhotos,
  IMarsRoverPhoto
} from './nasa.service';

export interface IAceImageViewerAdaptiveCardExtensionProps {
  title: string;
  nasa_api_key: string;
  nasa_rover: string;
  mars_sol: number;
}

export interface IAceImageViewerAdaptiveCardExtensionState {
  currentIndex: number;
  roverPhotos: IMarsRoverPhoto[];
}

const CARD_VIEW_REGISTRY_ID: string = 'AceImageViewer_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceImageViewer_QUICK_VIEW';

export default class AceImageViewerAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceImageViewerAdaptiveCardExtensionProps,
  IAceImageViewerAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceImageViewerPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      currentIndex: 0,
      roverPhotos: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    if (!isEmpty(this.properties.nasa_api_key) &&
      !isEmpty(this.properties.nasa_rover) &&
      !isEmpty(this.properties.mars_sol)) {
      this.setState({
        roverPhotos: await fetchRoverPhotos(
          this.context,
          this.properties.nasa_api_key,
          this.properties.nasa_rover,
          this.properties.mars_sol)
      });
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AceImageViewer-property-pane'*/
      './AceImageViewerPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceImageViewerPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties.nasa_rover);
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'nasa_rover' && newValue !== oldValue) {
      (async () => {
        this.setState({ roverPhotos: await fetchRoverPhotos(
          this.context,
          this.properties.nasa_api_key,
          newValue,
          this.properties.mars_sol)
        });
      })
    }

    if (propertyPath === 'mars_sol' && newValue !== oldValue) {
      (async () => {
        this.setState({ roverPhotos: await fetchRoverPhotos(
          this.context,
          this.properties.nasa_api_key,
          this.properties.nasa_rover,
          newValue)
        });
      })
    }
  }
  
}
