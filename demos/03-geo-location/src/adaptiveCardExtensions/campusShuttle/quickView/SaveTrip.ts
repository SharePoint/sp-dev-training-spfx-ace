import {
  BaseAdaptiveCardView,
  IActionArguments,
  ISPFxAdaptiveCard
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
} from '../CampusShuttleAdaptiveCardExtension';

export interface ISaveTripData {
  title: string;
}

export class SaveTrip extends BaseAdaptiveCardView<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState,
  ISaveTripData
> {
  public get data(): ISaveTripData {
    return {
      title: 'Trip saved successfully.'
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/SaveTripCard.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id === 'close') {
      this.quickViewNavigator.close();
    }
  }

}
