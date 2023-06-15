export type CafeTag =
	| 'Barista'
	| 'Calme'
	| 'Phone Booth'
	| 'Gourmand'
	| 'Végétarien'
	| 'Wifi'
	| 'Prises'
	| 'Dépaysant'
	| 'Comfy'
	| 'Etage isolé'
	| 'Gourmandises'
	| 'Salé'
	| 'Restaurant'
	| 'Bar'
	| 'Bistrot'
	| 'Café'
	| 'Brasserie'
	| 'Salon de thé'
	| 'Coworking'
	| 'Animé'
	| 'A Vérifier'
	| 'Gratuit'
	| 'Autre lieu'
	| 'Tiers lieu'
	| 'Hôtel'
	| 'Bon marché'
	| 'Abordable'
	| 'Haut de gamme'
	| 'Top rated'
	| 'Alcool'
	| 'Déjeuner'
	| 'Diner'
	| 'Ambiance à vérifier'
	| 'Partenaire'
	| 'CB dès 0€'
	| 'Studieux'

export type PlaceType =
	| 'Café'
	| 'Bar'
	| 'Bistrot'
	| 'Restaurant'
	| 'Brasserie'
	| 'Autre lieu'
	| 'Coworking'
	| 'A Vérifier'
	| 'Tiers lieu'
	| 'Hôtel'

export interface AwsPics {
	url: string
	dimensions?: {
		width: number
		height: number
	}
}

export interface PlacePicture {
	full: {
		url: string
		width: number
		height: number
	}
	medium: {
		url: string
		width: number
		height: number
	}
	thumbnail: {
		url: string
		width: number
		height: number
	}
}

export interface Place {
	id: number
	nom: string
	tags: CafeTag[]
	type?: PlaceType
	events?: Session[]
	website?: string
	location: {
		data: {
			lat: number
			lng: number
		}
	}
	adresse: string
	ambiance: 'Vivant' | 'Calme' | 'Studieux' | 'A Vérifier'
	metro: string
	desc: string
	google_disp_formatted: any // Assuming it is a JSON object
	google_disp: any // Assuming it is a JSON object
	nb_prises: number
	wifi: 'Bon' | 'Très bon' | 'Excellent' | 'Pas de Wifi' | 'A Vérifier'
	prix_expresso?: string
	gamme: number
	minimum_cb?: number
	nom_contact?: string
	email?: string
	telephone?: string
	aws_miniatures: AwsPics[]
	aws_pics: AwsPics[]
	created_at?: Date
	etage_isole?: boolean
	legit: boolean
	acces_wifi?: string
	source: string
	miniatures: {
		url: string
	}[]
	pics: {
		url: string
	}[]
	nourriture?: {
		vegetarien: boolean
		dejeuner: boolean
		diner: boolean
		gourmandises?: boolean
	}
	alcool?: boolean
	google_place_id: string
	google_rating?: number
	commentaires_id?: number
	google_pics: {
		pic_id: string
	}[]
	disabled?: boolean
	pricing?: string
	public_phone?: string
	distance?: number
	is_open: boolean
	attendance?: number
	attendees?: User[]
	our_fav: boolean
	pictures: PlacePicture[]
}

export interface Club {
	id?: number
	nom: string
	user_id?: [number]
	private?: boolean
	uuid: string
	pic?: string
	display_pic_in_clubs?: boolean
	display_name_in_clubs?: boolean
	premium: boolean
	type: 'roles' | 'domain' | 'user' | 'tech'
}

interface User {
	is_auth?: boolean
	clubs_uuid?: Array<string>
	bio?: string
	domaine?: string
	email?: string
	family_name?: string
	first_name?: string
	highlighted_pins?: Array<number>
	highlighted_users?: Array<number>
	id?: number | null
	user_id?: number | null
	incognito?: boolean | null
	is_inboarded?: boolean | null
	job_title?: string
	open_to_afterwork?: boolean | null
	open_to_lunch?: boolean | null
	open_to_pause?: boolean | null
	pic_medium?: string
	pic_small?: string
	pic_xsmall?: string
	role?: string
	type?: string
	clubs?: Club[]
}

export interface Session {
	id: number
	event_id: number
	created_at: Date
	user_id: User[]
	coffee_id: number
	jour: Date
	creneau: 'Matin' | 'Après midi' | 'Fermé' | 'Soir'
	horaires_string: string
	start: Date
	end: Date
	in_current_slot?: boolean
	relative_to_now?: string
}

export interface Attendance {
	attendance: number
	attendees: User[]
	place_id: number
	events: Session[]
}

export interface Message {
	id: number
	message: string
	user_id: number
	created_at?: Date
	user_id?: number
	coffee_id?: number
	club_id?: number
	club_uuid?: string
	receiver_id?: number
	user?: User
	receiver?: User
}

export interface Conversation {
	contact: User
	messages: (Message )[]
}
