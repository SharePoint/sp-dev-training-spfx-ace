import {
  IActionArguments,
  ISPFxAdaptiveCard,
  BaseAdaptiveCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  QUICK_VIEW_CANCEL_TRIP_REGISTRY_ID
} from '../CampusShuttleAdaptiveCardExtension';

import {
  STATUS_HIRED,
  upsertListItem
} from '../sp.service';

export interface IUpdateTripData {
  title: string;
}

export class UpdateTrip extends BaseAdaptiveCardView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  IUpdateTripData
> {
  public get data(): IUpdateTripData {
    return {
      title: 'Update the existing trip'
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/UpdateTripCard.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type !== 'Submit') { return; }

    switch (action.id) {
      case 'cancel':
        // TODO QuickView cancelTrip
        break
      case 'pickup':
        // update current item status
        const trip = this.state.currentTrip;
        trip.Status = STATUS_HIRED;

        // save to list
        (async () => {
          await upsertListItem(this.context, this.properties.listId, trip);
        })();

        // update ACE
        this.setState({ currentTrip: trip });

        this.quickViewNavigator.close();
        break
      default:
        return;
    }
  }

}
