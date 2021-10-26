export class Config {
  public static readonly PASSWORD_MIN_LENGTH = 8;

  /**
   * @default
   * 1 day
   */
  public static readonly SESSION_EXPIRES_AFTER_SECONDS = 60 * 60 * 24;

  public static readonly PASSWORD_HASH_ROUNDS = 11;

  /**
   * Labels that cannot be used when creating a node using the
   * generic node create API.
   */
  public static readonly FORBIDDEN_GENERIC_NODE_LABELS = "User";

  /**
   * Node properties that cannot be updated using the API.
   */
  public static readonly FORBIDDEN_NODE_PROPERTIES_TO_UPDATE = [
    "id",
    "createdAt",
    "updatedAt",
  ];

  /**
   * Relationship properties that cannot be updated using the API.
   */
  public static readonly FORBIDDEN_RELATIONSHIP_PROPERTIES_TO_UPDATE = ["id"];
}
