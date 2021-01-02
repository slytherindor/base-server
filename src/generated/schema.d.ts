import {GraphQLResolveInfo} from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  {[SubKey in K]?: Maybe<T[SubKey]>};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  {[SubKey in K]: Maybe<T[SubKey]>};
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  {[P in K]-?: NonNullable<T[P]>};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type GQLBook = {
  __typename?: 'Book';
  id: Scalars['Int'];
  title: Scalars['String'];
  authorId: Scalars['Int'];
  author?: Maybe<GQLAuthor>;
};

export type GQLAuthor = {
  __typename?: 'Author';
  name: Scalars['String'];
  books?: Maybe<Array<Maybe<GQLBook>>>;
};

export type GQLUser = {
  __typename?: 'User';
  name: Scalars['String'];
};

export type GQLProject = {
  __typename?: 'Project';
  name: Scalars['String'];
  description: Scalars['String'];
  language?: Maybe<Scalars['String']>;
  repoUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type GQLQuery = {
  __typename?: 'Query';
  books: Array<GQLBook>;
  authors?: Maybe<Array<Maybe<GQLAuthor>>>;
  users?: Maybe<Array<Maybe<GQLUser>>>;
  author?: Maybe<GQLAuthor>;
  book: GQLBook;
  repos: Array<Maybe<GQLProject>>;
};

export type GQLQueryBookArgs = {
  id: Scalars['Int'];
};

export type GQLMutation = {
  __typename?: 'Mutation';
  addBook: GQLBook;
};

export type GQLMutationAddBookArgs = {
  book: GQLBookInput;
};

export type GQLBookInput = {
  title: Scalars['String'];
  authorId: Scalars['Int'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    {[key in TKey]: TResult},
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    {[key in TKey]: TResult},
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type GQLResolversTypes = ResolversObject<{
  Book: ResolverTypeWrapper<GQLBook>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Author: ResolverTypeWrapper<GQLAuthor>;
  User: ResolverTypeWrapper<GQLUser>;
  Project: ResolverTypeWrapper<GQLProject>;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  BookInput: GQLBookInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type GQLResolversParentTypes = ResolversObject<{
  Book: GQLBook;
  Int: Scalars['Int'];
  String: Scalars['String'];
  Author: GQLAuthor;
  User: GQLUser;
  Project: GQLProject;
  Query: {};
  Mutation: {};
  BookInput: GQLBookInput;
  Boolean: Scalars['Boolean'];
}>;

export type GQLBookResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['Book'] = GQLResolversParentTypes['Book']
> = ResolversObject<{
  id?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  authorId?: Resolver<GQLResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<
    Maybe<GQLResolversTypes['Author']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GQLAuthorResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['Author'] = GQLResolversParentTypes['Author']
> = ResolversObject<{
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  books?: Resolver<
    Maybe<Array<Maybe<GQLResolversTypes['Book']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GQLUserResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['User'] = GQLResolversParentTypes['User']
> = ResolversObject<{
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GQLProjectResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['Project'] = GQLResolversParentTypes['Project']
> = ResolversObject<{
  name?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  language?: Resolver<
    Maybe<GQLResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  repoUrl?: Resolver<
    Maybe<GQLResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<GQLResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GQLQueryResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['Query'] = GQLResolversParentTypes['Query']
> = ResolversObject<{
  books?: Resolver<Array<GQLResolversTypes['Book']>, ParentType, ContextType>;
  authors?: Resolver<
    Maybe<Array<Maybe<GQLResolversTypes['Author']>>>,
    ParentType,
    ContextType
  >;
  users?: Resolver<
    Maybe<Array<Maybe<GQLResolversTypes['User']>>>,
    ParentType,
    ContextType
  >;
  author?: Resolver<
    Maybe<GQLResolversTypes['Author']>,
    ParentType,
    ContextType
  >;
  book?: Resolver<
    GQLResolversTypes['Book'],
    ParentType,
    ContextType,
    RequireFields<GQLQueryBookArgs, 'id'>
  >;
  repos?: Resolver<
    Array<Maybe<GQLResolversTypes['Project']>>,
    ParentType,
    ContextType
  >;
}>;

export type GQLMutationResolvers<
  ContextType = any,
  ParentType extends GQLResolversParentTypes['Mutation'] = GQLResolversParentTypes['Mutation']
> = ResolversObject<{
  addBook?: Resolver<
    GQLResolversTypes['Book'],
    ParentType,
    ContextType,
    RequireFields<GQLMutationAddBookArgs, 'book'>
  >;
}>;

export type GQLResolvers<ContextType = any> = ResolversObject<{
  Book?: GQLBookResolvers<ContextType>;
  Author?: GQLAuthorResolvers<ContextType>;
  User?: GQLUserResolvers<ContextType>;
  Project?: GQLProjectResolvers<ContextType>;
  Query?: GQLQueryResolvers<ContextType>;
  Mutation?: GQLMutationResolvers<ContextType>;
}>;
