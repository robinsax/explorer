import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { useAuth } from '../contexts';
import { MapController } from './map-controller';

import 'maplibre-gl/dist/maplibre-gl.css';
import './map-container.scss';

export const MapContainer = () => {
    const [user, authHandler] = useAuth();
    const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
    const [mapController, setMapController] = useState<MapController | null>(null);

    useEffect(() => {
        if (!viewport) return;

        const map = new MapController(authHandler, viewport);
        setMapController(map);

        return () => map.cleanup();
    }, [viewport]);

    return (
        <div class="map">
            <div ref={ setViewport } class="viewport" />
        </div>
    );
};
