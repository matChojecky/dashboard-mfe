import React, { useEffect, useState } from 'react'
import { getAirQualityData } from './api/air_polution';



export default function App() {
    const [airQ, setAirData] = useState(null);
    useEffect(() => {
        getAirQualityData().then(data => {
            console.log({data});
            setAirData(data);
        });
    }, [setAirData]);
    return airQ ? (
        <div>
            {JSON.stringify(airQ, null, 4)}
        </div>
    ) : (
        <div>
            This is air polution widget!!!
        </div>
    );
}