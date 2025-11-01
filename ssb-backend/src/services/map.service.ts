import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class MapService {
  private client = new Client({});

  async getDistance(origin: string, destination: string) {
    const res = await this.client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });
    return res.data.rows[0].elements[0];
  }

  async getGeocode(address: string) {
    const res = await this.client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });
    return res.data.results[0];
  }
}
