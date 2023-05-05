'use client'

import { useState, useRef } from 'react';

// Comps
import BdgOperations from './BdgOperations';
import ADSMap from './ADSMap';
import AddressSearch from '@/components/AddressSearch'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';

// Contexts
import { AdsContext } from './AdsContext';
import { MapContext } from '@/components/MapContext';

// Logic
import AdsEditing from '@/logic/ads';
import BuildingsMap from '@/logic/map';

// DSFR and styles
import styles from './ADSForm.module.css'


export default function ADSForm({ data, isNewAds, defaultCity }) {

    //////////////
    // Contexts

    // ADS
    const editingState = {
            data: data
    }
    let ads = new AdsEditing(editingState)
    const [ctx, setCtx] = useState(ads);

    // Map
    let bdgmap = new BuildingsMap({
        position: {
            center: null,
            zoom: null
        }
    })
    const [mapCtx, setMapCtx] = useState(bdgmap)

    ////////////// 
    // Starting values
    const init_issue_number = useRef(editingState.data.issue_number ? editingState.data.issue_number.slice() : "") // slice() to clone the string

    let city = null
    if (defaultCity) {
        city = {
            "value": defaultCity.code_insee,
            "label": defaultCity.name
        }
    }


    const dummyOpts = [
  { value: '38185', label: 'Grenoble' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

    const getActionURL = () => {
        if (isNewAds) {
            return process.env.NEXT_PUBLIC_API_BASE + '/ads/'
        } else {
            return process.env.NEXT_PUBLIC_API_BASE + '/ads/' + init_issue_number.current + "/"
        }
    }

    const getActionMethod = () => {
        if (isNewAds) {
            return 'POST'
        } else {
            return 'PUT'
        }
    }

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        ads.state.data[name] = value
        setCtx(ads.clone())
    }

    const handleCitySelectChange = (choice) => {
        ads.state.data["insee_code"] = choice.value
        setCtx(ads.clone())
    }


    const submitForm = async (e) => {

        e.preventDefault();

        const url = getActionURL()
        const method = getActionMethod()

        const res = await fetch(url, {
            cache: 'no-cache',
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 3d4dbc70f60d0666fbd8ead6df4eb0c3fcf376bf',
            },
            body: JSON.stringify(ctx.state.data)
        })
        const data = await res.json()

        return

    }

    const searchCities = async (inputValue: string) => {

        const url = new URL(process.env.NEXT_PUBLIC_API_BASE + '/cities/')
        url.searchParams.set('q', inputValue);

        return new Promise((resolve, reject) => {

            fetch(url)
            .then(response => response.json())
            .then(data => {
                const options = data.results.map(d => ({
                    "value": d.code_insee,
                    "label": d.name
                }))
                resolve(options)
            })
            .catch(err => {
                reject(err)
            })

        })

    }

    return (
        <MapContext.Provider value={[mapCtx, setMapCtx]}>
            <AdsContext.Provider value={[ctx, setCtx]}>


                <div className={styles.grid}>
                    <div className={styles.formCol}>
                        <form onSubmit={submitForm}>


                            <div className="fr-input-group">

                                <label
                                    className="fr-label"
                                    htmlFor="issue_number">Numéro d&apos;ADS</label>
                                <input
                                    className="fr-input"
                                    type="text"
                                    name="issue_number"
                                    id="issue_number"
                                    value={ctx.issue_number}
                                    onChange={handleInputChange}
                                />

                            </div>
                            <div className="fr-input-group">
                                <label className="fr-label" htmlFor="issue_date">Date d&apos;émission</label>
                                <input
                                    className="fr-input"
                                    type="date"
                                    name="issue_date"
                                    id="issue_date"
                                    value={ctx.issue_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="fr-input-group">
                                <label className="fr-label" htmlFor="insee_code">Ville</label>
                                
                                  <AsyncSelect 
                                  name="insee_code"
                                defaultValue={city}
                                  onChange={handleCitySelectChange}
                                  loadOptions={searchCities}
                                  loadingMessage={() => "Chargement..."}
                                  noOptionsMessage={(e) => {
                                        if (e.inputValue.length > 0) {
                                            return "Aucune ville trouvée"
                                        }
                                        return "Chercher par nom ou code INSEE"
                                        
                                  }}
                                  placeholder="Aucun ville séléctionnée"
                                  />

                            </div>

                            <div>

                                <BdgOperations />
                            </div>

                            <div className="fr-my-10v">
                                <button className='fr-btn' type="submit">Enregistrer</button>
                            </div>


                        </form>
                    </div>
                    <div className={styles.mapCol}>
                        <div className={styles.mapShell}>
                            <div className={styles.addresseSearchShell}>
                                <AddressSearch />
                            </div>
                            <ADSMap />
                        </div>
                    </div>
                </div>

            </AdsContext.Provider>
        </MapContext.Provider>
    )

}