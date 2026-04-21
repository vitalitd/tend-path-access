/**
 * Route geometry for permitted paths within a property.
 *
 * Placeholder module — route geometry is not part of the MVP. When ready,
 * this will serve the marked paths a visitor may follow inside a parcel,
 * along with any seasonal closures or sensitive sections to avoid.
 *
 * Treat route data as safety-critical: prefer omission over a guessed line.
 */

import type { LatLng } from "./boundaries";

export type RouteGeometry = {
  propertyId: string;
  /** Ordered list of points forming the recommended path. */
  path: LatLng[];
  /** Optional human note shown alongside the route. */
  note?: string;
};

/**
 * Fetch route geometries for a property.
 * Returns an empty list until route data is wired up.
 */
export async function getRoutes(_propertyId: string): Promise<RouteGeometry[]> {
  return [];
}
