/**
 * Boundary paths for properties.
 *
 * Placeholder module — boundary geometry is not part of the MVP. When ground
 * is ready, this module will load and serve polygon paths (GeoJSON) that
 * trace the edge of each parcel, so visitors can see where they may walk
 * and where they must not.
 *
 * Keep changes here cautious: a wrong boundary in production could send
 * someone across a neighbour's land.
 */

export type LatLng = { lat: number; lng: number };

/** A closed polygon describing the outer edge of a property. */
export type BoundaryPath = {
  propertyId: string;
  /** Ordered ring of points; first and last point are equal. */
  ring: LatLng[];
};

/**
 * Fetch the boundary path for a property.
 * Returns null until boundary data is wired up.
 */
export async function getBoundaryPath(_propertyId: string): Promise<BoundaryPath | null> {
  return null;
}
