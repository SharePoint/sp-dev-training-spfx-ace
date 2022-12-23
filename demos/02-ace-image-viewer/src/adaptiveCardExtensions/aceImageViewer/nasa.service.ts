import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { HttpClient } from '@microsoft/sp-http';

export interface IMarsRoverCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface IMarsRoverVehicle {
  id: number;
  name: string;
  landing_date: Date;
  launch_date: Date;
  status: string;
}

export interface IMarsRoverPhoto {
  id: number;
  sol: number;
  camera: IMarsRoverCamera;
  rover: IMarsRoverVehicle;
  img_src: string;
  earth_date: Date;
}

export const fetchRoverPhotos = async (
  spContext: AdaptiveCardExtensionContext,
  apiKey: string,
  rover: string,
  mars_sol: number): Promise<IMarsRoverPhoto[]> => {
  const results: { photos: IMarsRoverPhoto[] } = await (
    await spContext.httpClient.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${mars_sol}&page=1&api_key=${apiKey}`,
      HttpClient.configurations.v1
    )
  ).json();

  return Promise.resolve(results.photos);
}
