import { Map } from 'maplibre-gl';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import 'maplibre-gl/dist/maplibre-gl.css';
import './map-container.scss';

// @ts-ignore
import mapStyle from './style.json';

type MapState = {
    position: [number, number];
    zoom: number;
};

class MapController {
    private viewport: HTMLElement;
    private map: Map;
    private stateSaveInterval: number;

    constructor(viewport: HTMLElement) {
        this.viewport = viewport;

        const state = this.loadInitialState();
        this.map = new Map({
            container: this.viewport,
            style: mapStyle,
            center: state.position,
            zoom: state.zoom,
            attributionControl: false
        });
        setTimeout(() => {
            this.map.addSource('test', {
                type: 'geojson',
                data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
            });
            this.map.addLayer({
                id: 'test',
                source: 'test',
                type: 'fill',
                paint: {
                    'fill-color': '#000000',
                    'fill-opacity': 0.5
                }
            });
        }, 2000);

        this.stateSaveInterval = setInterval(() => this.saveState(), 500);
    }

    private loadInitialState(): MapState {
        const defaultState: MapState = { position: [-125.99244133012377, 50.16138530590419], zoom: 6.296254677886492 };
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
        clearInterval(this.stateSaveInterval);
    }
}

export const MapContainer = () => {
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
    const [map, setMap] = useState<MapController | null>(null);

    useEffect(() => {
        if (!viewport) return;

        const map = new MapController(viewport);
        setMap(map);

        return () => map.cleanup();
    }, [viewport]);

    return (
        <div class="map">
            <div ref={ setViewport } class="viewport" />
        </div>
    );
};
