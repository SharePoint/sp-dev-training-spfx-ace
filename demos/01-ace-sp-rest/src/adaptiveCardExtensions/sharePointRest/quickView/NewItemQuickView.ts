import {
  ISPFxAdaptiveCard,
  BaseAdaptiveCardView,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
} from '../SharePointRestAdaptiveCardExtension';
import {
  fetchListItems,
  addListItem
} from '../sp.service';

export interface INewItemQuickView { }

export class NewItemQuickView extends BaseAdaptiveCardView<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
  NewItemQuickView
> {

  public get data(): NewItemQuickView {
    return undefined;
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/NewItemQuickView.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      (async () => {
        // save item
        await addListItem(
          this.context,
          this.properties.listId,
          action.data.title,
          action.data.description
        );

        // refresh items
        this.setState({ listItems: await fetchListItems(this.context, this.properties.listId) });

        // remove quickview
        this.quickViewNavigator.close();
      })();
    }
  }

}
