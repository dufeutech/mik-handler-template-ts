// Typed input infrastructure for type-safe request handling
// Matching the Rust mik-sdk patterns

import { statusTitle } from "./constants.js";

// ============================================================================
// ID TYPE
// ============================================================================

/**
 * Path parameter ID type.
 *
 * A simple string alias - IDs are kept as strings for JavaScript safety
 * (numbers > 2^53 lose precision).
 *
 * @example
 * ```typescript
 * const id: Id = params.id;  // "user_123"
 *
 * // Parse as number if needed
 * const num = parseInt(id, 10);
 *
 * // Works with any ID format
 * // - Numeric: "123"
 * // - UUID: "550e8400-e29b-41d4-a716-446655440000"
 * // - Prefixed: "usr_abc123"
 * // - ULID: "01ARZ3NDEKTSV4RRFFQ69G5FAV"
 * ```
 */
export type Id = string;

// ============================================================================
// PARSE ERROR
// ============================================================================

/** Error types for parsing failures. */
export type ParseErrorKind = "missing" | "type_mismatch" | "invalid_format";

/**
 * Error type for parsing failures (JSON body, query params, path params).
 *
 * @example
 * ```typescript
 * // Field is missing
 * const err = ParseError.missing("email");
 * err.field;    // "email"
 * err.kind;     // "missing"
 * err.message;  // "missing required field: email"
 *
 * // Wrong type
 * const err = ParseError.typeMismatch("age", "integer");
 * err.message;  // "age: expected integer"
 *
 * // Invalid format
 * const err = ParseError.invalidFormat("date", "2024-99-99");
 * err.message;  // "date: invalid format '2024-99-99'"
 * ```
 */
export class ParseError extends Error {
  readonly field: string;
  readonly kind: ParseErrorKind;
  readonly expected?: string;
  readonly actual?: string;

  private constructor(
    field: string,
    kind: ParseErrorKind,
    message: string,
    expected?: string,
    actual?: string
  ) {
    super(message);
    this.name = "ParseError";
    this.field = field;
    this.kind = kind;
    this.expected = expected;
    this.actual = actual;
  }

  /** Create error for missing required field. */
  static missing(field: string): ParseError {
    return new ParseError(
      field,
      "missing",
      `missing required field: ${field}`
    );
  }

  /** Create error for type mismatch. */
  static typeMismatch(field: string, expected: string): ParseError {
    return new ParseError(
      field,
      "type_mismatch",
      `${field}: expected ${expected}`,
      expected
    );
  }

  /** Create error for invalid format. */
  static invalidFormat(field: string, actual: string): ParseError {
    return new ParseError(
      field,
      "invalid_format",
      `${field}: invalid format '${actual}'`,
      undefined,
      actual
    );
  }

  /** Get HTTP status code for this error (always 400). */
  get status(): number {
    return 400;
  }

  /** Get HTTP status title. */
  get title(): string {
    return statusTitle(400);
  }
}

// ============================================================================
// VALIDATION ERROR
// ============================================================================

/** Constraint types for validation failures. */
export type ValidationConstraint =
  | "min"
  | "max"
  | "min_length"
  | "max_length"
  | "pattern"
  | "email"
  | "url"
  | "required"
  | "custom";

/**
 * Error type for validation constraint failures.
 *
 * @example
 * ```typescript
 * // Value too short
 * const err = ValidationError.minLength("name", 3);
 * err.field;       // "name"
 * err.constraint;  // "min_length"
 * err.message;     // "name: minimum length is 3"
 *
 * // Value too large
 * const err = ValidationError.max("age", 150);
 * err.message;     // "age: maximum value is 150"
 *
 * // Pattern mismatch
 * const err = ValidationError.pattern("phone", "^\\d{10}$");
 * err.message;     // "phone: must match pattern '^\\d{10}$'"
 *
 * // Custom validation
 * const err = ValidationError.custom("password", "must contain a number");
 * err.message;     // "password: must contain a number"
 * ```
 */
export class ValidationError extends Error {
  readonly field: string;
  readonly constraint: ValidationConstraint;
  readonly limit?: number | string;

  private constructor(
    field: string,
    constraint: ValidationConstraint,
    message: string,
    limit?: number | string
  ) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.constraint = constraint;
    this.limit = limit;
  }

  /** Create error for minimum value constraint. */
  static min(field: string, min: number): ValidationError {
    return new ValidationError(
      field,
      "min",
      `${field}: minimum value is ${min}`,
      min
    );
  }

  /** Create error for maximum value constraint. */
  static max(field: string, max: number): ValidationError {
    return new ValidationError(
      field,
      "max",
      `${field}: maximum value is ${max}`,
      max
    );
  }

  /** Create error for minimum length constraint. */
  static minLength(field: string, min: number): ValidationError {
    return new ValidationError(
      field,
      "min_length",
      `${field}: minimum length is ${min}`,
      min
    );
  }

  /** Create error for maximum length constraint. */
  static maxLength(field: string, max: number): ValidationError {
    return new ValidationError(
      field,
      "max_length",
      `${field}: maximum length is ${max}`,
      max
    );
  }

  /** Create error for pattern mismatch. */
  static pattern(field: string, pattern: string): ValidationError {
    return new ValidationError(
      field,
      "pattern",
      `${field}: must match pattern '${pattern}'`,
      pattern
    );
  }

  /** Create error for invalid email. */
  static email(field: string): ValidationError {
    return new ValidationError(field, "email", `${field}: must be a valid email`);
  }

  /** Create error for invalid URL. */
  static url(field: string): ValidationError {
    return new ValidationError(field, "url", `${field}: must be a valid URL`);
  }

  /** Create error for required field. */
  static required(field: string): ValidationError {
    return new ValidationError(field, "required", `${field}: is required`);
  }

  /** Create error with custom message. */
  static custom(field: string, message: string): ValidationError {
    return new ValidationError(field, "custom", `${field}: ${message}`);
  }

  /** Get HTTP status code for this error (always 422). */
  get status(): number {
    return 422;
  }

  /** Get HTTP status title. */
  get title(): string {
    return statusTitle(422);
  }
}
