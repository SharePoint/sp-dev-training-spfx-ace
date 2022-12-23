import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import * as strings from 'AceImageViewerAdaptiveCardExtensionStrings';

export class AceImageViewerPropertyPane {
  public getPropertyPaneConfiguration(selectedRover: string = 'curiosity'): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('nasa_api_key', {
                  label: 'NASA API key'
                }),
                PropertyPaneDropdown('nasa_rover', {
                  label: 'NASA Mars rover',
                  options: [
                    { index: 0, key: 'curiosity', text: 'Curiosity' },
                    { index: 1, key: 'opportunity', text: 'Opportunity' },
                    { index: 2, key: 'spirit', text: 'Spirit' }
                  ],
                  selectedKey: selectedRover
                }),
                PropertyPaneTextField('mars_sol', {
                  label: 'Display photos from Mars day (Sol)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
