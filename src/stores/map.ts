import { defineStore } from 'pinia'
import { useGeolocation } from '@vueuse/core'
import marker_icon from '@/assets/img/geoloc/marker_6.png'
import user_icon_url from '@/assets/img/geoloc/user.png'

type simple_coords = [number, number]

interface Leaflet {
  map: typeof import('leaflet')['map']
  tileLayer: typeof import('leaflet')['tileLayer']
  Icon: typeof import('leaflet')['Icon']
  marker: typeof import('leaflet')['marker']
}

interface MarkerData {
  coordinates: simple_coords
  popupDescription: string
}

let leaflet: Promise<Leaflet> | undefined

if (typeof window !== 'undefined')
  leaflet = import('leaflet').then(module => module)

export const use_map_store = defineStore('use_map_store', () => {
  const map_leaf: any = ref({})
  const markers: Ref<MarkerData[]> = ref([])
  const bounds: any = ref({})
  const markersOnMap: Ref<MarkerData[]> = ref([])
  const mapIsLoaded = ref(false)
  const tileLayerIsLoaded = ref(false)
  const markerIsLoaded = ref(false)
  const markerIsClick = ref(false)
  const user_coords: any = ref()

  const getPinsOnMap = computed(() => {
    if (bounds.value)
      return markers.value.filter(marker => bounds.value.contains(marker.coordinates))
  })

  async function addMap(id: string, viewLngLat: simple_coords, zoom: number) {
    if (!leaflet)
      return
    const { map } = await leaflet
    map_leaf.value = map(id)
      .on('load', () => {
        mapIsLoaded.value = true
      })
      .on('move', () => {
        if (markerIsLoaded.value === true) {
          bounds.value = map_leaf.value.getBounds()
          if (markers.value.length)
            markersOnMap.value = markers.value.filter(marker => map_leaf.value.getBounds().contains(marker.coordinates))
        }
      })
      .setView(viewLngLat, zoom)
  }

  async function addTileLayer(mapUrl: string, maxZoom: number, attribution: string) {
    if (!leaflet)
      return
    const { tileLayer } = await leaflet
    tileLayer(mapUrl, {
      maxZoom,
      attribution,
    })
      .addTo(map_leaf.value)
      .on('load', () => {
        tileLayerIsLoaded.value = true
      })
  }

  async function addMarker(lngLat: simple_coords, popupDescription: string) {
    if (!leaflet)
      return
    const { Icon, marker } = await leaflet
    const customIcon = new Icon({
      iconUrl: marker_icon,
      iconSize: [20, 32],
      iconAnchor: [20, 32],
      popupAnchor: [0, -32],
    })

    marker(lngLat, { icon: customIcon })
      .addTo(map_leaf.value)
      .bindPopup(popupDescription)
      .on('click', () => {
        markerIsClick.value = true
      })
    markerIsLoaded.value = true
    bounds.value = map_leaf.value.getBounds()

    // add marker on store
    markers.value.push({
      coordinates: lngLat,
      popupDescription,
    } as unknown as MarkerData)
  }

  // ne fait que centrer la carte sur l'utilisateur en l'état
  async function locate_user() {
    const { coords, resume } = useGeolocation()
    resume()
    console.log('1', coords.value)
    if (!coords.value || !coords.value.latitude || !coords.value.longitude)
      return

    if (!leaflet)
      return
    const { Icon, marker } = await leaflet

    const customIcon = new Icon({
      iconUrl: user_icon_url,
      iconSize: [20, 32],
      iconAnchor: [20, 32],
      popupAnchor: [0, -32],
    })

    console.log('2', coords.value)
    map_leaf.value.locate({ setView: true, maxZoom: 16 })

    map_leaf.value.on('locationfound', (event: any) => {
      const { latitude, longitude } = event.latlng
      const lngLat: simple_coords = [latitude, longitude]
      console.log('3', lngLat)
      marker(lngLat, { icon: customIcon })
        .addTo(map_leaf.value)
        .bindPopup('C\'est vous !')
        .on('click', () => {
          markerIsClick.value = true
        })
      markerIsLoaded.value = true
    })

    map_leaf.value.on('locationerror', (error: any) => {
      console.error('Error getting user location:', error)
    })
  }

  return { map_leaf, markers, bounds, markersOnMap, mapIsLoaded, tileLayerIsLoaded, markerIsLoaded, markerIsClick, getPinsOnMap, addMap, addTileLayer, addMarker, locate_user, user_coords }
})