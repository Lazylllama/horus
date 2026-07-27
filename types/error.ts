export type ErrorCode =
  | "Unauthorized"
  | "Forbidden"
  | "NotFound"
  | "NoNephthysHost"
  | "SlugNotFound"
  | "IncompleteInstanceData"
  | "EncryptionKeyMissing"
  | "EncryptionFailed"
  | "InternalError";

export type ErrorResponse = {
  error: ErrorCode;
  message?: string;
};
