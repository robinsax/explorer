import { Map, StyleSpecification } from 'maplibre-gl';

import { AuthHandler } from '../logic/auth-handler';
import { POIModel } from '../models';

const baseMapStyle: StyleSpecification = {
    version: 8,
    sources: {
        maplibre: {
            url: 'https://demotiles.maplibre.org/tiles/tiles.json',
            type: 'vector'
        },
        custom: {
            type: 'vector',
            url: 'http://localhost:8080/data/default.json'
        },
        pois: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        }
    },
    layers: [
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#5ed3fd'
            },
            layout: {
                visibility: 'visible'
            },
            maxzoom: 24
        },
        {
            id: 'countries-fill',
            type: 'fill',
            paint: {
                'fill-color': '#2f7150'
            },
            layout: {
                visibility: 'visible'
            },
            source: 'maplibre',
            maxzoom: 24,
            'source-layer': 'countries'
        },
        {
            id: 'test',
            type: 'fill',
            paint: {
                'fill-color': '#ff0000'
            },
            layout: {
                visibility: 'visible'
            },
            source: 'custom',
            maxzoom: 24,
            'source-layer': 'park'
        },
    ]
};

export type MapState = {
    position: [number, number];
    zoom: number;
};

export class MapController {
    private viewport: HTMLElement;
    private authHandler: AuthHandler;
    private map: Map;

    constructor(authHandler: AuthHandler, viewport: HTMLElement) {
        this.authHandler = authHandler;
        this.viewport = viewport;

        const state = this.loadInitialState();
        this.map = new Map({
            container: this.viewport,
            style: baseMapStyle,
            center: state.position,
            zoom: state.zoom,
            attributionControl: false
        });
        this.map.on('moveend', () => this.handleMoveEnd());

        (window as any).mapController = this;
    }

    private loadInitialState(): MapState {
        const defaultState: MapState = { position: [0, 0], zoom: 1 };
        if (!localStorage.getItem('map_state')) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.updateState({
                    position: [position.coords.longitude, position.coords.latitude],
                    zoom: defaultState.zoom
                });
            });

            return defaultState;
        }

        try {
            return JSON.parse(localStorage.getItem('map_state') as string) as MapState;
        } catch (e) {
            return defaultState;
        }
    }

    private async fetchPOIs() {
        const pois = await this.authHandler.apiCall<POIModel[]>({
            path: '/pois',
            method: 'get',
            query: {
                bounds: this.map.getBounds().toArray().join(',')
            }
        });

        // @ts-expect-error setData does not exist on type 'Source'
        this.map.getSource('pois')?.setData({
            type: 'FeatureCollection',
            features: pois.map(poi => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: poi.location
                },
                properties: poi
            }))
        });
    }

    private handleMoveEnd() {
        this.saveState();
        this.fetchPOIs();
    }

    private saveState() {
        const state: MapState = {
            position: this.map.getCenter() as unknown as [number, number],
            zoom: this.map.getZoom()
        };

        localStorage.setItem('map_state', JSON.stringify(state));
    }

    updateState(state: MapState) {
        this.saveState();
        this.map.setCenter(state.position, { animate: true });
        this.map.setZoom(state.zoom, { animate: true });
    }

    cleanup() {
        this.map.remove();
    }
}
