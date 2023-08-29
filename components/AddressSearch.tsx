// Context
import {MapContext} from '@/components/MapContext'
import { useContext, useRef, useEffect } from 'react';

// Bus
import Bus from '@/utils/Bus';

// Store
import { useDispatch, useSelector } from "react-redux";
import { setMoveTo } from '@/stores/map/slice';

export default function AddressSearch() {


    // State
    const moveTo = useSelector((state) => state.moveTo)
    const dispatch = useDispatch()

    const apiUrl = 'https://api-adresse.data.gouv.fr/search/'
    const [mapCtx, setMapCtx] = useContext(MapContext)
    const addressInput = useRef(null)

    const handleKeyDown = async (e) => { 

        if (e.key === 'Enter') {

            console.log('Enter on address')

            e.preventDefault();
            const geocode_result = await geocode(addressInput.current.value);

            if (geocode_result.features.length > 0) {


                const best_point = geocode_result.features[0]

                const position = featureToPosition(best_point)
                dispatch(setMoveTo(position))
                mapCtx.data.position = position
                setMapCtx(mapCtx.clone())

                Bus.emit('address:search', {
                    search: geocode_result
                })
            }
        }

        
        

    }

    const featureToPosition = (feature: any) => {

        const mapPosition = {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
            zoom: 17
        }

        if (feature.properties.type == "municipality") {
            mapPosition.zoom = 13
          }
          if (feature.properties.type == "housenumber") {
            mapPosition.zoom = 18
          }
          return mapPosition

    }

    const geocode = async (query: string) => {

        let best_point = null;
        return await fetchBanAPI(query);

    }
    const fetchBanAPI = async (query) => {

        let query_url = new URL(apiUrl);
        query_url.searchParams.set('q', query);

        return new Promise((resolve, reject) => {

            fetch(query_url)
                .then(response => response.json())
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })

    }

    

    return (
        <>
        <input 
        className="fr-input" 
        placeholder='ex : 1 rue de la paix, Paris'
        type="text" 
        autoComplete='off'
        name="address" 
        id="address"
        ref={addressInput}
        onKeyDown={handleKeyDown}
         />
        
        </>
    )

}