/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
  /**
   * Input field used for global ID in mutation.
   *
   * When accepting a global id in a mutation (local ids should never be used)
   * this Field should be used. The value received by the mutate function will
   * then contain the local id (integer value).
   */
  IdInputField: any;
};

export type AddressNode = Node & {
  __typename?: 'AddressNode';
  buildingName?: Maybe<Scalars['String']>;
  buildingNumber?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  postcode: Scalars['String'];
  street: Scalars['String'];
};

/**
 * Archive account and revoke refresh tokens.
 *
 * User must be verified and confirm password.
 */
export type ArchiveAccount = {
  __typename?: 'ArchiveAccount';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type BookingMutationInput = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  performance?: InputMaybe<Scalars['ID']>;
  tickets?: InputMaybe<Array<InputMaybe<TicketInputType>>>;
  userEmail?: InputMaybe<Scalars['String']>;
};

/** Create/update mutation for booking objects */
export type BookingMutationPayload = {
  __typename?: 'BookingMutationPayload';
  booking?: Maybe<BookingNode>;
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type BookingNode = Node & {
  __typename?: 'BookingNode';
  accessibilityInfo?: Maybe<Scalars['String']>;
  adminDiscountPercentage: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  creator: ExtendedUserNode;
  expired: Scalars['Boolean'];
  expiresAt: Scalars['DateTime'];
  /** The ID of the object. */
  id: Scalars['ID'];
  performance: PerformanceNode;
  priceBreakdown?: Maybe<PriceBreakdownNode>;
  reference: Scalars['String'];
  salesBreakdown?: Maybe<SalesBreakdownNode>;
  status: BookingStatus;
  tickets?: Maybe<Array<TicketNode>>;
  transactions?: Maybe<TransactionNodeConnection>;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<ExtendedUserNode>;
};


export type BookingNodeTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  provider?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type BookingNodeConnection = {
  __typename?: 'BookingNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BookingNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `BookingNode` and its cursor. */
export type BookingNodeEdge = {
  __typename?: 'BookingNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<BookingNode>;
};

/** An enumeration. */
export enum BookingStatus {
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** In Progress */
  InProgress = 'IN_PROGRESS',
  /** Paid */
  Paid = 'PAID'
}

/**
 * Cancel a payment
 *
 * This is used to cancel PENDING payments. Currently this is only for
 * SquarePOS payments.
 *
 * Args:
 *     payment_id (str): The id of the payment to cancel.
 */
export type CancelPayment = {
  __typename?: 'CancelPayment';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type CastMemberNode = Node & {
  __typename?: 'CastMemberNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  production: ProductionNode;
  profilePicture?: Maybe<ImageNode>;
  role?: Maybe<Scalars['String']>;
};

/**
 * Mutation to check in the tickets of a Booking.
 *
 * Args:
 *     booking_reference (str): The booking reference.
 *     performance (str): The id of the performance that the ticket is
 *         being booked in for, this should match the performance of the
 *         booking. If this is not the case an error will be thrown as the
 *         Booking cannot be used for the Performance.
 *
 *
 * Returns:
 *     booking (BookingNode): The Booking which was paid for.
 *     performance (PerformanceNode): The Performance.
 *
 * Raises:
 *     GQLException: If the booking does not match the performance booking
 *     GQLExceptions: If at least one ticket check in was unsuccessful
 */
export type CheckInBooking = {
  __typename?: 'CheckInBooking';
  booking?: Maybe<BookingNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  performance?: Maybe<PerformanceNode>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Node for ConcessionType which can be Booked.
 *
 * This object gives the information about a ConcessionType for a given
 * production. It includes the concession type and its pricing.
 */
export type ConcessionTypeBookingType = {
  __typename?: 'ConcessionTypeBookingType';
  concessionType?: Maybe<ConcessionTypeNode>;
  price?: Maybe<Scalars['Int']>;
  pricePounds?: Maybe<Scalars['String']>;
};

export type ConcessionTypeMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ConcessionTypeMutationPayload = {
  __typename?: 'ConcessionTypeMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  concessionType?: Maybe<ConcessionTypeNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ConcessionTypeNode = Node & {
  __typename?: 'ConcessionTypeNode';
  description?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ContentWarningNode = Node & {
  __typename?: 'ContentWarningNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  longDescription?: Maybe<Scalars['String']>;
  shortDescription: Scalars['String'];
};

export type ContentWarningNodeConnection = {
  __typename?: 'ContentWarningNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentWarningNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ContentWarningNode` and its cursor. */
export type ContentWarningNodeEdge = {
  __typename?: 'ContentWarningNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ContentWarningNode>;
};

export type CrewMemberNode = Node & {
  __typename?: 'CrewMemberNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  production: ProductionNode;
  role?: Maybe<CrewRoleNode>;
};

export type CrewMemberNodeConnection = {
  __typename?: 'CrewMemberNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CrewMemberNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `CrewMemberNode` and its cursor. */
export type CrewMemberNodeEdge = {
  __typename?: 'CrewMemberNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CrewMemberNode>;
};

/** An enumeration. */
export enum CrewRoleDepartment {
  /** AV */
  Av = 'AV',
  /** Lighting */
  Lighting = 'LIGHTING',
  /** Miscellaneous */
  Misc = 'MISC',
  /** Pyrotechnics */
  Pryo = 'PRYO',
  /** Set */
  Set = 'SET',
  /** Sound */
  Sound = 'SOUND',
  /** Stage Management */
  StageManagement = 'STAGE_MANAGEMENT'
}

export type CrewRoleNode = Node & {
  __typename?: 'CrewRoleNode';
  crewMembers: CrewMemberNodeConnection;
  department: CrewRoleDepartment;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type CrewRoleNodeCrewMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type DataSetNode = {
  __typename?: 'DataSetNode';
  data: Array<Maybe<Array<Maybe<Scalars['String']>>>>;
  headings: Array<Maybe<Scalars['String']>>;
  name: Scalars['String'];
};

/**
 * Delete account permanently or make `user.is_active=False`.
 *
 * The behavior is defined on settings.
 * Anyway user refresh tokens are revoked.
 *
 * User must be verified and confirm password.
 */
export type DeleteAccount = {
  __typename?: 'DeleteAccount';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Deletes a given booking.
 *
 * Must be in-progress, with no associated transactions.
 *
 * Args:
 *     booking_id (str): Global id of the booking to delete
 */
export type DeleteBooking = {
  __typename?: 'DeleteBooking';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteConcessionTypeMutation = {
  __typename?: 'DeleteConcessionTypeMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Delete a discount */
export type DeleteDiscountMutation = {
  __typename?: 'DeleteDiscountMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Delete a discount */
export type DeleteDiscountRequirementMutation = {
  __typename?: 'DeleteDiscountRequirementMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Mutation to delete a performance */
export type DeletePerformanceMutation = {
  __typename?: 'DeletePerformanceMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Mutation to delete a performance seat group */
export type DeletePerformanceSeatGroupMutation = {
  __typename?: 'DeletePerformanceSeatGroupMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DiscountMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  percentage?: InputMaybe<Scalars['Float']>;
  performances?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  seatGroup?: InputMaybe<Scalars['ID']>;
};

/** Create or update a discount */
export type DiscountMutationPayload = {
  __typename?: 'DiscountMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  discount?: Maybe<DiscountNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DiscountNode = Node & {
  __typename?: 'DiscountNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  percentage: Scalars['Float'];
  performances: PerformanceNodeConnection;
  requirements?: Maybe<Array<DiscountRequirementNode>>;
  seatGroup?: Maybe<SeatGroupNode>;
};


export type DiscountNodePerformancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  capacity?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  doorsOpen?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  extraInformation?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hasBoxofficePermissions?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  intervalDurationMins?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  production?: InputMaybe<Scalars['ID']>;
  runOn?: InputMaybe<Scalars['Date']>;
  seatGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  start?: InputMaybe<Scalars['DateTime']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  venue?: InputMaybe<Scalars['ID']>;
};

export type DiscountNodeConnection = {
  __typename?: 'DiscountNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<DiscountNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `DiscountNode` and its cursor. */
export type DiscountNodeEdge = {
  __typename?: 'DiscountNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<DiscountNode>;
};

export type DiscountRequirementMutationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  concessionType?: InputMaybe<Scalars['ID']>;
  discount?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  number?: InputMaybe<Scalars['Int']>;
};

/** Create or update a discount */
export type DiscountRequirementMutationPayload = {
  __typename?: 'DiscountRequirementMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  discountRequirement?: Maybe<DiscountRequirementNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DiscountRequirementNode = Node & {
  __typename?: 'DiscountRequirementNode';
  concessionType: ConcessionTypeNode;
  discount: DiscountNode;
  /** The ID of the object. */
  id: Scalars['ID'];
  number: Scalars['Int'];
};

/** Extends user node to add additional properties. */
export type ExtendedUserNode = {
  __typename?: 'ExtendedUserNode';
  archived?: Maybe<Scalars['Boolean']>;
  bookings: BookingNodeConnection;
  createdBookings: BookingNodeConnection;
  dateJoined: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  id?: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  pk?: Maybe<Scalars['Int']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  verified?: Maybe<Scalars['Boolean']>;
};


/** Extends user node to add additional properties. */
export type ExtendedUserNodeBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


/** Extends user node to add additional properties. */
export type ExtendedUserNodeCreatedBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};

/** FieldError is used to return errors which are for a specific field. */
export type FieldError = {
  __typename?: 'FieldError';
  code?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum FinancialTransferMethod {
  /** BACS */
  Bacs = 'BACS',
  /** Internal */
  Internal = 'INTERNAL'
}

export type FinancialTransferNode = {
  __typename?: 'FinancialTransferNode';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  method: FinancialTransferMethod;
  reason?: Maybe<Scalars['String']>;
  society?: Maybe<SocietyNode>;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<ExtendedUserNode>;
  value: Scalars['Int'];
};

export type GqlErrorUnion = FieldError | NonFieldError;

/** Mutation to generate a report */
export type GenerateReport = {
  __typename?: 'GenerateReport';
  downloadUri?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  report?: Maybe<ReportNode>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ImageNode = Node & {
  __typename?: 'ImageNode';
  altText?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  url?: Maybe<Scalars['String']>;
};

export type MetaItemNode = {
  __typename?: 'MetaItemNode';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type MiscCostNode = Node & {
  __typename?: 'MiscCostNode';
  description?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  percentage?: Maybe<Scalars['Float']>;
  value?: Maybe<Scalars['Float']>;
};

/** Defines base Mutation for api */
export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Archive account and revoke refresh tokens.
   *
   * User must be verified and confirm password.
   */
  archiveAccount?: Maybe<ArchiveAccount>;
  /** Create/update mutation for booking objects */
  booking?: Maybe<BookingMutationPayload>;
  /**
   * Cancel a payment
   *
   * This is used to cancel PENDING payments. Currently this is only for
   * SquarePOS payments.
   *
   * Args:
   *     payment_id (str): The id of the payment to cancel.
   */
  cancelPayment?: Maybe<CancelPayment>;
  /**
   * Mutation to check in the tickets of a Booking.
   *
   * Args:
   *     booking_reference (str): The booking reference.
   *     performance (str): The id of the performance that the ticket is
   *         being booked in for, this should match the performance of the
   *         booking. If this is not the case an error will be thrown as the
   *         Booking cannot be used for the Performance.
   *
   *
   * Returns:
   *     booking (BookingNode): The Booking which was paid for.
   *     performance (PerformanceNode): The Performance.
   *
   * Raises:
   *     GQLException: If the booking does not match the performance booking
   *     GQLExceptions: If at least one ticket check in was unsuccessful
   */
  checkInBooking?: Maybe<CheckInBooking>;
  concessionType?: Maybe<ConcessionTypeMutationPayload>;
  /**
   * Delete account permanently or make `user.is_active=False`.
   *
   * The behavior is defined on settings.
   * Anyway user refresh tokens are revoked.
   *
   * User must be verified and confirm password.
   */
  deleteAccount?: Maybe<DeleteAccount>;
  /**
   * Deletes a given booking.
   *
   * Must be in-progress, with no associated transactions.
   *
   * Args:
   *     booking_id (str): Global id of the booking to delete
   */
  deleteBooking?: Maybe<DeleteBooking>;
  deleteConcessionType?: Maybe<DeleteConcessionTypeMutation>;
  /** Delete a discount */
  deleteDiscount?: Maybe<DeleteDiscountMutation>;
  /** Delete a discount */
  deleteDiscountRequirement?: Maybe<DeleteDiscountRequirementMutation>;
  /** Mutation to delete a performance */
  deletePerformance?: Maybe<DeletePerformanceMutation>;
  /** Mutation to delete a performance seat group */
  deletePerformanceSeatGroup?: Maybe<DeletePerformanceSeatGroupMutation>;
  /** Create or update a discount */
  discount?: Maybe<DiscountMutationPayload>;
  /** Create or update a discount */
  discountRequirement?: Maybe<DiscountRequirementMutationPayload>;
  /** Mutation to generate a report */
  generateReport?: Maybe<GenerateReport>;
  /**
   * Obtain JSON web token for given user.
   *
   * Allow to perform login with different fields,
   * and secondary email if set. The fields are
   * defined on settings.
   *
   * Not verified users can login by default. This
   * can be changes on settings.
   *
   * If user is archived, make it unarchive and
   * return `unarchiving=True` on output.
   */
  login?: Maybe<ObtainJsonWebToken>;
  /**
   * Change account password when user knows the old password.
   *
   * A new token and refresh token are sent. User must be verified.
   */
  passwordChange?: Maybe<PasswordChange>;
  /**
   * Change user password without old password.
   *
   * Receive the token that was sent by email.
   *
   * If token and new passwords are valid, update
   * user password and in case of using refresh
   * tokens, revoke all of them.
   *
   * Also, if user has not been verified yet, verify it.
   */
  passwordReset?: Maybe<PasswordReset>;
  /**
   * Set user password - for passwordless registration
   *
   * Receive the token that was sent by email.
   *
   * If token and new passwords are valid, set
   * user password and in case of using refresh
   * tokens, revoke all of them.
   *
   * Also, if user has not been verified yet, verify it.
   */
  passwordSet?: Maybe<PasswordSet>;
  /**
   * Mutation to pay for a Booking.
   *
   * Args:
   *     booking_id (str): The gloabl id of the Booking being paid for.
   *     price (int): The expected price of the Booking. This must match the
   *         actual price of the Booking. This is used to ensure the front end
   *         is showing the true price which will be paid.
   *     nonce (str): The Square payment form nonce.
   *     payment_provider (PaymentProvider): The provider used for the payment.
   *
   * Returns:
   *     booking (BookingNode): The Booking which was paid for.
   *     transaction (TransactionNode): The Transaction which was created by the
   *         transaction.
   *
   * Raises:
   *     GQLException: If the Payment was unsucessful.
   */
  payBooking?: Maybe<PayBooking>;
  /** Mutation to create or update a performance */
  performance?: Maybe<PerformanceMutationPayload>;
  /** Mutation to create or update a performance seat group */
  performanceSeatGroup?: Maybe<PerformanceSeatGroupMutationPayload>;
  /** Mutation to create or update a production */
  production?: Maybe<ProductionMutationPayload>;
  productionPermissions?: Maybe<ProductionPermissionsMutation>;
  /** Record a transfer of funds from the site operator to a society */
  recordFinancialTransfer?: Maybe<RecordFinancialTransfer>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  refreshToken?: Maybe<RefreshToken>;
  /**
   * Register user with fields defined in the settings.
   *
   * If the email field of the user model is part of the
   * registration fields (default), check if there is
   * no user with that email or as a secondary email.
   *
   * If it exists, it does not register the user,
   * even if the email field is not defined as unique
   * (default of the default django user model).
   *
   * When creating the user, it also creates a `UserStatus`
   * related to that user, making it possible to track
   * if the user is archived, verified and has a secondary
   * email.
   *
   * Send account verification email.
   *
   * If allowed to not verified users login, return token.
   */
  register?: Maybe<Register>;
  /**
   * Remove user secondary email.
   *
   * Require password confirmation.
   */
  removeSecondaryEmail?: Maybe<RemoveSecondaryEmail>;
  /**
   * Sends activation email.
   *
   * It is called resend because theoretically
   * the first activation email was sent when
   * the user registered.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  resendActivationEmail?: Maybe<ResendActivationEmail>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  revokeToken?: Maybe<RevokeToken>;
  /**
   * Send password reset email.
   *
   * For non verified users, send an activation
   * email instead.
   *
   * Accepts both primary and secondary email.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  sendPasswordResetEmail?: Maybe<SendPasswordResetEmail>;
  /**
   * Send activation to secondary email.
   *
   * User must be verified and confirm password.
   */
  sendSecondaryEmailActivation?: Maybe<SendSecondaryEmailActivation>;
  /** Mutation to set the status of a production. */
  setProductionStatus?: Maybe<SetProductionStatus>;
  /**
   * Swap between primary and secondary emails.
   *
   * Require password confirmation.
   */
  swapEmails?: Maybe<SwapEmails>;
  /**
   * Mutation to un-check in the tickets of a Booking.
   *
   * Args:
   *     booking_reference (str): The booking reference
   *     performance (str): The id of the performance that the ticket is
   *         being booked in for, this should match the performance of the
   *         booking. If this is not the case an error will be thrown as the
   *         Booking cannot be used for the Performance.
   *
   *
   * Returns:
   *     booking (BookingNode): The Booking.
   *     performance (PerformanceNOde): The Performance.
   *
   * Raises:
   *     GQLException: If the un-check in was unsuccessful
   */
  uncheckInBooking?: Maybe<UnCheckInBooking>;
  /**
   * Update user model fields, defined on settings.
   *
   * User must be verified.
   */
  updateAccount?: Maybe<UpdateAccount>;
  /**
   * Verify user account.
   *
   * Receive the token that was sent by email.
   * If the token is valid, make the user verified
   * by making the `user.status.verified` field true.
   */
  verifyAccount?: Maybe<VerifyAccount>;
  /**
   * Verify user secondary email.
   *
   * Receive the token that was sent by email.
   * User is already verified when using this mutation.
   *
   * If the token is valid, add the secondary email
   * to `user.status.secondary_email` field.
   *
   * Note that until the secondary email is verified,
   * it has not been saved anywhere beyond the token,
   * so it can still be used to create a new account.
   * After being verified, it will no longer be available.
   */
  verifySecondaryEmail?: Maybe<VerifySecondaryEmail>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  verifyToken?: Maybe<VerifyToken>;
};


/** Defines base Mutation for api */
export type MutationArchiveAccountArgs = {
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationBookingArgs = {
  input: BookingMutationInput;
};


/** Defines base Mutation for api */
export type MutationCancelPaymentArgs = {
  paymentId: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationCheckInBookingArgs = {
  bookingReference: Scalars['String'];
  performance: Scalars['IdInputField'];
  tickets: Array<InputMaybe<TicketIdInput>>;
};


/** Defines base Mutation for api */
export type MutationConcessionTypeArgs = {
  input: ConcessionTypeMutationInput;
};


/** Defines base Mutation for api */
export type MutationDeleteAccountArgs = {
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationDeleteBookingArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDeleteConcessionTypeArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDeleteDiscountArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDeleteDiscountRequirementArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDeletePerformanceArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDeletePerformanceSeatGroupArgs = {
  id: Scalars['IdInputField'];
};


/** Defines base Mutation for api */
export type MutationDiscountArgs = {
  input: DiscountMutationInput;
};


/** Defines base Mutation for api */
export type MutationDiscountRequirementArgs = {
  input: DiscountRequirementMutationInput;
};


/** Defines base Mutation for api */
export type MutationGenerateReportArgs = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  options?: InputMaybe<Array<InputMaybe<ReportOption>>>;
  startTime?: InputMaybe<Scalars['DateTime']>;
};


/** Defines base Mutation for api */
export type MutationLoginArgs = {
  email?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationPasswordChangeArgs = {
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
  oldPassword: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationPasswordResetArgs = {
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
  token: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationPasswordSetArgs = {
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
  token: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationPayBookingArgs = {
  deviceId?: InputMaybe<Scalars['String']>;
  id: Scalars['IdInputField'];
  idempotencyKey?: InputMaybe<Scalars['String']>;
  nonce?: InputMaybe<Scalars['String']>;
  paymentProvider?: InputMaybe<PaymentProvider>;
  price: Scalars['Int'];
  verifyToken?: InputMaybe<Scalars['String']>;
};


/** Defines base Mutation for api */
export type MutationPerformanceArgs = {
  input: PerformanceMutationInput;
};


/** Defines base Mutation for api */
export type MutationPerformanceSeatGroupArgs = {
  input: PerformanceSeatGroupMutationInput;
};


/** Defines base Mutation for api */
export type MutationProductionArgs = {
  input: ProductionMutationInput;
};


/** Defines base Mutation for api */
export type MutationProductionPermissionsArgs = {
  id: Scalars['IdInputField'];
  permissions: Array<InputMaybe<Scalars['String']>>;
  userEmail: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationRecordFinancialTransferArgs = {
  method: TransferMethodEnum;
  reason?: InputMaybe<Scalars['String']>;
  societyId: Scalars['IdInputField'];
  value: Scalars['Int'];
};


/** Defines base Mutation for api */
export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationRegisterArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password1: Scalars['String'];
  password2: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationRemoveSecondaryEmailArgs = {
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationResendActivationEmailArgs = {
  email: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationRevokeTokenArgs = {
  refreshToken: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationSendSecondaryEmailActivationArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationSetProductionStatusArgs = {
  message?: InputMaybe<Scalars['String']>;
  productionId: Scalars['IdInputField'];
  status?: InputMaybe<Status>;
};


/** Defines base Mutation for api */
export type MutationSwapEmailsArgs = {
  password: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationUncheckInBookingArgs = {
  bookingReference: Scalars['String'];
  performance: Scalars['IdInputField'];
  tickets: Array<InputMaybe<TicketIdInput>>;
};


/** Defines base Mutation for api */
export type MutationUpdateAccountArgs = {
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
};


/** Defines base Mutation for api */
export type MutationVerifyAccountArgs = {
  token: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationVerifySecondaryEmailArgs = {
  token: Scalars['String'];
};


/** Defines base Mutation for api */
export type MutationVerifyTokenArgs = {
  token: Scalars['String'];
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type NonFieldError = {
  __typename?: 'NonFieldError';
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

/**
 * Obtain JSON web token for given user.
 *
 * Allow to perform login with different fields,
 * and secondary email if set. The fields are
 * defined on settings.
 *
 * Not verified users can login by default. This
 * can be changes on settings.
 *
 * If user is archived, make it unarchive and
 * return `unarchiving=True` on output.
 */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  refreshToken?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['String']>;
  unarchiving?: Maybe<Scalars['Boolean']>;
  user?: Maybe<UserNode>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/**
 * Change account password when user knows the old password.
 *
 * A new token and refresh token are sent. User must be verified.
 */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  refreshToken?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['String']>;
};

/**
 * Change user password without old password.
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, update
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordReset = {
  __typename?: 'PasswordReset';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Set user password - for passwordless registration
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, set
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordSet = {
  __typename?: 'PasswordSet';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Mutation to pay for a Booking.
 *
 * Args:
 *     booking_id (str): The gloabl id of the Booking being paid for.
 *     price (int): The expected price of the Booking. This must match the
 *         actual price of the Booking. This is used to ensure the front end
 *         is showing the true price which will be paid.
 *     nonce (str): The Square payment form nonce.
 *     payment_provider (PaymentProvider): The provider used for the payment.
 *
 * Returns:
 *     booking (BookingNode): The Booking which was paid for.
 *     transaction (TransactionNode): The Transaction which was created by the
 *         transaction.
 *
 * Raises:
 *     GQLException: If the Payment was unsucessful.
 */
export type PayBooking = {
  __typename?: 'PayBooking';
  booking?: Maybe<BookingNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  payment?: Maybe<TransactionNode>;
  success?: Maybe<Scalars['Boolean']>;
};

export type PayObjectUnion = BookingNode;

/** An enumeration. */
export enum PaymentProvider {
  Card = 'CARD',
  Cash = 'CASH',
  SquareOnline = 'SQUARE_ONLINE',
  SquarePos = 'SQUARE_POS'
}

export type PerformanceMutationInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  doorsOpen?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  intervalDurationMins?: InputMaybe<Scalars['Int']>;
  production?: InputMaybe<Scalars['ID']>;
  start?: InputMaybe<Scalars['DateTime']>;
  venue?: InputMaybe<Scalars['ID']>;
};

/** Mutation to create or update a performance */
export type PerformanceMutationPayload = {
  __typename?: 'PerformanceMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  performance?: Maybe<PerformanceNode>;
  success?: Maybe<Scalars['Boolean']>;
};

export type PerformanceNode = Node & {
  __typename?: 'PerformanceNode';
  bookings: BookingNodeConnection;
  capacity?: Maybe<Scalars['Int']>;
  capacityRemaining?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  disabled: Scalars['Boolean'];
  discounts: DiscountNodeConnection;
  doorsOpen?: Maybe<Scalars['DateTime']>;
  durationMins?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['DateTime']>;
  extraInformation?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  intervalDurationMins?: Maybe<Scalars['Int']>;
  isBookable: Scalars['Boolean'];
  isInperson: Scalars['Boolean'];
  isOnline: Scalars['Boolean'];
  minSeatPrice?: Maybe<Scalars['Int']>;
  production: ProductionNode;
  salesBreakdown?: Maybe<SalesBreakdownNode>;
  seatGroups: SeatGroupNodeConnection;
  soldOut: Scalars['Boolean'];
  start?: Maybe<Scalars['DateTime']>;
  ticketOptions?: Maybe<Array<Maybe<PerformanceSeatGroupNode>>>;
  ticketsBreakdown: PerformanceTicketsBreakdown;
  updatedAt: Scalars['DateTime'];
  venue?: Maybe<VenueNode>;
};


export type PerformanceNodeBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


export type PerformanceNodeDiscountsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  group?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type PerformanceNodeSeatGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type PerformanceNodeConnection = {
  __typename?: 'PerformanceNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PerformanceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PerformanceNode` and its cursor. */
export type PerformanceNodeEdge = {
  __typename?: 'PerformanceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PerformanceNode>;
};

export type PerformanceSeatGroupMutationInput = {
  capacity?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  performance?: InputMaybe<Scalars['ID']>;
  price?: InputMaybe<Scalars['Int']>;
  seatGroup?: InputMaybe<Scalars['ID']>;
};

/** Mutation to create or update a performance seat group */
export type PerformanceSeatGroupMutationPayload = {
  __typename?: 'PerformanceSeatGroupMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  performanceSeatGroup?: Maybe<PerformanceSeatGroupNode>;
  success?: Maybe<Scalars['Boolean']>;
};

export type PerformanceSeatGroupNode = Node & {
  __typename?: 'PerformanceSeatGroupNode';
  capacity: Scalars['Int'];
  capacityRemaining?: Maybe<Scalars['Int']>;
  concessionTypes?: Maybe<Array<Maybe<ConcessionTypeBookingType>>>;
  /** The ID of the object. */
  id: Scalars['ID'];
  numberTicketsSold?: Maybe<Scalars['Int']>;
  performance: PerformanceNode;
  price: Scalars['Int'];
  seatGroup: SeatGroupNode;
};

export type PerformanceTicketsBreakdown = {
  __typename?: 'PerformanceTicketsBreakdown';
  totalCapacity: Scalars['Int'];
  totalTicketsAvailable: Scalars['Int'];
  totalTicketsCheckedIn: Scalars['Int'];
  totalTicketsSold: Scalars['Int'];
  totalTicketsToCheckIn: Scalars['Int'];
};

export type PermissionNode = {
  __typename?: 'PermissionNode';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  userCanAssign?: Maybe<Scalars['Boolean']>;
};

export type PriceBreakdownNode = Node & {
  __typename?: 'PriceBreakdownNode';
  discountsValue: Scalars['Int'];
  /** The ID of the object. */
  id: Scalars['ID'];
  miscCosts?: Maybe<Array<Maybe<MiscCostNode>>>;
  miscCostsValue: Scalars['Int'];
  subtotalPrice: Scalars['Int'];
  tickets?: Maybe<Array<Maybe<PriceBreakdownTicketNode>>>;
  ticketsDiscountedPrice: Scalars['Int'];
  ticketsPrice: Scalars['Int'];
  totalPrice: Scalars['Int'];
};

export type PriceBreakdownTicketNode = {
  __typename?: 'PriceBreakdownTicketNode';
  concessionType?: Maybe<ConcessionTypeNode>;
  number: Scalars['Int'];
  seatGroup?: Maybe<SeatGroupNode>;
  ticketPrice: Scalars['Int'];
  totalPrice: Scalars['Int'];
};

export type ProductionContentWarningNode = Node & {
  __typename?: 'ProductionContentWarningNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  information?: Maybe<Scalars['String']>;
  production: ProductionNode;
  warning: ContentWarningNode;
};

export type ProductionMutationInput = {
  ageRating?: InputMaybe<Scalars['Int']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contentWarnings?: InputMaybe<Array<InputMaybe<ProductionWarning>>>;
  coverImage?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  facebookEvent?: InputMaybe<Scalars['String']>;
  featuredImage?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  posterImage?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
  society?: InputMaybe<Scalars['ID']>;
  subtitle?: InputMaybe<Scalars['String']>;
};

/** Mutation to create or update a production */
export type ProductionMutationPayload = {
  __typename?: 'ProductionMutationPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  production?: Maybe<ProductionNode>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ProductionNode = Node & {
  __typename?: 'ProductionNode';
  ageRating?: Maybe<Scalars['Int']>;
  assignablePermissions?: Maybe<Array<Maybe<PermissionNode>>>;
  assignedUsers?: Maybe<Array<Maybe<UserPermissionsNode>>>;
  cast?: Maybe<Array<CastMemberNode>>;
  contactEmail?: Maybe<Scalars['String']>;
  contentWarnings?: Maybe<Array<ProductionContentWarningNode>>;
  coverImage?: Maybe<ImageNode>;
  createdAt: Scalars['DateTime'];
  crew?: Maybe<Array<CrewMemberNode>>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['DateTime']>;
  facebookEvent?: Maybe<Scalars['String']>;
  featuredImage?: Maybe<ImageNode>;
  /** The ID of the object. */
  id: Scalars['ID'];
  isBookable: Scalars['Boolean'];
  minSeatPrice?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  performances: PerformanceNodeConnection;
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  posterImage?: Maybe<ImageNode>;
  productionTeam?: Maybe<Array<ProductionTeamMemberNode>>;
  salesBreakdown?: Maybe<SalesBreakdownNode>;
  slug: Scalars['String'];
  society?: Maybe<SocietyNode>;
  start?: Maybe<Scalars['DateTime']>;
  status: ProductionStatus;
  subtitle?: Maybe<Scalars['String']>;
  totalCapacity: Scalars['Int'];
  totalTicketsSold: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  venues?: Maybe<Array<VenueNode>>;
};


export type ProductionNodePerformancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  capacity?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  doorsOpen?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  extraInformation?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hasBoxofficePermissions?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  intervalDurationMins?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  production?: InputMaybe<Scalars['ID']>;
  runOn?: InputMaybe<Scalars['Date']>;
  seatGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  start?: InputMaybe<Scalars['DateTime']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  venue?: InputMaybe<Scalars['ID']>;
};

export type ProductionNodeConnection = {
  __typename?: 'ProductionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ProductionNode` and its cursor. */
export type ProductionNodeEdge = {
  __typename?: 'ProductionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProductionNode>;
};

export type ProductionPermissionsMutation = {
  __typename?: 'ProductionPermissionsMutation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** An enumeration. */
export enum ProductionStatus {
  /** Approved */
  Approved = 'APPROVED',
  /** Closed */
  Closed = 'CLOSED',
  /** Complete */
  Complete = 'COMPLETE',
  /** Draft */
  Draft = 'DRAFT',
  /** Pending */
  Pending = 'PENDING',
  /** Published */
  Published = 'PUBLISHED'
}

export type ProductionTeamMemberNode = Node & {
  __typename?: 'ProductionTeamMemberNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  name: Scalars['String'];
  production: ProductionNode;
  role?: Maybe<Scalars['String']>;
};

/** Input for creating Tickets with mutations. */
export type ProductionWarning = {
  id: Scalars['IdInputField'];
  information?: InputMaybe<Scalars['String']>;
};

/** Defines base Query for api */
export type Query = {
  __typename?: 'Query';
  bookings?: Maybe<BookingNodeConnection>;
  images?: Maybe<Array<Maybe<ImageNode>>>;
  me?: Maybe<ExtendedUserNode>;
  paymentDevices?: Maybe<Array<Maybe<SquarePaymentDevice>>>;
  performance?: Maybe<PerformanceNode>;
  performances?: Maybe<PerformanceNodeConnection>;
  production?: Maybe<ProductionNode>;
  productions?: Maybe<ProductionNodeConnection>;
  societies?: Maybe<SocietyNodeConnection>;
  society?: Maybe<SocietyNode>;
  venue?: Maybe<VenueNode>;
  venues?: Maybe<VenueNodeConnection>;
  warnings?: Maybe<ContentWarningNodeConnection>;
};


/** Defines base Query for api */
export type QueryBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


/** Defines base Query for api */
export type QueryPaymentDevicesArgs = {
  paired?: InputMaybe<Scalars['Boolean']>;
  paymentProvider?: InputMaybe<PaymentProvider>;
};


/** Defines base Query for api */
export type QueryPerformanceArgs = {
  id: Scalars['ID'];
};


/** Defines base Query for api */
export type QueryPerformancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  capacity?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  doorsOpen?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  extraInformation?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hasBoxofficePermissions?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  intervalDurationMins?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  production?: InputMaybe<Scalars['ID']>;
  runOn?: InputMaybe<Scalars['Date']>;
  seatGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  start?: InputMaybe<Scalars['DateTime']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  venue?: InputMaybe<Scalars['ID']>;
};


/** Defines base Query for api */
export type QueryProductionArgs = {
  id?: InputMaybe<Scalars['IdInputField']>;
  slug?: InputMaybe<Scalars['String']>;
};


/** Defines base Query for api */
export type QueryProductionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  ageRating?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contentWarnings?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  end_Gte?: InputMaybe<Scalars['DateTime']>;
  end_Lte?: InputMaybe<Scalars['DateTime']>;
  facebookEvent?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  society?: InputMaybe<Scalars['ID']>;
  start?: InputMaybe<Scalars['DateTime']>;
  start_Gte?: InputMaybe<Scalars['DateTime']>;
  start_Lte?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  subtitle?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


/** Defines base Query for api */
export type QuerySocietiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
};


/** Defines base Query for api */
export type QuerySocietyArgs = {
  slug: Scalars['String'];
};


/** Defines base Query for api */
export type QueryVenueArgs = {
  slug: Scalars['String'];
};


/** Defines base Query for api */
export type QueryVenuesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
};


/** Defines base Query for api */
export type QueryWarningsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

/** Record a transfer of funds from the site operator to a society */
export type RecordFinancialTransfer = {
  __typename?: 'RecordFinancialTransfer';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
  transfer?: Maybe<FinancialTransferNode>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  payload?: Maybe<Scalars['GenericScalar']>;
  refreshToken?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  token?: Maybe<Scalars['String']>;
};

/**
 * Register user with fields defined in the settings.
 *
 * If the email field of the user model is part of the
 * registration fields (default), check if there is
 * no user with that email or as a secondary email.
 *
 * If it exists, it does not register the user,
 * even if the email field is not defined as unique
 * (default of the default django user model).
 *
 * When creating the user, it also creates a `UserStatus`
 * related to that user, making it possible to track
 * if the user is archived, verified and has a secondary
 * email.
 *
 * Send account verification email.
 *
 * If allowed to not verified users login, return token.
 */
export type Register = {
  __typename?: 'Register';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Remove user secondary email.
 *
 * Require password confirmation.
 */
export type RemoveSecondaryEmail = {
  __typename?: 'RemoveSecondaryEmail';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ReportNode = {
  __typename?: 'ReportNode';
  datasets?: Maybe<Array<Maybe<DataSetNode>>>;
  meta?: Maybe<Array<Maybe<MetaItemNode>>>;
};

export type ReportOption = {
  name: Scalars['String'];
  value: Scalars['String'];
};

/**
 * Sends activation email.
 *
 * It is called resend because theoretically
 * the first activation email was sent when
 * the user registered.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type ResendActivationEmail = {
  __typename?: 'ResendActivationEmail';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RevokeToken = {
  __typename?: 'RevokeToken';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  revoked?: Maybe<Scalars['Int']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type SalesBreakdownNode = {
  __typename?: 'SalesBreakdownNode';
  appFee: Scalars['Int'];
  appPaymentValue: Scalars['Int'];
  netCardTransactions: Scalars['Int'];
  netTransactions: Scalars['Int'];
  providerPaymentValue: Scalars['Int'];
  societyRevenue: Scalars['Int'];
  societyTransferValue: Scalars['Int'];
  totalCardPayments: Scalars['Int'];
  totalCardRefunds: Scalars['Int'];
  totalPayments: Scalars['Int'];
  totalRefunds: Scalars['Int'];
};

export type SeatGroupNode = Node & {
  __typename?: 'SeatGroupNode';
  capacity?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  isInternal: Scalars['Boolean'];
  name: Scalars['String'];
  venue: VenueNode;
};

export type SeatGroupNodeConnection = {
  __typename?: 'SeatGroupNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SeatGroupNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SeatGroupNode` and its cursor. */
export type SeatGroupNodeEdge = {
  __typename?: 'SeatGroupNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<SeatGroupNode>;
};

export type SeatNode = Node & {
  __typename?: 'SeatNode';
  /** The ID of the object. */
  id: Scalars['ID'];
  number?: Maybe<Scalars['String']>;
  row?: Maybe<Scalars['String']>;
};

/**
 * Send password reset email.
 *
 * For non verified users, send an activation
 * email instead.
 *
 * Accepts both primary and secondary email.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type SendPasswordResetEmail = {
  __typename?: 'SendPasswordResetEmail';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Send activation to secondary email.
 *
 * User must be verified and confirm password.
 */
export type SendSecondaryEmailActivation = {
  __typename?: 'SendSecondaryEmailActivation';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Mutation to set the status of a production. */
export type SetProductionStatus = {
  __typename?: 'SetProductionStatus';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type SocietyNode = Node & {
  __typename?: 'SocietyNode';
  banner: ImageNode;
  contact?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  logo: ImageNode;
  members: Array<ExtendedUserNode>;
  name: Scalars['String'];
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  productions: ProductionNodeConnection;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  website?: Maybe<Scalars['String']>;
};


export type SocietyNodeProductionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  ageRating?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contentWarnings?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  end_Gte?: InputMaybe<Scalars['DateTime']>;
  end_Lte?: InputMaybe<Scalars['DateTime']>;
  facebookEvent?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  society?: InputMaybe<Scalars['ID']>;
  start?: InputMaybe<Scalars['DateTime']>;
  start_Gte?: InputMaybe<Scalars['DateTime']>;
  start_Lte?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  subtitle?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type SocietyNodeConnection = {
  __typename?: 'SocietyNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SocietyNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SocietyNode` and its cursor. */
export type SocietyNodeEdge = {
  __typename?: 'SocietyNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<SocietyNode>;
};

/** Graphql object for square device */
export type SquarePaymentDevice = {
  __typename?: 'SquarePaymentDevice';
  code?: Maybe<Scalars['String']>;
  deviceId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  locationId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  productType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

/** The overall status of the production */
export enum Status {
  Approved = 'APPROVED',
  Closed = 'CLOSED',
  Complete = 'COMPLETE',
  Draft = 'DRAFT',
  Pending = 'PENDING',
  Published = 'PUBLISHED'
}

/**
 * Swap between primary and secondary emails.
 *
 * Require password confirmation.
 */
export type SwapEmails = {
  __typename?: 'SwapEmails';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type TicketIdInput = {
  ticketId: Scalars['IdInputField'];
};

/** Input for creating Tickets with mutations. */
export type TicketInputType = {
  concessionTypeId: Scalars['IdInputField'];
  id?: InputMaybe<Scalars['IdInputField']>;
  seatGroupId: Scalars['IdInputField'];
  seatId?: InputMaybe<Scalars['IdInputField']>;
};

export type TicketNode = Node & {
  __typename?: 'TicketNode';
  booking: BookingNode;
  checkedIn?: Maybe<Scalars['Boolean']>;
  checkedInAt?: Maybe<Scalars['DateTime']>;
  checkedInBy?: Maybe<ExtendedUserNode>;
  concessionType: ConcessionTypeNode;
  /** The ID of the object. */
  id: Scalars['ID'];
  seat?: Maybe<SeatNode>;
  seatGroup: SeatGroupNode;
};

export type TicketNodeConnection = {
  __typename?: 'TicketNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TicketNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `TicketNode` and its cursor. */
export type TicketNodeEdge = {
  __typename?: 'TicketNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TicketNode>;
};

export type TransactionNode = Node & {
  __typename?: 'TransactionNode';
  appFee?: Maybe<Scalars['Int']>;
  cardBrand?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  currency: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  last4?: Maybe<Scalars['String']>;
  payObject?: Maybe<PayObjectUnion>;
  providerFee?: Maybe<Scalars['Int']>;
  providerName: TransactionProviderName;
  providerTransactionId?: Maybe<Scalars['String']>;
  status: TransactionStatus;
  type: TransactionType;
  updatedAt: Scalars['DateTime'];
  url?: Maybe<Scalars['String']>;
  value: Scalars['Int'];
};

export type TransactionNodeConnection = {
  __typename?: 'TransactionNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TransactionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `TransactionNode` and its cursor. */
export type TransactionNodeEdge = {
  __typename?: 'TransactionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<TransactionNode>;
};

/** An enumeration. */
export enum TransactionProviderName {
  /** CARD */
  Card = 'CARD',
  /** CASH */
  Cash = 'CASH',
  /** MANUAL_CARD_REFUND */
  ManualCardRefund = 'MANUAL_CARD_REFUND',
  /** SQUARE_ONLINE */
  SquareOnline = 'SQUARE_ONLINE',
  /** SQUARE_POS */
  SquarePos = 'SQUARE_POS',
  /** SQUARE_REFUND */
  SquareRefund = 'SQUARE_REFUND'
}

/** An enumeration. */
export enum TransactionStatus {
  /** Completed */
  Completed = 'COMPLETED',
  /** Failed */
  Failed = 'FAILED',
  /** In progress */
  Pending = 'PENDING'
}

/** An enumeration. */
export enum TransactionType {
  /** Payment */
  Payment = 'PAYMENT',
  /** Refund */
  Refund = 'REFUND'
}

/** An enumeration. */
export enum TransferMethodEnum {
  Bacs = 'BACS',
  Internal = 'INTERNAL'
}

/**
 * Mutation to un-check in the tickets of a Booking.
 *
 * Args:
 *     booking_reference (str): The booking reference
 *     performance (str): The id of the performance that the ticket is
 *         being booked in for, this should match the performance of the
 *         booking. If this is not the case an error will be thrown as the
 *         Booking cannot be used for the Performance.
 *
 *
 * Returns:
 *     booking (BookingNode): The Booking.
 *     performance (PerformanceNOde): The Performance.
 *
 * Raises:
 *     GQLException: If the un-check in was unsuccessful
 */
export type UnCheckInBooking = {
  __typename?: 'UnCheckInBooking';
  booking?: Maybe<BookingNode>;
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  performance?: Maybe<PerformanceNode>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Update user model fields, defined on settings.
 *
 * User must be verified.
 */
export type UpdateAccount = {
  __typename?: 'UpdateAccount';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type UserNode = Node & {
  __typename?: 'UserNode';
  archived?: Maybe<Scalars['Boolean']>;
  bookings: BookingNodeConnection;
  createdBookings: BookingNodeConnection;
  dateJoined: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  /** The ID of the object. */
  id: Scalars['ID'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean'];
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean'];
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  lastName: Scalars['String'];
  pk?: Maybe<Scalars['Int']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  societies: SocietyNodeConnection;
  ticketsCheckedInByUser: TicketNodeConnection;
  verified?: Maybe<Scalars['Boolean']>;
};


export type UserNodeBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


export type UserNodeCreatedBookingsArgs = {
  accessibilityInfo?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  adminDiscountPercentage?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  creator?: InputMaybe<Scalars['ID']>;
  expired?: InputMaybe<Scalars['Boolean']>;
  expiresAt?: InputMaybe<Scalars['DateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  performance?: InputMaybe<Scalars['ID']>;
  reference?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  statusIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  user?: InputMaybe<Scalars['ID']>;
};


export type UserNodeSocietiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
};


export type UserNodeTicketsCheckedInByUserArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type UserPermissionsNode = {
  __typename?: 'UserPermissionsNode';
  assignedPermissions?: Maybe<Array<Maybe<Scalars['String']>>>;
  user?: Maybe<ExtendedUserNode>;
};

export type VenueNode = Node & {
  __typename?: 'VenueNode';
  address: AddressNode;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  /** The ID of the object. */
  id: Scalars['ID'];
  image: ImageNode;
  internalCapacity: Scalars['Int'];
  name: Scalars['String'];
  performances: PerformanceNodeConnection;
  productionSet: ProductionNodeConnection;
  productions?: Maybe<ProductionNodeConnection>;
  publiclyListed: Scalars['Boolean'];
  seatGroups: SeatGroupNodeConnection;
  slug: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};


export type VenueNodePerformancesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  capacity?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  doorsOpen?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  extraInformation?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  hasBoxofficePermissions?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  intervalDurationMins?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  production?: InputMaybe<Scalars['ID']>;
  runOn?: InputMaybe<Scalars['Date']>;
  seatGroups?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  start?: InputMaybe<Scalars['DateTime']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  venue?: InputMaybe<Scalars['ID']>;
};


export type VenueNodeProductionSetArgs = {
  after?: InputMaybe<Scalars['String']>;
  ageRating?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contentWarnings?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  end_Gte?: InputMaybe<Scalars['DateTime']>;
  end_Lte?: InputMaybe<Scalars['DateTime']>;
  facebookEvent?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  society?: InputMaybe<Scalars['ID']>;
  start?: InputMaybe<Scalars['DateTime']>;
  start_Gte?: InputMaybe<Scalars['DateTime']>;
  start_Lte?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  subtitle?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type VenueNodeProductionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  ageRating?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['String']>;
  contactEmail?: InputMaybe<Scalars['String']>;
  contentWarnings?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  end_Gte?: InputMaybe<Scalars['DateTime']>;
  end_Lte?: InputMaybe<Scalars['DateTime']>;
  facebookEvent?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  society?: InputMaybe<Scalars['ID']>;
  start?: InputMaybe<Scalars['DateTime']>;
  start_Gte?: InputMaybe<Scalars['DateTime']>;
  start_Lte?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  subtitle?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
  userHasPermission?: InputMaybe<Scalars['String']>;
  venues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type VenueNodeSeatGroupsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type VenueNodeConnection = {
  __typename?: 'VenueNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<VenueNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `VenueNode` and its cursor. */
export type VenueNodeEdge = {
  __typename?: 'VenueNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<VenueNode>;
};

/**
 * Verify user account.
 *
 * Receive the token that was sent by email.
 * If the token is valid, make the user verified
 * by making the `user.status.verified` field true.
 */
export type VerifyAccount = {
  __typename?: 'VerifyAccount';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Verify user secondary email.
 *
 * Receive the token that was sent by email.
 * User is already verified when using this mutation.
 *
 * If the token is valid, add the secondary email
 * to `user.status.secondary_email` field.
 *
 * Note that until the secondary email is verified,
 * it has not been saved anywhere beyond the token,
 * so it can still be used to create a new account.
 * After being verified, it will no longer be available.
 */
export type VerifySecondaryEmail = {
  __typename?: 'VerifySecondaryEmail';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  success?: Maybe<Scalars['Boolean']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type VerifyToken = {
  __typename?: 'VerifyToken';
  errors?: Maybe<Array<Maybe<GqlErrorUnion>>>;
  payload?: Maybe<Scalars['GenericScalar']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type AddressFieldsFragment = { __typename?: 'AddressNode', id: string, buildingNumber?: string | null, buildingName?: string | null, street: string, city: string, postcode: string, latitude?: number | null, longitude?: number | null } & { ' $fragmentName'?: 'AddressFieldsFragment' };

export type AllPriceBreakdownFragment = { __typename?: 'PriceBreakdownNode', ticketsPrice: number, ticketsDiscountedPrice: number, discountsValue: number, subtotalPrice: number, miscCostsValue: number, totalPrice: number, tickets?: Array<{ __typename?: 'PriceBreakdownTicketNode', number: number, totalPrice: number, seatGroup?: { __typename?: 'SeatGroupNode', id: string, name: string } | null, concessionType?: { __typename?: 'ConcessionTypeNode', id: string, name: string } | null } | null> | null, miscCosts?: Array<{ __typename?: 'MiscCostNode', name: string, description?: string | null, percentage?: number | null, value?: number | null } | null> | null } & { ' $fragmentName'?: 'AllPriceBreakdownFragment' };

export type BasicBookingDetailsFragment = { __typename?: 'BookingNode', id: string, reference: string, status: BookingStatus, user?: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string } | null, performance: { __typename?: 'PerformanceNode', id: string, start?: any | null, end?: any | null, production: { __typename?: 'ProductionNode', id: string, name: string, slug: string } }, tickets?: Array<{ __typename?: 'TicketNode', id: string }> | null } & { ' $fragmentName'?: 'BasicBookingDetailsFragment' };

export type BookingPaymentDetailsFragment = { __typename?: 'BookingNode', transactions?: { __typename?: 'TransactionNodeConnection', edges: Array<{ __typename?: 'TransactionNodeEdge', node?: { __typename?: 'TransactionNode', id: string, createdAt: any, type: TransactionType, providerName: TransactionProviderName, providerTransactionId?: string | null, providerFee?: number | null, value: number, cardBrand?: string | null, last4?: string | null } | null } | null> } | null } & { ' $fragmentName'?: 'BookingPaymentDetailsFragment' };

export type BookingTicketDetailsFragment = { __typename?: 'BookingNode', tickets?: Array<{ __typename?: 'TicketNode', id: string, checkedIn?: boolean | null, seatGroup: { __typename?: 'SeatGroupNode', id: string, name: string }, concessionType: { __typename?: 'ConcessionTypeNode', id: string, name: string } }> | null } & { ' $fragmentName'?: 'BookingTicketDetailsFragment' };

export type BookingWithProductionDetailsFragment = { __typename?: 'BookingNode', id: string, reference: string, status: BookingStatus, priceBreakdown?: (
    { __typename?: 'PriceBreakdownNode' }
    & { ' $fragmentRefs'?: { 'AllPriceBreakdownFragment': AllPriceBreakdownFragment } }
  ) | null, tickets?: Array<{ __typename?: 'TicketNode', id: string, seatGroup: { __typename?: 'SeatGroupNode', id: string, name: string }, concessionType: { __typename?: 'ConcessionTypeNode', id: string, name: string } }> | null, performance: { __typename?: 'PerformanceNode', id: string, start?: any | null, end?: any | null, doorsOpen?: any | null, durationMins?: number | null, intervalDurationMins?: number | null, production: { __typename?: 'ProductionNode', id: string, name: string, slug: string, subtitle?: string | null, society?: { __typename?: 'SocietyNode', id: string, name: string, slug: string, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null }, venue?: { __typename?: 'VenueNode', id: string, slug: string } | null }, transactions?: { __typename?: 'TransactionNodeConnection', edges: Array<{ __typename?: 'TransactionNodeEdge', node?: { __typename?: 'TransactionNode', id: string, createdAt: any, type: TransactionType, providerName: TransactionProviderName, providerTransactionId?: string | null, providerFee?: number | null, value: number, cardBrand?: string | null, last4?: string | null } | null } | null> } | null } & { ' $fragmentName'?: 'BookingWithProductionDetailsFragment' };

export type DetailedBookingDetailsFragment = (
  { __typename?: 'BookingNode', id: string, reference: string, expired: boolean, expiresAt: any, status: BookingStatus, user?: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string } | null, salesBreakdown?: { __typename?: 'SalesBreakdownNode', totalPayments: number } | null, priceBreakdown?: (
    { __typename?: 'PriceBreakdownNode' }
    & { ' $fragmentRefs'?: { 'AllPriceBreakdownFragment': AllPriceBreakdownFragment } }
  ) | null, performance: { __typename?: 'PerformanceNode', id: string, start?: any | null, end?: any | null, doorsOpen?: any | null, durationMins?: number | null, intervalDurationMins?: number | null, production: { __typename?: 'ProductionNode', id: string, name: string, slug: string }, venue?: { __typename?: 'VenueNode', id: string, slug: string } | null } }
  & { ' $fragmentRefs'?: { 'BookingTicketDetailsFragment': BookingTicketDetailsFragment;'BookingPaymentDetailsFragment': BookingPaymentDetailsFragment } }
) & { ' $fragmentName'?: 'DetailedBookingDetailsFragment' };

export type PerformanceTicketOptionsFragmentFragment = { __typename?: 'PerformanceSeatGroupNode', id: string, capacityRemaining?: number | null, price: number, seatGroup: { __typename?: 'SeatGroupNode', id: string, name: string, description?: string | null, capacity?: number | null }, concessionTypes?: Array<{ __typename?: 'ConcessionTypeBookingType', price?: number | null, concessionType?: { __typename?: 'ConcessionTypeNode', id: string, name: string, description?: string | null } | null } | null> | null } & { ' $fragmentName'?: 'PerformanceTicketOptionsFragmentFragment' };

export type ProductionBasicInfoFragment = { __typename?: 'ProductionNode', id: string, name: string, subtitle?: string | null, description?: string | null, contactEmail?: string | null, status: ProductionStatus, ageRating?: number | null, slug: string, start?: any | null, end?: any | null, minSeatPrice?: number | null, isBookable: boolean, society?: { __typename?: 'SocietyNode', id: string, name: string, slug: string, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, contentWarnings?: Array<{ __typename?: 'ProductionContentWarningNode', information?: string | null, warning: { __typename?: 'ContentWarningNode', id: string, shortDescription: string, longDescription?: string | null } }> | null } & { ' $fragmentName'?: 'ProductionBasicInfoFragment' };

export type ProductionPerformancesFragment = { __typename?: 'ProductionNode', performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, disabled: boolean, description?: string | null, doorsOpen?: any | null, start?: any | null, end?: any | null, durationMins?: number | null, soldOut: boolean, isInperson: boolean, isOnline: boolean, isBookable: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string } | null } | null } | null> } } & { ' $fragmentName'?: 'ProductionPerformancesFragment' };

export type ProductionsDetailsFragmentFragment = { __typename?: 'ProductionNodeConnection', edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, slug: string, name: string, start?: any | null, end?: any | null, isBookable: boolean, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, coverImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, venues?: Array<{ __typename?: 'VenueNode', id: string, name: string }> | null, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, doorsOpen?: any | null, start?: any | null, soldOut: boolean, end?: any | null, venue?: { __typename?: 'VenueNode', id: string, name: string } | null, production: { __typename?: 'ProductionNode', id: string, name: string, featuredImage?: { __typename?: 'ImageNode', url?: string | null } | null } } | null } | null> } } | null } | null> } & { ' $fragmentName'?: 'ProductionsDetailsFragmentFragment' };

export type AuthUserDetailsFragment = { __typename?: 'ExtendedUserNode', firstName: string, lastName: string, email: string, permissions?: Array<string | null> | null } & { ' $fragmentName'?: 'AuthUserDetailsFragment' };

export type GenerateReportMutationVariables = Exact<{
  name: Scalars['String'];
  start?: InputMaybe<Scalars['DateTime']>;
  end?: InputMaybe<Scalars['DateTime']>;
  options?: InputMaybe<Array<InputMaybe<ReportOption>> | InputMaybe<ReportOption>>;
}>;


export type GenerateReportMutation = { __typename?: 'Mutation', generateReport?: { __typename?: 'GenerateReport', success?: boolean | null, downloadUri?: string | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, code?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null, code?: string | null } | null> | null } | null };

export type ConcessionTypeMutationMutationVariables = Exact<{
  input: ConcessionTypeMutationInput;
}>;


export type ConcessionTypeMutationMutation = { __typename?: 'Mutation', concessionType?: { __typename?: 'ConcessionTypeMutationPayload', success?: boolean | null, concessionType?: { __typename?: 'ConcessionTypeNode', id: string } | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type DeleteDiscountMutationMutationVariables = Exact<{
  id: Scalars['IdInputField'];
}>;


export type DeleteDiscountMutationMutation = { __typename?: 'Mutation', deleteDiscount?: { __typename?: 'DeleteDiscountMutation', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type DeletePerformanceSeatGroupMutationMutationVariables = Exact<{
  id: Scalars['IdInputField'];
}>;


export type DeletePerformanceSeatGroupMutationMutation = { __typename?: 'Mutation', deletePerformanceSeatGroup?: { __typename?: 'DeletePerformanceSeatGroupMutation', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type DiscountMutationMutationVariables = Exact<{
  input: DiscountMutationInput;
}>;


export type DiscountMutationMutation = { __typename?: 'Mutation', discount?: { __typename?: 'DiscountMutationPayload', success?: boolean | null, discount?: { __typename?: 'DiscountNode', id: string } | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type DiscountRequirementMutationMutationVariables = Exact<{
  input: DiscountRequirementMutationInput;
}>;


export type DiscountRequirementMutationMutation = { __typename?: 'Mutation', discountRequirement?: { __typename?: 'DiscountRequirementMutationPayload', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type PerformanceMutationMutationVariables = Exact<{
  input: PerformanceMutationInput;
}>;


export type PerformanceMutationMutation = { __typename?: 'Mutation', performance?: { __typename?: 'PerformanceMutationPayload', success?: boolean | null, performance?: { __typename?: 'PerformanceNode', id: string } | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type PerformanceSeatGroupMutationVariables = Exact<{
  input: PerformanceSeatGroupMutationInput;
}>;


export type PerformanceSeatGroupMutation = { __typename?: 'Mutation', performanceSeatGroup?: { __typename?: 'PerformanceSeatGroupMutationPayload', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type ProductionMutationMutationVariables = Exact<{
  input: ProductionMutationInput;
}>;


export type ProductionMutationMutation = { __typename?: 'Mutation', production?: { __typename?: 'ProductionMutationPayload', success?: boolean | null, production?: { __typename?: 'ProductionNode', id: string, slug: string } | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type ProductionPermissionsMutationsMutationVariables = Exact<{
  productionId: Scalars['IdInputField'];
  permissions: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  userEmail: Scalars['String'];
}>;


export type ProductionPermissionsMutationsMutation = { __typename?: 'Mutation', productionPermissions?: { __typename?: 'ProductionPermissionsMutation', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type SetStatusMutationVariables = Exact<{
  id: Scalars['IdInputField'];
  status: Status;
  message?: InputMaybe<Scalars['String']>;
}>;


export type SetStatusMutation = { __typename?: 'Mutation', setProductionStatus?: { __typename?: 'SetProductionStatus', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type BookingMutationVariables = Exact<{
  input: BookingMutationInput;
}>;


export type BookingMutation = { __typename?: 'Mutation', booking?: { __typename?: 'BookingMutationPayload', success?: boolean | null, booking?: (
      { __typename?: 'BookingNode' }
      & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
    ) | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type CancelPaymentMutationVariables = Exact<{
  paymentId: Scalars['IdInputField'];
}>;


export type CancelPaymentMutation = { __typename?: 'Mutation', cancelPayment?: { __typename?: 'CancelPayment', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type DeleteBookingMutationVariables = Exact<{
  bookingId: Scalars['IdInputField'];
}>;


export type DeleteBookingMutation = { __typename?: 'Mutation', deleteBooking?: { __typename?: 'DeleteBooking', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError' } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type PayBookingMutationVariables = Exact<{
  id: Scalars['IdInputField'];
  totalPence: Scalars['Int'];
  nonce?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<PaymentProvider>;
  idempotencyKey?: InputMaybe<Scalars['String']>;
  deviceId?: InputMaybe<Scalars['String']>;
  verifyToken?: InputMaybe<Scalars['String']>;
}>;


export type PayBookingMutation = { __typename?: 'Mutation', payBooking?: { __typename?: 'PayBooking', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null, payment?: { __typename?: 'TransactionNode', id: string, value: number, currency: string, cardBrand?: string | null, last4?: string | null } | null, booking?: (
      { __typename?: 'BookingNode' }
      & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
    ) | null } | null };

export type SetBookingUserMutationVariables = Exact<{
  id: Scalars['ID'];
  email: Scalars['String'];
}>;


export type SetBookingUserMutation = { __typename?: 'Mutation', booking?: { __typename?: 'BookingMutationPayload', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type CheckInBookingMutationVariables = Exact<{
  reference: Scalars['String'];
  performanceId: Scalars['IdInputField'];
  tickets: Array<InputMaybe<TicketIdInput>> | InputMaybe<TicketIdInput>;
}>;


export type CheckInBookingMutation = { __typename?: 'Mutation', checkInBooking?: { __typename?: 'CheckInBooking', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null, booking?: (
      { __typename?: 'BookingNode' }
      & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
    ) | null } | null };

export type UnCheckInBookingMutationVariables = Exact<{
  reference: Scalars['String'];
  performanceId: Scalars['IdInputField'];
  tickets: Array<InputMaybe<TicketIdInput>> | InputMaybe<TicketIdInput>;
}>;


export type UnCheckInBookingMutation = { __typename?: 'Mutation', uncheckInBooking?: { __typename?: 'UnCheckInBooking', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null, booking?: (
      { __typename?: 'BookingNode' }
      & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
    ) | null } | null };

export type AttemptPasswordResetMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
  confirmedNewPassword: Scalars['String'];
}>;


export type AttemptPasswordResetMutation = { __typename?: 'Mutation', passwordReset?: { __typename?: 'PasswordReset', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', message?: string | null, field?: string | null } | { __typename?: 'NonFieldError', message?: string | null } | null> | null } | null };

export type AllSocietiesQueryVariables = Exact<{
  afterCursor?: InputMaybe<Scalars['String']>;
}>;


export type AllSocietiesQuery = { __typename?: 'Query', societies?: { __typename?: 'SocietyNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'SocietyNodeEdge', node?: { __typename?: 'SocietyNode', id: string, name: string, slug: string, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null } | null> } | null };

export type UserDraftBookingForPerformanceQueryVariables = Exact<{
  performanceID: Scalars['ID'];
}>;


export type UserDraftBookingForPerformanceQuery = { __typename?: 'Query', me?: { __typename?: 'ExtendedUserNode', bookings: { __typename?: 'BookingNodeConnection', edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
          { __typename?: 'BookingNode' }
          & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
        ) | null } | null> } } | null };

export type FullPerformanceAndTicketOptionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FullPerformanceAndTicketOptionsQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, capacityRemaining?: number | null, disabled: boolean, doorsOpen?: any | null, start?: any | null, end?: any | null, durationMins?: number | null, soldOut: boolean, isInperson: boolean, isOnline: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string } | null, production: (
      { __typename?: 'ProductionNode', id: string }
      & { ' $fragmentRefs'?: { 'ProductionBasicInfoFragment': ProductionBasicInfoFragment;'ProductionPerformancesFragment': ProductionPerformancesFragment } }
    ), discounts: { __typename?: 'DiscountNodeConnection', edges: Array<{ __typename?: 'DiscountNodeEdge', node?: { __typename?: 'DiscountNode', id: string, name?: string | null, seatGroup?: { __typename?: 'SeatGroupNode', id: string, name: string } | null, requirements?: Array<{ __typename?: 'DiscountRequirementNode', number: number, concessionType: { __typename?: 'ConcessionTypeNode', id: string, name: string } }> | null } | null } | null> }, ticketOptions?: Array<(
      { __typename?: 'PerformanceSeatGroupNode' }
      & { ' $fragmentRefs'?: { 'PerformanceTicketOptionsFragmentFragment': PerformanceTicketOptionsFragmentFragment } }
    ) | null> | null } | null };

export type HomepageUpcomingProductionsQueryVariables = Exact<{
  now?: InputMaybe<Scalars['DateTime']>;
}>;


export type HomepageUpcomingProductionsQuery = { __typename?: 'Query', productions?: { __typename?: 'ProductionNodeConnection', edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, name: string, slug: string, subtitle?: string | null, description?: string | null, start?: any | null, end?: any | null, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, coverImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, society?: { __typename?: 'SocietyNode', id: string, name: string, slug: string } | null } | null } | null> } | null };

export type PerformanceTicketOptionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PerformanceTicketOptionsQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, capacityRemaining?: number | null, discounts: { __typename?: 'DiscountNodeConnection', edges: Array<{ __typename?: 'DiscountNodeEdge', node?: { __typename?: 'DiscountNode', id: string, name?: string | null, seatGroup?: { __typename?: 'SeatGroupNode', id: string, name: string } | null, requirements?: Array<{ __typename?: 'DiscountRequirementNode', number: number, concessionType: { __typename?: 'ConcessionTypeNode', id: string, name: string } }> | null } | null } | null> }, ticketOptions?: Array<{ __typename?: 'PerformanceSeatGroupNode', capacityRemaining?: number | null, seatGroup: { __typename?: 'SeatGroupNode', id: string, name: string, description?: string | null }, concessionTypes?: Array<{ __typename?: 'ConcessionTypeBookingType', price?: number | null, concessionType?: { __typename?: 'ConcessionTypeNode', id: string, name: string, description?: string | null } | null } | null> | null } | null> | null } | null };

export type ProductionBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type ProductionBySlugQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, name: string, subtitle?: string | null, description?: string | null, contactEmail?: string | null, ageRating?: number | null, facebookEvent?: string | null, slug: string, start?: any | null, end?: any | null, minSeatPrice?: number | null, isBookable: boolean, society?: { __typename?: 'SocietyNode', id: string, name: string, slug: string, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null, posterImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, coverImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, contentWarnings?: Array<{ __typename?: 'ProductionContentWarningNode', information?: string | null, warning: { __typename?: 'ContentWarningNode', id: string, shortDescription: string, longDescription?: string | null } }> | null, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, doorsOpen?: any | null, isBookable: boolean, start?: any | null, end?: any | null, soldOut: boolean, durationMins?: number | null, intervalDurationMins?: number | null, isOnline: boolean, isInperson: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string, publiclyListed: boolean } | null, ticketsBreakdown: { __typename?: 'PerformanceTicketsBreakdown', totalCapacity: number } } | null } | null> }, crew?: Array<{ __typename?: 'CrewMemberNode', name: string, role?: { __typename?: 'CrewRoleNode', department: CrewRoleDepartment } | null }> | null, cast?: Array<{ __typename?: 'CastMemberNode', name: string, role?: string | null, profilePicture?: { __typename?: 'ImageNode', url?: string | null } | null }> | null, productionTeam?: Array<{ __typename?: 'ProductionTeamMemberNode', name: string, role?: string | null }> | null } | null };

export type SocietyQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type SocietyQuery = { __typename?: 'Query', society?: { __typename?: 'SocietyNode', name: string, id: string, description: string, slug: string, website?: string | null, contact?: string | null, logo: { __typename?: 'ImageNode', id: string, url?: string | null }, banner: { __typename?: 'ImageNode', id: string, url?: string | null }, productions: { __typename?: 'ProductionNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, name: string, end?: any | null, isBookable: boolean, slug: string } | null } | null> } } | null };

export type UpcomingProductionsQueryVariables = Exact<{
  now?: InputMaybe<Scalars['DateTime']>;
  afterCursor?: InputMaybe<Scalars['String']>;
}>;


export type UpcomingProductionsQuery = { __typename?: 'Query', productions?: { __typename?: 'ProductionNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, name: string, slug: string, start?: any | null, end?: any | null, isBookable: boolean, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null } | null } | null> } | null };

export type UserCompletedBookingQueryVariables = Exact<{
  bookingRef: Scalars['String'];
}>;


export type UserCompletedBookingQuery = { __typename?: 'Query', me?: { __typename?: 'ExtendedUserNode', bookings: { __typename?: 'BookingNodeConnection', edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
          { __typename?: 'BookingNode' }
          & { ' $fragmentRefs'?: { 'BookingWithProductionDetailsFragment': BookingWithProductionDetailsFragment } }
        ) | null } | null> } } | null };

export type VenuesQueryVariables = Exact<{ [key: string]: never; }>;


export type VenuesQuery = { __typename?: 'Query', venues?: { __typename?: 'VenueNodeConnection', edges: Array<{ __typename?: 'VenueNodeEdge', node?: { __typename?: 'VenueNode', id: string, name: string, internalCapacity: number, slug: string, image: { __typename?: 'ImageNode', url?: string | null } } | null } | null> } | null };

export type WarningsQueryVariables = Exact<{ [key: string]: never; }>;


export type WarningsQuery = { __typename?: 'Query', warnings?: { __typename?: 'ContentWarningNodeConnection', edges: Array<{ __typename?: 'ContentWarningNodeEdge', node?: { __typename?: 'ContentWarningNode', id: string, shortDescription: string, longDescription?: string | null } | null } | null> } | null };

export type BookingLookupQueryVariables = Exact<{
  reference: Scalars['String'];
}>;


export type BookingLookupQuery = { __typename?: 'Query', bookings?: { __typename?: 'BookingNodeConnection', edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
        { __typename?: 'BookingNode' }
        & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
      ) | null } | null> } | null };

export type BookingDetailsQueryVariables = Exact<{
  bookingReference: Scalars['String'];
}>;


export type BookingDetailsQuery = { __typename?: 'Query', bookings?: { __typename?: 'BookingNodeConnection', edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
        { __typename?: 'BookingNode', createdAt: any, updatedAt: any, adminDiscountPercentage: number, creator: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string, email: string }, user?: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string, email: string } | null }
        & { ' $fragmentRefs'?: { 'BookingWithProductionDetailsFragment': BookingWithProductionDetailsFragment } }
      ) | null } | null> } | null };

export type AdminPerformanceDetailQueryVariables = Exact<{
  productionSlug: Scalars['String'];
  performanceId: Scalars['ID'];
}>;


export type AdminPerformanceDetailQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, slug: string, name: string, permissions?: Array<string | null> | null, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, description?: string | null, disabled: boolean, doorsOpen?: any | null, start?: any | null, end?: any | null, durationMins?: number | null, intervalDurationMins?: number | null, soldOut: boolean, isOnline: boolean, isInperson: boolean, isBookable: boolean, capacity?: number | null, capacityRemaining?: number | null, venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string, internalCapacity: number } | null, ticketOptions?: Array<(
            { __typename?: 'PerformanceSeatGroupNode', capacity: number, numberTicketsSold?: number | null }
            & { ' $fragmentRefs'?: { 'PerformanceTicketOptionsFragmentFragment': PerformanceTicketOptionsFragmentFragment } }
          ) | null> | null, ticketsBreakdown: { __typename?: 'PerformanceTicketsBreakdown', totalCapacity: number, totalTicketsSold: number }, salesBreakdown?: { __typename?: 'SalesBreakdownNode', societyRevenue: number } | null, discounts: { __typename?: 'DiscountNodeConnection', edges: Array<{ __typename?: 'DiscountNodeEdge', node?: { __typename?: 'DiscountNode', id: string, percentage: number, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string } | null } | null> }, seatGroup?: { __typename?: 'SeatGroupNode', id: string, name: string, description?: string | null } | null, requirements?: Array<{ __typename?: 'DiscountRequirementNode', id: string, number: number, concessionType: { __typename?: 'ConcessionTypeNode', id: string, name: string, description?: string | null } }> | null } | null } | null> } } | null } | null> } } | null };

export type AdminPerformancesIndexQueryVariables = Exact<{
  productionId?: InputMaybe<Scalars['IdInputField']>;
  productionSlug?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  take?: InputMaybe<Scalars['Int']>;
}>;


export type AdminPerformancesIndexQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, performances: { __typename?: 'PerformanceNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean }, edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, minSeatPrice?: number | null, durationMins?: number | null, intervalDurationMins?: number | null, doorsOpen?: any | null, start?: any | null, disabled: boolean, soldOut: boolean, isOnline: boolean, isBookable: boolean, isInperson: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string } | null, ticketsBreakdown: { __typename?: 'PerformanceTicketsBreakdown', totalCapacity: number, totalTicketsSold: number } } | null } | null> } } | null };

export type AdminProductionCompleteBookingsQueryVariables = Exact<{
  productionSlug: Scalars['String'];
  performanceId?: InputMaybe<Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
}>;


export type AdminProductionCompleteBookingsQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, bookings: { __typename?: 'BookingNodeConnection', pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
                { __typename?: 'BookingNode', createdAt: any, creator: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string } }
                & { ' $fragmentRefs'?: { 'BasicBookingDetailsFragment': BasicBookingDetailsFragment } }
              ) | null } | null> } } | null } | null> } } | null };

export type AdminProductionEditQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type AdminProductionEditQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, name: string, subtitle?: string | null, contactEmail?: string | null, slug: string, description?: string | null, ageRating?: number | null, facebookEvent?: string | null, isBookable: boolean, society?: { __typename?: 'SocietyNode', id: string, name: string, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null, contentWarnings?: Array<{ __typename?: 'ProductionContentWarningNode', information?: string | null, warning: { __typename?: 'ContentWarningNode', id: string, shortDescription: string, longDescription?: string | null } }> | null, coverImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, posterImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, performances: { __typename?: 'PerformanceNodeConnection', edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, doorsOpen?: any | null, start?: any | null, soldOut: boolean, isOnline: boolean, isInperson: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string } | null } | null } | null> } } | null };

export type AdminProductionPermissionsQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type AdminProductionPermissionsQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, assignablePermissions?: Array<{ __typename?: 'PermissionNode', name?: string | null, description?: string | null, userCanAssign?: boolean | null } | null> | null, assignedUsers?: Array<{ __typename?: 'UserPermissionsNode', assignedPermissions?: Array<string | null> | null, user?: { __typename?: 'ExtendedUserNode', id?: string | null, firstName: string, lastName: string, email: string } | null } | null> | null } | null };

export type AdminProductionShowQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type AdminProductionShowQuery = { __typename?: 'Query', production?: { __typename?: 'ProductionNode', id: string, name: string, subtitle?: string | null, status: ProductionStatus, slug: string, start?: any | null, end?: any | null, isBookable: boolean, totalCapacity: number, totalTicketsSold: number, permissions?: Array<string | null> | null, society?: { __typename?: 'SocietyNode', id: string, name: string } | null, salesBreakdown?: { __typename?: 'SalesBreakdownNode', societyRevenue: number } | null } | null };

export type AdminProductionsQueryVariables = Exact<{
  endGte?: InputMaybe<Scalars['DateTime']>;
  offset?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
  startLte?: InputMaybe<Scalars['DateTime']>;
  search?: InputMaybe<Scalars['String']>;
}>;


export type AdminProductionsQuery = { __typename?: 'Query', productions?: { __typename?: 'ProductionNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean }, edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, name: string, slug: string, status: ProductionStatus, start?: any | null, end?: any | null, isBookable: boolean, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, society?: { __typename?: 'SocietyNode', id: string, name: string } | null } | null } | null> } | null };

export type AdminSocietiesIndexQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminSocietiesIndexQuery = { __typename?: 'Query', societies?: { __typename?: 'SocietyNodeConnection', edges: Array<{ __typename?: 'SocietyNodeEdge', node?: { __typename?: 'SocietyNode', id: string, name: string, slug: string, permissions?: Array<string | null> | null, logo: { __typename?: 'ImageNode', id: string, url?: string | null } } | null } | null> } | null };

export type AdminVenueDetailedQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type AdminVenueDetailedQuery = { __typename?: 'Query', venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string, description?: string | null, internalCapacity: number, address: (
      { __typename?: 'AddressNode' }
      & { ' $fragmentRefs'?: { 'AddressFieldsFragment': AddressFieldsFragment } }
    ), image: { __typename?: 'ImageNode', url?: string | null }, seatGroups: { __typename?: 'SeatGroupNodeConnection', edges: Array<{ __typename?: 'SeatGroupNodeEdge', node?: { __typename?: 'SeatGroupNode', id: string, name: string, description?: string | null, capacity?: number | null } | null } | null> } } | null };

export type BoxOfficePaymentDevicesQueryVariables = Exact<{ [key: string]: never; }>;


export type BoxOfficePaymentDevicesQuery = { __typename?: 'Query', paymentDevices?: Array<{ __typename?: 'SquarePaymentDevice', id?: string | null, name?: string | null, code?: string | null, deviceId?: string | null, locationId?: string | null } | null> | null };

export type BoxOfficePerformanceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BoxOfficePerformanceQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, capacityRemaining?: number | null, disabled: boolean, doorsOpen?: any | null, start?: any | null, end?: any | null, durationMins?: number | null, soldOut: boolean, isInperson: boolean, isOnline: boolean, venue?: { __typename?: 'VenueNode', id: string, name: string, slug: string } | null, production: (
      { __typename?: 'ProductionNode' }
      & { ' $fragmentRefs'?: { 'ProductionBasicInfoFragment': ProductionBasicInfoFragment } }
    ) } | null };

export type BoxOfficePerformanceBookingQueryVariables = Exact<{
  performanceId: Scalars['ID'];
  bookingId: Scalars['ID'];
}>;


export type BoxOfficePerformanceBookingQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, bookings: { __typename?: 'BookingNodeConnection', edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
          { __typename?: 'BookingNode' }
          & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
        ) | null } | null> } } | null };

export type BoxOfficePerformanceBookingsQueryVariables = Exact<{
  id: Scalars['ID'];
  search?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<Scalars['Float']>;
  checkedIn?: InputMaybe<Scalars['Boolean']>;
}>;


export type BoxOfficePerformanceBookingsQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, bookings: { __typename?: 'BookingNodeConnection', pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
          { __typename?: 'BookingNode' }
          & { ' $fragmentRefs'?: { 'DetailedBookingDetailsFragment': DetailedBookingDetailsFragment } }
        ) | null } | null> } } | null };

export type BoxOfficePerformanceTicketBreakdownQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BoxOfficePerformanceTicketBreakdownQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, ticketsBreakdown: { __typename?: 'PerformanceTicketsBreakdown', totalCapacity: number, totalTicketsSold: number, totalTicketsCheckedIn: number, totalTicketsToCheckIn: number, totalTicketsAvailable: number } } | null };

export type BoxOfficePerformancesQueryVariables = Exact<{
  date?: InputMaybe<Scalars['Date']>;
}>;


export type BoxOfficePerformancesQuery = { __typename?: 'Query', performances?: { __typename?: 'PerformanceNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, edges: Array<{ __typename?: 'PerformanceNodeEdge', node?: { __typename?: 'PerformanceNode', id: string, start?: any | null, doorsOpen?: any | null, production: (
          { __typename?: 'ProductionNode' }
          & { ' $fragmentRefs'?: { 'ProductionBasicInfoFragment': ProductionBasicInfoFragment } }
        ), venue?: { __typename?: 'VenueNode', id: string, name: string } | null } | null } | null> } | null };

export type PerformanceByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PerformanceByIdQuery = { __typename?: 'Query', performance?: { __typename?: 'PerformanceNode', id: string, doorsOpen?: any | null, start?: any | null, end?: any | null, production: (
      { __typename?: 'ProductionNode' }
      & { ' $fragmentRefs'?: { 'ProductionBasicInfoFragment': ProductionBasicInfoFragment } }
    ) } | null };

export type AllUpcomingProductionsQueryVariables = Exact<{
  now: Scalars['DateTime'];
}>;


export type AllUpcomingProductionsQuery = { __typename?: 'Query', productions?: { __typename?: 'ProductionNodeConnection', edges: Array<{ __typename?: 'ProductionNodeEdge', node?: { __typename?: 'ProductionNode', id: string, slug: string, name: string, start?: any | null, end?: any | null, isBookable: boolean, featuredImage?: { __typename?: 'ImageNode', id: string, url?: string | null } | null, venues?: Array<{ __typename?: 'VenueNode', id: string, name: string }> | null } | null } | null> } | null };

export type VenueUpcomingProductionsQueryVariables = Exact<{
  slug: Scalars['String'];
  now: Scalars['DateTime'];
  nowDate?: InputMaybe<Scalars['Date']>;
}>;


export type VenueUpcomingProductionsQuery = { __typename?: 'Query', venue?: { __typename?: 'VenueNode', id: string, name: string, productions?: (
      { __typename?: 'ProductionNodeConnection' }
      & { ' $fragmentRefs'?: { 'ProductionsDetailsFragmentFragment': ProductionsDetailsFragmentFragment } }
    ) | null } | null };

export type CompleteBookingsQueryVariables = Exact<{
  afterCursor?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<Scalars['String']>;
  offset?: InputMaybe<Scalars['Int']>;
  max?: InputMaybe<Scalars['Int']>;
}>;


export type CompleteBookingsQuery = { __typename?: 'Query', me?: { __typename?: 'ExtendedUserNode', bookings: { __typename?: 'BookingNodeConnection', pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'BookingNodeEdge', node?: (
          { __typename?: 'BookingNode' }
          & { ' $fragmentRefs'?: { 'BasicBookingDetailsFragment': BasicBookingDetailsFragment } }
        ) | null } | null> } } | null };

export type MyAccountDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAccountDetailsQuery = { __typename?: 'Query', me?: { __typename?: 'ExtendedUserNode', firstName: string, lastName: string, email: string } | null };

export const AddressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AddressNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"buildingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"buildingName"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postcode"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]} as unknown as DocumentNode<AddressFieldsFragment, unknown>;
export const BasicBookingDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BasicBookingDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"performance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BasicBookingDetailsFragment, unknown>;
export const AllPriceBreakdownFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllPriceBreakdown"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PriceBreakdownNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"miscCosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketsPrice"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsDiscountedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"discountsValue"}},{"kind":"Field","name":{"kind":"Name","value":"subtotalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"miscCostsValue"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}}]}}]} as unknown as DocumentNode<AllPriceBreakdownFragment, unknown>;
export const BookingWithProductionDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingWithProductionDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priceBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllPriceBreakdown"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"performance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"intervalDurationMins"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerName"}},{"kind":"Field","name":{"kind":"Name","value":"providerTransactionId"}},{"kind":"Field","name":{"kind":"Name","value":"providerFee"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"cardBrand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}}]}}]}}]}}]}},...AllPriceBreakdownFragmentDoc.definitions]} as unknown as DocumentNode<BookingWithProductionDetailsFragment, unknown>;
export const BookingTicketDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingTicketDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tickets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"checkedIn"}}]}}]}}]} as unknown as DocumentNode<BookingTicketDetailsFragment, unknown>;
export const BookingPaymentDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BookingPaymentDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerName"}},{"kind":"Field","name":{"kind":"Name","value":"providerTransactionId"}},{"kind":"Field","name":{"kind":"Name","value":"providerFee"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"cardBrand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BookingPaymentDetailsFragment, unknown>;
export const DetailedBookingDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DetailedBookingDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookingNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"expired"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"salesBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPayments"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllPriceBreakdown"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingTicketDetails"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingPaymentDetails"}},{"kind":"Field","name":{"kind":"Name","value":"performance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"intervalDurationMins"}}]}}]}},...AllPriceBreakdownFragmentDoc.definitions,...BookingTicketDetailsFragmentDoc.definitions,...BookingPaymentDetailsFragmentDoc.definitions]} as unknown as DocumentNode<DetailedBookingDetailsFragment, unknown>;
export const PerformanceTicketOptionsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PerformanceTicketOptionsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PerformanceSeatGroupNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"concessionTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]} as unknown as DocumentNode<PerformanceTicketOptionsFragmentFragment, unknown>;
export const ProductionBasicInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductionBasicInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductionNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"ageRating"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"minSeatPrice"}},{"kind":"Field","name":{"kind":"Name","value":"contentWarnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"information"}},{"kind":"Field","name":{"kind":"Name","value":"warning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"longDescription"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}}]}}]} as unknown as DocumentNode<ProductionBasicInfoFragment, unknown>;
export const ProductionPerformancesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductionPerformances"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductionNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductionPerformancesFragment, unknown>;
export const ProductionsDetailsFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductionsDetailsFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductionNodeConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"runOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nowDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductionsDetailsFragmentFragment, unknown>;
export const AuthUserDetailsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUserDetails"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExtendedUserNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]} as unknown as DocumentNode<AuthUserDetailsFragment, unknown>;
export const GenerateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"end"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportOption"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"startTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"endTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"end"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"downloadUri"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GenerateReportMutation, GenerateReportMutationVariables>;
export const ConcessionTypeMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"concessionTypeMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConcessionTypeMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ConcessionTypeMutationMutation, ConcessionTypeMutationMutationVariables>;
export const DeleteDiscountMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteDiscountMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteDiscountMutationMutation, DeleteDiscountMutationMutationVariables>;
export const DeletePerformanceSeatGroupMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePerformanceSeatGroupMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerformanceSeatGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeletePerformanceSeatGroupMutationMutation, DeletePerformanceSeatGroupMutationMutationVariables>;
export const DiscountMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"discountMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DiscountMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DiscountMutationMutation, DiscountMutationMutationVariables>;
export const DiscountRequirementMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"discountRequirementMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DiscountRequirementMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discountRequirement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DiscountRequirementMutationMutation, DiscountRequirementMutationMutationVariables>;
export const PerformanceMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"performanceMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformanceMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"performance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PerformanceMutationMutation, PerformanceMutationMutationVariables>;
export const PerformanceSeatGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"performanceSeatGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PerformanceSeatGroupMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performanceSeatGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PerformanceSeatGroupMutation, PerformanceSeatGroupMutationVariables>;
export const ProductionMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"productionMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductionMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductionMutationMutation, ProductionMutationMutationVariables>;
export const ProductionPermissionsMutationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"productionPermissionsMutations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productionPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}},{"kind":"Argument","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductionPermissionsMutationsMutation, ProductionPermissionsMutationsMutationVariables>;
export const SetStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Status"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setProductionStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SetStatusMutation, SetStatusMutationVariables>;
export const BookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"booking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookingMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<BookingMutation, BookingMutationVariables>;
export const CancelPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cancelPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CancelPaymentMutation, CancelPaymentMutationVariables>;
export const DeleteBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteBookingMutation, DeleteBookingMutationVariables>;
export const PayBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"payBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"totalPence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentProvider"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idempotencyKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifyToken"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"payBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"totalPence"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentProvider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"Argument","name":{"kind":"Name","value":"deviceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"idempotencyKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idempotencyKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifyToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifyToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"cardBrand"}},{"kind":"Field","name":{"kind":"Name","value":"last4"}}]}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<PayBookingMutation, PayBookingMutationVariables>;
export const SetBookingUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"setBookingUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SetBookingUserMutation, SetBookingUserMutationVariables>;
export const CheckInBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"checkInBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tickets"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TicketIDInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkInBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingReference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}},{"kind":"Argument","name":{"kind":"Name","value":"performance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tickets"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tickets"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<CheckInBookingMutation, CheckInBookingMutationVariables>;
export const UnCheckInBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unCheckInBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tickets"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TicketIDInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uncheckInBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingReference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}},{"kind":"Argument","name":{"kind":"Name","value":"performance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"tickets"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tickets"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"booking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<UnCheckInBookingMutation, UnCheckInBookingMutationVariables>;
export const AttemptPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"attemptPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmedNewPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword1"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmedNewPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NonFieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FieldError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"field"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AttemptPasswordResetMutation, AttemptPasswordResetMutationVariables>;
export const AllSocietiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allSocieties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"societies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"9"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllSocietiesQuery, AllSocietiesQueryVariables>;
export const UserDraftBookingForPerformanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userDraftBookingForPerformance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"performance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceID"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"IN_PROGRESS","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"expired"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<UserDraftBookingForPerformanceQuery, UserDraftBookingForPerformanceQueryVariables>;
export const FullPerformanceAndTicketOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fullPerformanceAndTicketOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionBasicInfo"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionPerformances"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PerformanceTicketOptionsFragment"}}]}}]}}]}},...ProductionBasicInfoFragmentDoc.definitions,...ProductionPerformancesFragmentDoc.definitions,...PerformanceTicketOptionsFragmentFragmentDoc.definitions]} as unknown as DocumentNode<FullPerformanceAndTicketOptionsQuery, FullPerformanceAndTicketOptionsQueryVariables>;
export const HomepageUpcomingProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"homepageUpcomingProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"5"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"end_Gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PUBLISHED","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}}]}}]}}]}}]} as unknown as DocumentNode<HomepageUpcomingProductionsQuery, HomepageUpcomingProductionsQueryVariables>;
export const PerformanceTicketOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"performanceTicketOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"concessionTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PerformanceTicketOptionsQuery, PerformanceTicketOptionsQueryVariables>;
export const ProductionBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productionBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"posterImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ageRating"}},{"kind":"Field","name":{"kind":"Name","value":"facebookEvent"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"minSeatPrice"}},{"kind":"Field","name":{"kind":"Name","value":"contentWarnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"information"}},{"kind":"Field","name":{"kind":"Name","value":"warning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"longDescription"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"disabled"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"publiclyListed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"intervalDurationMins"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"crew"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"department"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cast"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"productionTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<ProductionBySlugQuery, ProductionBySlugQueryVariables>;
export const SocietyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"society"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"society"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"-start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"4"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SocietyQuery, SocietyQueryVariables>;
export const UpcomingProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"upcomingProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"9"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"end_Gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PUBLISHED","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpcomingProductionsQuery, UpcomingProductionsQueryVariables>;
export const UserCompletedBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userCompletedBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingRef"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingRef"}}},{"kind":"Argument","name":{"kind":"Name","value":"statusIn"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"PAID","block":false},{"kind":"StringValue","value":"CANCELLED","block":false}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingWithProductionDetails"}}]}}]}}]}}]}}]}},...BookingWithProductionDetailsFragmentDoc.definitions]} as unknown as DocumentNode<UserCompletedBookingQuery, UserCompletedBookingQueryVariables>;
export const VenuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"internalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VenuesQuery, VenuesQueryVariables>;
export const WarningsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"warnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"warnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"longDescription"}}]}}]}}]}}]}}]} as unknown as DocumentNode<WarningsQuery, WarningsQueryVariables>;
export const BookingLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookingLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<BookingLookupQuery, BookingLookupQueryVariables>;
export const BookingDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"bookingDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingReference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingReference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BookingWithProductionDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminDiscountPercentage"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}},...BookingWithProductionDetailsFragmentDoc.definitions]} as unknown as DocumentNode<BookingDetailsQuery, BookingDetailsQueryVariables>;
export const AdminPerformanceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminPerformanceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"internalCapacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"intervalDurationMins"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"ticketOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PerformanceTicketOptionsFragment"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"numberTicketsSold"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ticketsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsSold"}}]}},{"kind":"Field","name":{"kind":"Name","value":"salesBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"societyRevenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"seatGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"concessionType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}},...PerformanceTicketOptionsFragmentFragmentDoc.definitions]} as unknown as DocumentNode<AdminPerformanceDetailQuery, AdminPerformanceDetailQueryVariables>;
export const AdminPerformancesIndexDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminPerformancesIndex"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IdInputField"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"disabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"disabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"minSeatPrice"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"intervalDurationMins"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsSold"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminPerformancesIndexQuery, AdminPerformancesIndexQueryVariables>;
export const AdminProductionCompleteBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminProductionCompleteBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productionSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"expired"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BasicBookingDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"creator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]}}]}}]}}]}},...BasicBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<AdminProductionCompleteBookingsQuery, AdminProductionCompleteBookingsQueryVariables>;
export const AdminProductionEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminProductionEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"contactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"contentWarnings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"information"}},{"kind":"Field","name":{"kind":"Name","value":"warning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shortDescription"}},{"kind":"Field","name":{"kind":"Name","value":"longDescription"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"coverImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posterImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ageRating"}},{"kind":"Field","name":{"kind":"Name","value":"facebookEvent"}},{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}}]}}]}}]} as unknown as DocumentNode<AdminProductionEditQuery, AdminProductionEditQueryVariables>;
export const AdminProductionPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminProductionPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignablePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userCanAssign"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedPermissions"}}]}}]}}]}}]} as unknown as DocumentNode<AdminProductionPermissionsQuery, AdminProductionPermissionsQueryVariables>;
export const AdminProductionShowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminProductionShow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"production"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subtitle"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"salesBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"societyRevenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsSold"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<AdminProductionShowQuery, AdminProductionShowQueryVariables>;
export const AdminProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endGte"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startLte"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"-start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"userHasPermission"},"value":{"kind":"StringValue","value":"view_production","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"start_Lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startLte"}}},{"kind":"Argument","name":{"kind":"Name","value":"end_Gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endGte"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"society"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminProductionsQuery, AdminProductionsQueryVariables>;
export const AdminSocietiesIndexDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminSocietiesIndex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"societies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userHasPermission"},"value":{"kind":"StringValue","value":"add_production","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AdminSocietiesIndexQuery, AdminSocietiesIndexQueryVariables>;
export const AdminVenueDetailedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminVenueDetailed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddressFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"internalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"seatGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}}]}}]}}]}}]}},...AddressFieldsFragmentDoc.definitions]} as unknown as DocumentNode<AdminVenueDetailedQuery, AdminVenueDetailedQueryVariables>;
export const BoxOfficePaymentDevicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePaymentDevices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentDevices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentProvider"},"value":{"kind":"EnumValue","value":"SQUARE_POS"}},{"kind":"Argument","name":{"kind":"Name","value":"paired"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"deviceId"}},{"kind":"Field","name":{"kind":"Name","value":"locationId"}}]}}]}}]} as unknown as DocumentNode<BoxOfficePaymentDevicesQuery, BoxOfficePaymentDevicesQueryVariables>;
export const BoxOfficePerformanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePerformance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacityRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"durationMins"}},{"kind":"Field","name":{"kind":"Name","value":"soldOut"}},{"kind":"Field","name":{"kind":"Name","value":"isInperson"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionBasicInfo"}}]}}]}}]}},...ProductionBasicInfoFragmentDoc.definitions]} as unknown as DocumentNode<BoxOfficePerformanceQuery, BoxOfficePerformanceQueryVariables>;
export const BoxOfficePerformanceBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePerformanceBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"performanceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<BoxOfficePerformanceBookingQuery, BoxOfficePerformanceBookingQueryVariables>;
export const BoxOfficePerformanceBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePerformanceBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"discount"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PAID","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"expired"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"adminDiscountPercentage"},"value":{"kind":"Variable","name":{"kind":"Name","value":"discount"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkedIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkedIn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DetailedBookingDetails"}}]}}]}}]}}]}}]}},...DetailedBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<BoxOfficePerformanceBookingsQuery, BoxOfficePerformanceBookingsQueryVariables>;
export const BoxOfficePerformanceTicketBreakdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePerformanceTicketBreakdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ticketsBreakdown"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCapacity"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsSold"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsCheckedIn"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsToCheckIn"}},{"kind":"Field","name":{"kind":"Name","value":"totalTicketsAvailable"}}]}}]}}]}}]} as unknown as DocumentNode<BoxOfficePerformanceTicketBreakdownQuery, BoxOfficePerformanceTicketBreakdownQueryVariables>;
export const BoxOfficePerformancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"boxOfficePerformances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"9"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"runOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"hasBoxofficePermissions"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionBasicInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"venue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},...ProductionBasicInfoFragmentDoc.definitions]} as unknown as DocumentNode<BoxOfficePerformancesQuery, BoxOfficePerformancesQueryVariables>;
export const PerformanceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"performanceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"performance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"doorsOpen"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"production"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionBasicInfo"}}]}}]}}]}},...ProductionBasicInfoFragmentDoc.definitions]} as unknown as DocumentNode<PerformanceByIdQuery, PerformanceByIdQueryVariables>;
export const AllUpcomingProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUpcomingProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"end_Gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PUBLISHED","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"isBookable"}},{"kind":"Field","name":{"kind":"Name","value":"featuredImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"venues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllUpcomingProductionsQuery, AllUpcomingProductionsQueryVariables>;
export const VenueUpcomingProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"venueUpcomingProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nowDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"venue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"productions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"start","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"end_Gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"StringValue","value":"PUBLISHED","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductionsDetailsFragment"}}]}}]}}]}},...ProductionsDetailsFragmentFragmentDoc.definitions]} as unknown as DocumentNode<VenueUpcomingProductionsQuery, VenueUpcomingProductionsQueryVariables>;
export const CompleteBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"completeBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"start","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"statusIn"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"PAID","block":false},{"kind":"StringValue","value":"CANCELLED","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterCursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BasicBookingDetails"}}]}}]}}]}}]}}]}},...BasicBookingDetailsFragmentDoc.definitions]} as unknown as DocumentNode<CompleteBookingsQuery, CompleteBookingsQueryVariables>;
export const MyAccountDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAccountDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<MyAccountDetailsQuery, MyAccountDetailsQueryVariables>;