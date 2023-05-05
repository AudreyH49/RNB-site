import ADSForm from '@/components/ADSForm'
import Link from 'next/link'

async function fetchADSDetail(issue_number: string) {

    const url = process.env.NEXT_PUBLIC_API_BASE + '/ads/' + issue_number
    const res = await fetch(url, {cache: 'no-cache'})
    const data = await res.json()
    return data
}

async function fetchCity(insee_code: string) {

    const url = process.env.NEXT_PUBLIC_API_BASE + '/cities/' + insee_code
    const res = await fetch(url, {cache: 'no-cache'})
    const data = await res.json()
    return data

}

export default async function ADSDetail({params}: any) {

    const ads = await fetchADSDetail(params.issue_number)
    const city = await fetchCity(ads.insee_code)
    const isNewAds = false


    return (
        <>
        <p><Link href={`/ads`}>&larr; retour</Link></p>
        <h1>{ads.issue_number}</h1>
        <ADSForm data={ads} isNewAds={isNewAds} defaultCity={city} />
        </>
    )
}