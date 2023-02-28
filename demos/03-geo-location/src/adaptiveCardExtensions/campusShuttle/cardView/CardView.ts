import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CampusShuttleAdaptiveCardExtensionStrings';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  QUICK_VIEW_START_TRIP_REGISTRY_ID,
  QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID,
  QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID
} from '../CampusShuttleAdaptiveCardExtension';

import {
  ILocation,
  STATUS_AVAILABLE,
  STATUS_ENROUTE,
  STATUS_HIRED
} from '../sp.service';

export class CardView extends BasePrimaryTextCardView<ICampusShuttleAdaptiveCardExtensionProps, ICampusShuttleAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    switch (this.state.currentTrip.Status) {
      case STATUS_AVAILABLE:
        return [{
          title: 'Book a Trip',
          action: {
            type: 'QuickView',
            parameters: { view: QUICK_VIEW_START_TRIP_REGISTRY_ID }
          }
        }];
        break;
      case STATUS_ENROUTE:
        return [
          {
            title: 'View pickup location',
            action: {
              type: 'VivaAction.ShowLocation',
              parameters: {
                locationCoordinates: {
                  latitude: (this.state.currentTrip.OriginLocation as ILocation).latitude,
                  longitude: (this.state.currentTrip.OriginLocation as ILocation).longitude
                }
              }
            }
          },
          {
            title: 'Update Trip',
            action: {
              type: 'QuickView',
              parameters: { view: QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID }
            }
          }
        ];
        break;
      case STATUS_HIRED:
        return [
          {
            title: 'View dropoff location',
            action: {
              type: 'VivaAction.ShowLocation',
              parameters: {
                locationCoordinates: {
                  latitude: (this.state.currentTrip.DestinationLocation as ILocation).latitude,
                  longitude: (this.state.currentTrip.DestinationLocation as ILocation).longitude
                }
              }
            }
          },
          {
            title: 'Complete Trip',
            action: {
              type: 'QuickView',
              parameters: { view: QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID }
            }
          }
        ];
        break;
      default:
        return undefined;
        break;
    }
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: strings.PrimaryText,
      description: (this.state.currentTrip.Status === STATUS_AVAILABLE)
        ? `available for hire`
        : (this.state.currentTrip.Status === STATUS_ENROUTE)
          ? `Booked - ${STATUS_ENROUTE} to pickup...`
          : (this.state.currentTrip.DestinationName)
            ? `Hired - driving passenger to ${this.state.currentTrip.DestinationName}...`
            : `Hired - driving passenger to destination...`,
      title: this.properties.title
    };
  }

  public get on
}
