import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CampusShuttleAdaptiveCardExtensionStrings';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  QUICK_VIEW_SET_ORIGIN_REGISTRY_ID,
  QUICK_VIEW_SET_DESTINATION_REGISTRY_ID,
  QUICK_VIEW_SAVE_TRIP_REGISTRY_ID
} from '../CampusShuttleAdaptiveCardExtension';

import { IListItem, upsertListItem } from '../sp.service';

export interface IStartTripData {
  title: string;
  trip: IListItem;
}

export class StartTrip extends BaseAdaptiveCardView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  IStartTripData
> {

  public get data(): IStartTripData {
    return {
      title: strings.Title,
      trip: this.state.currentTrip
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/StartTripCard.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      if (action.data.tripType) {
        const trip = this.state.currentTrip;
        trip.Status = action.data.tripType;
        this.setState({ currentTrip: trip });
      }

      if (action.id === 'originLocation') {
        this.quickViewNavigator.push(QUICK_VIEW_SET_ORIGIN_REGISTRY_ID);
      } else if (action.id === 'destinationLocation') {
        this.quickViewNavigator.push(QUICK_VIEW_SET_DESTINATION_REGISTRY_ID);
      } else if (action.id === 'save') {
        (async () => {
          await upsertListItem(this.context, this.properties.listId, this.state.currentTrip);
          this.quickViewNavigator.push(QUICK_VIEW_SAVE_TRIP_REGISTRY_ID);
        })();
      }
    }
  }

}
