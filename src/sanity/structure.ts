import { StructureBuilder, structureTool } from 'sanity/structure'
import { VscServerProcess } from 'react-icons/vsc'
import { singleton } from './lib/builders'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export default structureTool({
	structure: (S: StructureBuilder) =>
		S.list()
			.title('Content')
			.items([
				S.divider().title('Global'),
				singleton(S, 'site').title('Site').icon(VscServerProcess),

				S.divider().title('Core Pages'),
				singleton(S, 'homePage').title('Home Page'),
				singleton(S, 'ourHomesPage').title('Our Homes Page'),
				singleton(S, 'altWayPage').title('The Alt Way Page'),
				singleton(S, 'experiencesPage').title('Experiences Page'),
				singleton(S, 'joinUsPage').title('Join Us Page'),
				singleton(S, 'contactPage').title('Contact Page'),
				S.documentTypeListItem('legalPage').title('Legal Pages'),

				S.divider().title('Properties & Experiences'),
				S.documentTypeListItem('property').title('Properties'),
				S.documentTypeListItem('amenity').title('Amenities'),
				S.documentTypeListItem('experience').title('Experiences'),
				S.documentTypeListItem('review').title('Reviews'),

				S.divider().title('Blog'),
				S.documentTypeListItem('blog.post').title('Posts'),

				S.divider().title('Settings'),
				S.documentTypeListItem('redirect').title('Redirects'),
			]),
})
