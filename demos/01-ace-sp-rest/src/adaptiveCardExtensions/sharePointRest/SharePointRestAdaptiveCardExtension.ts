import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { SharePointRestPropertyPane } from './SharePointRestPropertyPane';
import {
  fetchListItems,
  fetchListTitle,
  IListItem
} from './sp.service';
import { NewItemQuickView } from './quickView/NewItemQuickView';

export interface ISharePointRestAdaptiveCardExtensionProps {
  title: string;
  listId: string;
}

export interface ISharePointRestAdaptiveCardExtensionState {
  listTitle: string;
  listItems: IListItem[];
  currentIndex: number;
}

const CARD_VIEW_REGISTRY_ID: string = 'SharePointRest_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'SharePointRest_QUICK_VIEW';
export const NEW_ITEM_QUICK_VIEW_REGISTRY_ID: string = 'SharePointRestCrud_NEW_ITEM_QUICK_VIEW';

export default class SharePointRestAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SharePointRestPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      currentIndex: 0,
      listTitle: '',
      listItems: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(NEW_ITEM_QUICK_VIEW_REGISTRY_ID, () => new NewItemQuickView());

    if (this.properties.listId) {
      Promise.all([
        this.setState({ listTitle: await fetchListTitle(this.context, this.properties.listId) }),
        this.setState({ listItems: await fetchListItems(this.context, this.properties.listId) })
      ]);
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SharePointRest-property-pane'*/
      './SharePointRestPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SharePointRestPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'listId' && newValue !== oldValue) {
      if (newValue) {
        (async () => {
          this.setState({ listTitle: await fetchListTitle(this.context, newValue) });
          this.setState({ listItems: await fetchListItems(this.context, newValue) });
        })();
      } else {
        this.setState({ listTitle: '' });
        this.setState({ listItems: [] });
      }
    }
  }

}
