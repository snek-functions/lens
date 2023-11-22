
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

export enum OAuthProvider {
    google = "google",
    azure = "azure"
}
export enum Language {
    EN = "EN",
    DE = "DE"
}
export enum Privacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FRIENDS = "FRIENDS"
}
export enum LanguageInputInput {
    EN = "EN",
    DE = "DE"
}
export enum MOST_RECENT_MOST_STARREDInputInput {
    MOST_RECENT = "MOST_RECENT",
    MOST_STARRED = "MOST_STARRED"
}
export enum PrivacyInputInput {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FRIENDS = "FRIENDS"
}
export enum OAuthProviderInputInput {
    google = "google",
    azure = "azure"
}
export enum EmailAddressTypeInputInput {
    EMAIL_ADDRESS = "EMAIL_ADDRESS",
    EMAIL_ID = "EMAIL_ID",
    USER_ID = "USER_ID"
}

export type ArgsInput = {
    filter?: FilterInput_1Input;
};
export type FilterInput_1Input = {
    emailId?: t.String;
    emailAddress?: t.String;
};
export type ArgsInput_1_2 = {
    name: t.String;
};
export type ArgsInput_1 = {
    id: t.String;
};
export type FiltersInput_1_2_3_4_5_6Input = {
    userId?: t.String;
};
export type FiltersInput_1_2Input = {
    query?: t.String;
    from?: t.String;
    to?: t.String;
    language?: LanguageInputInput;
    orderBy?: MOST_RECENT_MOST_STARREDInputInput;
};
export type FiltersInput_1_2_3Input = {
    query?: t.String;
    from?: t.String;
    to?: t.String;
    language?: LanguageInputInput;
    orderBy?: MOST_RECENT_MOST_STARREDInputInput;
};
export type FiltersInput_1_2_3_4Input = {
    userId?: t.String;
    from?: t.String;
    to?: t.String;
};
export type FiltersInput_1_2_3_4_5Input = {
    userId?: t.String;
    from?: t.String;
    to?: t.String;
};
export type FiltersInputInput = {
    userId?: t.String;
    privacy?: PrivacyInputInput;
    language?: LanguageInputInput;
    query?: t.String;
    from?: t.String;
    to?: t.String;
};
export type FiltersInput_1Input = {
    userId?: t.String;
    language?: LanguageInputInput;
};
export type ValuesInputInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    details?: DetailsInputInput;
};
export type DetailsInputInput = {
    firstName?: t.String;
    lastName?: t.String;
};
export type ValuesInput_1Input = {
    username?: t.String;
    password?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
    details?: DetailsInput_1Input;
    roles?: t.String[];
};
export type DetailsInput_1Input = {
    firstName?: t.String;
    lastName?: t.String;
    avatarFile?: t.String;
};
export type EmailConfigCreateInputInput = {
    externalCredentialId: t.String;
    isEnabled?: t.Boolean;
};
export type ValuesInput_1_2Input = {
    emailAddress?: t.String;
    isPrimary?: t.Boolean;
    config?: EmailConfigUpdateInputInput;
};
export type EmailConfigUpdateInputInput = {
    externalCredentialId?: t.String;
    isEnabled?: t.Boolean;
};
export type SMTPCredentialInputInput = {
    host: t.String;
    port: t.Number;
    username: t.String;
    password: t.String;
    secure: t.Boolean;
};
export type OAuthCredentialInputInput = {
    provider: OAuthProviderInputInput;
    accessToken: t.String;
    refreshToken: t.String;
};
export type ShopifyProductCreateInput = {
    handle?: t.String;
    title: t.String;
    descriptionHtml?: t.String;
    metafields?: MetafieldsInput[];
    productType?: t.String;
    tags?: t.String[];
    variants?: VariantsInput;
    vendor?: t.String;
};
export type MetafieldsInput = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
export type VariantsInput = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput;
};
export type InventoryItemInput = {
    tracked?: t.Boolean;
};
export type ShopifyProductUpdateInput = {
    id: t.String;
    handle?: t.String;
    title?: t.String;
    descriptionHtml?: t.String;
    metafields?: MetafieldsInput_1[];
    productType?: t.String;
    tags?: t.String[];
    variants?: VariantsInput_1;
    vendor?: t.String;
};
export type MetafieldsInput_1 = {
    namespace: t.String;
    key: t.String;
    value: t.String;
    type: t.String;
};
export type VariantsInput_1 = {
    price?: t.String;
    compareAtPrice?: t.String;
    sku?: t.String;
    taxable?: t.Boolean;
    inventoryPolicy?: t.String;
    inventoryItem?: InventoryItemInput_1;
};
export type InventoryItemInput_1 = {
    tracked?: t.Boolean;
};
export type EmailEnvelopeInputInput = {
    from?: EmailAddressInputInput;
    to?: EmailAddressInputInput[];
    subject?: t.String;
    replyTo?: EmailAddressInputInput;
};
export type EmailAddressInputInput = {
    value: t.String;
    type: EmailAddressTypeInputInput;
};
export type TemplateInputInput = {
    id: t.String;
    values: t.NotSupportedYet;
};
export type ProfileUpdateDataInputInput = {
    language?: LanguageInputInput;
    bio?: t.String;
};
export type PostDataInputInput = {
    title: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInputInput;
    language?: LanguageInputInput;
};
export type PostUpdateDataInputInput = {
    title?: t.String;
    language?: LanguageInputInput;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInputInput;
};

