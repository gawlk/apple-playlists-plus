import {
    createClient as createClientVillus,
    useClient as useClientVillus,
    defaultPlugins,
} from 'villus'

const url = 'https://graphql.fauna.com/graphql'

function authPlugin({ opContext }) {
    opContext.headers.Authorization = `Bearer fnAD6u4XpvACAjur4Q02kt-SUVZSPOrpc72HcCNb`
}

export const createClient = () =>
    createClientVillus({
        url,
        use: [authPlugin, ...defaultPlugins()],
    })

export const useClient = () =>
    useClientVillus({
        url,
        use: [authPlugin, ...defaultPlugins()],
    })
