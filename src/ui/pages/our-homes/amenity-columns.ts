type Amenity = { name: string | null; icon: string | null }

export function splitAmenityColumns(
  amenities: Amenity[],
): [Amenity[], Amenity[], Amenity[]] {
  const capped = amenities.slice(0, 27)
  return [capped.slice(0, 9), capped.slice(9, 18), capped.slice(18, 27)]
}