export class Query {
    __typename: t.String;
    user: (args?: {
        id?: t.String;
        resourceId?: t.String;
        login?: t.String;
    }) => ObjectAndUser;
    allUser: (args: {
        resourceId: t.String;
    }) => User[];
    userMe: User;
    resource: (args: {
        id: t.String;
    }) => Resource;
    shopifyAllProductId: (args: {
        resourceId: t.String;
    }) => t.String[];
    socialPost: (args?: {
        postId?: t.String;
        slug?: t.String;
    }) => Post;
    allSocialPost: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInputInput;
    }) => Connection_1;
    allSocialPostTrending: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1Input;
    }) => Connection_1;
    version: t.String;
    constructor() { this.__typename = ""; this.user = fnProxy(ObjectAndUser); this.allUser = fnArrayProxy(User); this.userMe = proxy(User); this.resource = fnProxy(Resource); this.shopifyAllProductId = () => []; this.socialPost = fnProxy(Post); this.allSocialPost = fnProxy(Connection_1); this.allSocialPostTrending = fnProxy(Connection_1); this.version = ""; }
}
export class ObjectAndUser {
    __typename: t.String;
    isActive: t.Boolean;
    id: t.String;
    username: t.String;
    resourceId: t.String;
    accountId: t.String;
    isAdmin: t.Boolean;
    createdAt: t.String;
    updatedAt: t.String;
    roles: Roles[];
    primaryEmailAddress: t.String;
    email: (args?: {
        args?: ArgsInput;
    }) => Email;
    emails: Email[];
    account: Account;
    resource: Resource_1;
    tokens: Token[];
    details: t.Nullable<Details>;
    externalCredential: (args: {
        args: ArgsInput_1;
    }) => ExternalCredential;
    externalCredentials: ExternalCredential[];
    profile: t.Nullable<Profile>;
    constructor() { this.__typename = ""; this.isActive = false; this.id = ""; this.username = ""; this.resourceId = ""; this.accountId = ""; this.isAdmin = false; this.createdAt = ""; this.updatedAt = ""; this.roles = arrayProxy(Roles); this.primaryEmailAddress = ""; this.email = fnProxy(Email); this.emails = arrayProxy(Email); this.account = proxy(Account); this.resource = proxy(Resource_1); this.tokens = arrayProxy(Token); this.details = proxy(Details); this.externalCredential = fnProxy(ExternalCredential); this.externalCredentials = arrayProxy(ExternalCredential); this.profile = proxy(Profile); }
}
export class Roles {
    __typename: t.String;
    id: t.String;
    description: t.String;
    resourceId: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.description = ""; this.resourceId = ""; this.createdAt = ""; this.updatedAt = ""; }
}
export class Email {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    resourceId: t.String;
    isPrimary: t.Boolean;
    isVerified: t.Boolean;
    userId: t.Nullable<t.String>;
    config: t.Nullable<EmailConfig>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.resourceId = ""; this.isPrimary = false; this.isVerified = false; this.userId = null; this.config = proxy(EmailConfig); }
}
export class EmailConfig {
    __typename: t.String;
    id: t.String;
    isEnabled: t.Boolean;
    externalCredential: ExternalCredential;
    constructor() { this.__typename = ""; this.id = ""; this.isEnabled = false; this.externalCredential = proxy(ExternalCredential); }
}
export class ExternalCredential {
    __typename: t.String;
    id: t.String;
    smtp: t.Nullable<SMTPCredential>;
    oauth: t.Nullable<OAuthCredential>;
    constructor() { this.__typename = ""; this.id = ""; this.smtp = proxy(SMTPCredential); this.oauth = proxy(OAuthCredential); }
}
export class SMTPCredential {
    __typename: t.String;
    host: t.String;
    port: t.Number;
    username: t.String;
    password: t.String;
    secure: t.Boolean;
    constructor() { this.__typename = ""; this.host = ""; this.port = null; this.username = ""; this.password = ""; this.secure = false; }
}
export class OAuthCredential {
    __typename: t.String;
    provider: t.Nullable<OAuthProvider>;
    accessToken: t.String;
    refreshToken: t.String;
    constructor() { this.__typename = ""; this.provider = null; this.accessToken = ""; this.refreshToken = ""; }
}
export class Account {
    __typename: t.String;
    id: t.String;
    users: User[];
    constructor() { this.__typename = ""; this.id = ""; this.users = arrayProxy(User); }
}
export class User {
    __typename: t.String;
    isActive: t.Boolean;
    id: t.String;
    username: t.String;
    resourceId: t.String;
    accountId: t.String;
    isAdmin: t.Boolean;
    createdAt: t.String;
    updatedAt: t.String;
    roles: Roles[];
    primaryEmailAddress: t.String;
    email: (args?: {
        args?: ArgsInput;
    }) => Email;
    emails: Email[];
    account: Account;
    resource: Resource_1;
    tokens: Token[];
    details: t.Nullable<Details>;
    externalCredential: (args: {
        args: ArgsInput_1;
    }) => ExternalCredential;
    externalCredentials: ExternalCredential[];
    constructor() { this.__typename = ""; this.isActive = false; this.id = ""; this.username = ""; this.resourceId = ""; this.accountId = ""; this.isAdmin = false; this.createdAt = ""; this.updatedAt = ""; this.roles = arrayProxy(Roles); this.primaryEmailAddress = ""; this.email = fnProxy(Email); this.emails = arrayProxy(Email); this.account = proxy(Account); this.resource = proxy(Resource_1); this.tokens = arrayProxy(Token); this.details = proxy(Details); this.externalCredential = fnProxy(ExternalCredential); this.externalCredentials = arrayProxy(ExternalCredential); }
}
export class Resource_1 {
    __typename: t.String;
    id: t.String;
    name: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    roles: Roles[];
    users: User[];
    config: GenericObject;
    secrets: SecretObject[];
    secret: (args: {
        args: ArgsInput_1_2;
    }) => SecretObject;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.createdAt = ""; this.updatedAt = ""; this.roles = arrayProxy(Roles); this.users = arrayProxy(User); this.config = proxy(GenericObject); this.secrets = arrayProxy(SecretObject); this.secret = fnProxy(SecretObject); }
}
export class GenericObject {
    __typename: t.String;
    id: t.String;
    value: t.NotSupportedYet;
    tag: t.Nullable<t.String>;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.id = ""; this.value = null; this.tag = null; this.expiresAt = null; }
}
export class SecretObject {
    __typename: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.name = ""; this.value = null; this.expiresAt = null; }
}
export class Token {
    __typename: t.String;
    id: t.String;
    name: t.String;
    expiresAt: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.expiresAt = null; }
}
export class Details {
    __typename: t.String;
    firstName: t.Nullable<t.String>;
    lastName: t.Nullable<t.String>;
    avatarURL: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.firstName = null; this.lastName = null; this.avatarURL = null; }
}
export class Profile {
    __typename: t.String;
    id: t.String;
    bio: t.Nullable<t.String>;
    createdAt: t.String;
    updatedAt: t.String;
    language: t.Nullable<Language>;
    posts: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
    }) => Connection_1;
    starredPosts: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1_2Input;
    }) => Connection_1_2;
    stars: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1_2_3Input;
    }) => Connection_1_2_3;
    followers: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1_2_3_4Input;
    }) => Connection_1_2_3_4;
    following: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1_2_3_4_5Input;
    }) => Connection_1_2_3_4_5;
    activity: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
    }) => Connection_1_2_3_4_5_6;
    views: t.Number;
    constructor() { this.__typename = ""; this.id = ""; this.bio = null; this.createdAt = ""; this.updatedAt = ""; this.language = null; this.posts = fnProxy(Connection_1); this.starredPosts = fnProxy(Connection_1_2); this.stars = fnProxy(Connection_1_2_3); this.followers = fnProxy(Connection_1_2_3_4); this.following = fnProxy(Connection_1_2_3_4_5); this.activity = fnProxy(Connection_1_2_3_4_5_6); this.views = null; }
}
export class Connection_1 {
    __typename: t.String;
    nodes: Post[];
    edges: Edge[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Post); this.edges = arrayProxy(Edge); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Post {
    __typename: t.String;
    id: t.String;
    slug: t.String;
    title: t.String;
    avatarURL: t.Nullable<t.String>;
    summary: t.Nullable<t.String>;
    content: t.Nullable<t.String>;
    profileId: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    privacy: t.Nullable<Privacy>;
    language: t.Nullable<Language>;
    matchingQuery: t.Nullable<t.String>;
    profile: t.Nullable<Profile>;
    stars: (args?: {
        after?: t.String;
        before?: t.String;
        first?: t.Number;
        last?: t.Number;
        filters?: FiltersInput_1_2_3_4_5_6Input;
    }) => Connection_1_2_3_4_5_6_7;
    views: t.Number;
    constructor() { this.__typename = ""; this.id = ""; this.slug = ""; this.title = ""; this.avatarURL = null; this.summary = null; this.content = null; this.profileId = ""; this.createdAt = ""; this.updatedAt = ""; this.privacy = null; this.language = null; this.matchingQuery = null; this.profile = proxy(Profile); this.stars = fnProxy(Connection_1_2_3_4_5_6_7); this.views = null; }
}
export class Connection_1_2_3_4_5_6_7 {
    __typename: t.String;
    nodes: Nodes[];
    edges: Edge_1[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes); this.edges = arrayProxy(Edge_1); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes {
    __typename: t.String;
    id: t.String;
    profile: Profile;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.profile = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes); }
}
export class PageInfo {
    __typename: t.String;
    hasNextPage: t.Boolean;
    hasPreviousPage: t.Boolean;
    startCursor: t.Nullable<t.String>;
    endCursor: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.hasNextPage = false; this.hasPreviousPage = false; this.startCursor = null; this.endCursor = null; }
}
export class Edge {
    __typename: t.String;
    cursor: t.String;
    node: Post;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Post); }
}
export class Connection_1_2 {
    __typename: t.String;
    nodes: Nodes_1[];
    edges: Edge_1_2[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1); this.edges = arrayProxy(Edge_1_2); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1 {
    __typename: t.String;
    id: t.String;
    post: Post;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Edge_1_2 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1); }
}
export class Connection_1_2_3 {
    __typename: t.String;
    nodes: Nodes_1_2[];
    edges: Edge_1_2_3[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2); this.edges = arrayProxy(Edge_1_2_3); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2 {
    __typename: t.String;
    id: t.String;
    post: Post;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Edge_1_2_3 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2); }
}
export class Connection_1_2_3_4 {
    __typename: t.String;
    nodes: Nodes_1_2_3[];
    edges: Edge_1_2_3_4[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3); this.edges = arrayProxy(Edge_1_2_3_4); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3 {
    __typename: t.String;
    id: t.String;
    follower: Profile;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.follower = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1_2_3_4 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3); }
}
export class Connection_1_2_3_4_5 {
    __typename: t.String;
    nodes: Nodes_1_2_3_4[];
    edges: Edge_1_2_3_4_5[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3_4); this.edges = arrayProxy(Edge_1_2_3_4_5); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3_4 {
    __typename: t.String;
    id: t.String;
    followed: Profile;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.followed = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1_2_3_4_5 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3_4;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3_4); }
}
export class Connection_1_2_3_4_5_6 {
    __typename: t.String;
    nodes: Nodes_1_2_3_4_5[];
    edges: Edge_1_2_3_4_5_6[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3_4_5); this.edges = arrayProxy(Edge_1_2_3_4_5_6); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3_4_5 {
    __typename: t.String;
    id: t.String;
    createdAt: t.String;
    type: t.String;
    post: t.Nullable<Post>;
    follow: t.Nullable<Follow>;
    constructor() { this.__typename = ""; this.id = ""; this.createdAt = ""; this.type = ""; this.post = proxy(Post); this.follow = proxy(Follow); }
}
export class Follow {
    __typename: t.String;
    createdAt: t.String;
    followed: Profile;
    constructor() { this.__typename = ""; this.createdAt = ""; this.followed = proxy(Profile); }
}
export class Edge_1_2_3_4_5_6 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3_4_5;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3_4_5); }
}
export class Resource {
    __typename: t.String;
    id: t.String;
    name: t.String;
    config: t.NotSupportedYet;
    secret: (args: {
        name: t.String;
    }) => Secret;
    constructor() { this.__typename = ""; this.id = ""; this.name = ""; this.config = null; this.secret = fnProxy(Secret); }
}
export class Secret {
    __typename: t.String;
    name: t.String;
    value: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.name = ""; this.value = null; }
}
export class Mutation {
    __typename: t.String;
    passwordReset: (args: {
        emailAddress: t.String;
        resourceId: t.String;
    }) => t.Boolean;
    passwordResetConfirm: (args: {
        emailAddress: t.String;
        resourceId: t.String;
        password: t.String;
        otp: t.String;
    }) => t.Boolean;
    userSignIn: (args: {
        login: t.String;
        password: t.String;
        resourceId: t.String;
    }) => UserSignIn;
    userSignOut: (args?: {
        resourceId?: t.String;
    }) => t.NotSupportedYet;
    userRefresh: (args: {
        accessToken: t.String;
        refreshToken: t.String;
    }) => UserRefresh;
    userRegister: (args: {
        resourceId: t.String;
        values: ValuesInputInput;
        skipEmailVerification?: t.Boolean;
    }) => User;
    userCreate: (args: {
        resourceId: t.String;
        values: ValuesInputInput;
        skipEmailVerification?: t.Boolean;
        createProfile?: t.Boolean;
    }) => UserCreate;
    userCreateConfirm: (args: {
        userId: t.String;
        otp: t.String;
    }) => User;
    userUpdate: (args: {
        id: t.String;
        values: ValuesInput_1Input;
    }) => User;
    userDelete: (args: {
        id: t.String;
    }) => t.Boolean;
    userEmailCreate: (args: {
        emailAddress: t.String;
        isPrimary?: t.Boolean;
        config?: EmailConfigCreateInputInput;
    }) => UserEmail;
    userEmailConfirm: (args: {
        emailId: t.String;
        otp: t.String;
    }) => UserEmailConfirm;
    userEmailConfirmationResend: (args: {
        emailId: t.String;
    }) => Email;
    userEmailUpdate: (args: {
        emailId: t.String;
        values: ValuesInput_1_2Input;
    }) => UserEmail;
    userEmailDelete: (args: {
        emailId: t.String;
    }) => t.Boolean;
    userExternalCredentialCreate: (args?: {
        smtp?: SMTPCredentialInputInput;
        oauth?: OAuthCredentialInputInput;
    }) => t.String;
    userTokenCreate: (args: {
        userId: t.String;
        name: t.String;
    }) => t.String;
    jaenPublish: (args: {
        resourceId: t.String;
        migrationURL: t.String;
    }) => t.String;
    shopifyProductCreate: (args: {
        resourceId: t.String;
        input: ShopifyProductCreateInput;
    }) => t.String;
    shopifyProductUpdate: (args: {
        resourceId: t.String;
        input: ShopifyProductUpdateInput;
    }) => t.String;
    shopifyProductDelete: (args: {
        resourceId: t.String;
        id: t.String;
    }) => t.String;
    mailpressMailSchedule: (args: {
        envelope: EmailEnvelopeInputInput;
        body?: t.String;
        bodyHTML?: t.String;
        template?: TemplateInputInput;
    }) => t.String;
    socialProfileUpdate: (args: {
        values: ProfileUpdateDataInputInput;
    }) => Profile;
    socialProfileFollow: (args: {
        userId: t.String;
    }) => ProfileFollow;
    socialProfileUnfollow: (args: {
        userId: t.String;
    }) => ProfileFollow;
    socialPostCreate: (args: {
        values: PostDataInputInput;
    }) => Post;
    socialPostUpdate: (args: {
        postId: t.String;
        values: PostUpdateDataInputInput;
    }) => Post;
    socialPostDelete: (args: {
        postId: t.String;
    }) => t.Boolean;
    socialPostStar: (args: {
        postId: t.String;
    }) => PostStar;
    socialPostUnstar: (args: {
        postId: t.String;
    }) => PostStar;
    constructor() { this.__typename = ""; this.passwordReset = () => false; this.passwordResetConfirm = () => false; this.userSignIn = fnProxy(UserSignIn); this.userSignOut = () => null; this.userRefresh = fnProxy(UserRefresh); this.userRegister = fnProxy(User); this.userCreate = fnProxy(UserCreate); this.userCreateConfirm = fnProxy(User); this.userUpdate = fnProxy(User); this.userDelete = () => false; this.userEmailCreate = fnProxy(UserEmail); this.userEmailConfirm = fnProxy(UserEmailConfirm); this.userEmailConfirmationResend = fnProxy(Email); this.userEmailUpdate = fnProxy(UserEmail); this.userEmailDelete = () => false; this.userExternalCredentialCreate = () => ""; this.userTokenCreate = () => ""; this.jaenPublish = () => ""; this.shopifyProductCreate = () => ""; this.shopifyProductUpdate = () => ""; this.shopifyProductDelete = () => ""; this.mailpressMailSchedule = () => ""; this.socialProfileUpdate = fnProxy(Profile); this.socialProfileFollow = fnProxy(ProfileFollow); this.socialProfileUnfollow = fnProxy(ProfileFollow); this.socialPostCreate = fnProxy(Post); this.socialPostUpdate = fnProxy(Post); this.socialPostDelete = () => false; this.socialPostStar = fnProxy(PostStar); this.socialPostUnstar = fnProxy(PostStar); }
}
export class UserSignIn {
    __typename: t.String;
    tokenPair: TokenPair;
    user: ObjectAndUser;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(ObjectAndUser); }
}
export class TokenPair {
    __typename: t.String;
    id: t.String;
    accessToken: t.String;
    refreshToken: t.String;
    headers: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.id = ""; this.accessToken = ""; this.refreshToken = ""; this.headers = null; }
}
export class UserRefresh {
    __typename: t.String;
    tokenPair: TokenPair_1;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair_1); this.me = proxy(User); }
}
export class TokenPair_1 {
    __typename: t.String;
    accessToken: t.String;
    refreshToken: t.String;
    constructor() { this.__typename = ""; this.accessToken = ""; this.refreshToken = ""; }
}
export class UserCreate {
    __typename: t.String;
    profile: t.Nullable<Profile>;
    isActive: t.Boolean;
    id: t.String;
    username: t.String;
    resourceId: t.String;
    accountId: t.String;
    isAdmin: t.Boolean;
    createdAt: t.String;
    updatedAt: t.String;
    roles: Roles[];
    primaryEmailAddress: t.String;
    email: (args?: {
        args?: ArgsInput;
    }) => Email;
    emails: Email[];
    account: Account;
    resource: Resource_1;
    tokens: Token[];
    details: t.Nullable<Details>;
    externalCredential: (args: {
        args: ArgsInput_1;
    }) => ExternalCredential;
    externalCredentials: ExternalCredential[];
    constructor() { this.__typename = ""; this.profile = proxy(Profile); this.isActive = false; this.id = ""; this.username = ""; this.resourceId = ""; this.accountId = ""; this.isAdmin = false; this.createdAt = ""; this.updatedAt = ""; this.roles = arrayProxy(Roles); this.primaryEmailAddress = ""; this.email = fnProxy(Email); this.emails = arrayProxy(Email); this.account = proxy(Account); this.resource = proxy(Resource_1); this.tokens = arrayProxy(Token); this.details = proxy(Details); this.externalCredential = fnProxy(ExternalCredential); this.externalCredentials = arrayProxy(ExternalCredential); }
}
export class UserEmail {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    isPrimary: t.Boolean;
    isVerified: t.Boolean;
    config: t.Nullable<EmailConfig_1>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.isPrimary = false; this.isVerified = false; this.config = proxy(EmailConfig_1); }
}
export class EmailConfig_1 {
    __typename: t.String;
    id: t.String;
    isEnabled: t.Boolean;
    externalCredential: t.Nullable<ExternalCredential_1>;
    constructor() { this.__typename = ""; this.id = ""; this.isEnabled = false; this.externalCredential = proxy(ExternalCredential_1); }
}
export class ExternalCredential_1 {
    __typename: t.String;
    smtp: t.Nullable<SMTPCredential>;
    oauth: t.Nullable<OAuthCredential>;
    constructor() { this.__typename = ""; this.smtp = proxy(SMTPCredential); this.oauth = proxy(OAuthCredential); }
}
export class UserEmailConfirm {
    __typename: t.String;
    id: t.String;
    isVerified: t.Boolean;
    constructor() { this.__typename = ""; this.id = ""; this.isVerified = false; }
}
export class ProfileFollow {
    __typename: t.String;
    id: t.String;
    followerId: t.String;
    followedId: t.String;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.followerId = ""; this.followedId = ""; this.createdAt = ""; }
}
export class PostStar {
    __typename: t.String;
    id: t.String;
    postId: t.String;
    profileId: t.String;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.id = ""; this.postId = ""; this.profileId = ""; this.createdAt = ""; }
}

