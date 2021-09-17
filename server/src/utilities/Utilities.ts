import { DateTime } from 'neo4j-driver';

export class Utilities {
  public static neo4jDateTimeToDateObject({
    year,
    month,
    day,
    hour,
    minute,
    second,
    nanosecond,
  }: DateTime): Date {
    return new Date(
      `${year.toNumber()}-${month
        .toNumber()
        .toString(10)
        .padStart(2, '0')}-${day
        .toNumber()
        .toString(10)
        .padStart(2, '0')}T${hour
        .toNumber()
        .toString(10)
        .padStart(2, '0')}:${minute
        .toNumber()
        .toString(10)
        .padStart(2, '0')}:${second
        .toNumber()
        .toString(10)
        .padStart(2, '0')}.${nanosecond.div(1000).toNumber().toString(10)}Z`,
    );
  }

  public static isValidNeo4jLabel(label: string): boolean {
    /**
     * Must be in pascal case.
     * 
     * Valid labels:
     * - Label
     * - AnotherLabel
     * 
     * Invalid labels:
     * - label
     * - 123
     * - Label123
     * - Lab el
     * - LAbel
     */
    return /^([A-Z][a-z]+)+$/.test(label);
  }

  public static isValidNeo4jRelationshipType(type: string): boolean {
    /**
     * Must be in screaming snake case.
     * 
     * Valid labels:
     * - TYPE
     * - RELATIONSHIP_TYPE
     * 
     * Invalid labels:
     * - TYPe
     * - 123
     * - TYPE123
     * - TY PE
     * - type
     */
    return /^([A-Z]+(\_){0,1})+([A-Z])$/.test(type);
  }
}
