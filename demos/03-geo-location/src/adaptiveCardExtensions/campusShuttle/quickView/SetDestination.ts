import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardView,
  IActionArguments,
  IGetLocationActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
} from '../CampusShuttleAdaptiveCardExtension';

import { ILocation, IListItem } from '../sp.service';

import { sortBy } from '@microsoft/sp-lodash-subset';

interface ICampusLocations {
  title: string;
  latitude: number;
  longitude: number;
}

export interface ISetDestinationData {
  title: string;
  description: string;
  campus_locations: ICampusLocations[];
  trip: IListItem;
}

const LOCATIONS = require('../assets/campus_locations.json');

export class SetDestination extends BaseAdaptiveCardView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  ISetDestinationData
> {
  public get data(): ISetDestinationData {
    return {
      title: 'Set trip destination location',
      description: 'Pick from a list of known locations, or set the destination by selecting it on the map.',
      campus_locations: sortBy(LOCATIONS, (l) => l.title),
      trip: this.state.currentTrip
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SetDestinationCard.json');
  }

  public onAction(action: IActionArguments | IGetLocationActionArguments): void {
    const currentTrip = this.state.currentTrip;

    // if picked a location on the map...
    if (action.type === 'VivaAction.GetLocation') {
      currentTrip.DestinationLocation = <ILocation>{
        latitude: action.location.latitude,
        longitude: action.location.longitude
      };
      this.setState({ currentTrip: currentTrip });
    } else if (action.type === 'Submit' && action.id === 'save') {
      // else, check if picked location from dropdown & save it
      if (action.data.knownDestinationSelection) {
        currentTrip.DestinationLocation = <ILocation>{
          latitude: Number(action.data.knownDestinationSelection.split(',')[0]),
          longitude: Number(action.data.knownDestinationSelection.split(',')[1])
        };

       const selectedLocation = LOCATIONS.filter((knownLocation: any) => (
          knownLocation.latitude === (currentTrip.DestinationLocation as ILocation).latitude
          && knownLocation.longitude === (currentTrip.DestinationLocation as ILocation).longitude
        ))[0];
        currentTrip.DestinationName = selectedLocation.title;
      }
      this.setState({ currentTrip: currentTrip });
      this.quickViewNavigator.pop();
    }
  }

}
