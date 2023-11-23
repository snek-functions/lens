
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

export enum OAuthProvider {
    google = "google",
    azure = "azure"
}
export enum Privacy {
    public = "public",
    private = "private",
    friends = "friends"
}
export enum PrivacyInputInput {
    public = "public",
    private = "private",
    friends = "friends"
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
export enum PrivacyInput {
    public = "public",
    private = "private",
    friends = "friends"
}

export type FiltersInputInput = {
    profileId?: t.String;
    privacy?: PrivacyInputInput;
    limit: t.NotSupportedYet;
    offset: t.NotSupportedYet;
};
export type FiltersInput_1Input = {
    limit: t.NotSupportedYet;
    offset: t.NotSupportedYet;
};
export type ValuesInputInput = {
    emailAddress: t.String;
    username: t.String;
    password: t.String;
    accountId?: t.String;
    isActive?: t.Boolean;
    isAdmin?: t.Boolean;
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
    port: t.NotSupportedYet;
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
export type ProfileInput = {
    id: t.String;
    userId: t.String;
    bio?: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    posts: PostInput[];
    starredPosts: StarredPostsInput[];
    followers: ProfileInput[];
    following: ProfileInput[];
    activity: ActivityInput[];
    views: t.NotSupportedYet;
};
export type PostInput = {
    id: t.String;
    title: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    profileId: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    privacy?: PrivacyInput;
    profile?: ProfileInput;
    stars: StarsInput[];
    views: t.NotSupportedYet;
};
export type StarsInput = {
    profile: ProfileInput;
    createdAt: t.String;
};
export type StarredPostsInput = {
    post: PostInput;
    createdAt: t.String;
};
export type ActivityInput = {
    createdAt: t.String;
    type: t.String;
    post?: PostInput;
    follow?: FollowInput;
};
export type FollowInput = {
    createdAt: t.String;
    followed: ProfileInput;
};
export type PostDataInputInput = {
    title: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInputInput;
};
export type PostUpdateDataInputInput = {
    title?: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInputInput;
};

export class Query {
    __typename: t.String;
    user: (args: {
        id: t.String;
    }) => User;
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
    socialProfile: (args?: {
        profileId?: t.String;
    }) => Profile;
    allSocialProfile: Profile[];
    socialPost: (args: {
        postId: t.String;
    }) => t.Nullable<Post>;
    allSocialPost: (args?: {
        filters?: FiltersInputInput;
    }) => Post[];
    allSocialPostTrending: (args?: {
        filters?: FiltersInput_1Input;
    }) => Post[];
    version: t.String;
    constructor() { this.__typename = ""; this.user = fnProxy(User); this.allUser = fnArrayProxy(User); this.userMe = proxy(User); this.resource = fnProxy(Resource); this.shopifyAllProductId = () => []; this.socialProfile = fnProxy(Profile); this.allSocialProfile = arrayProxy(Profile); this.socialPost = fnProxy(Post); this.allSocialPost = fnArrayProxy(Post); this.allSocialPostTrending = fnArrayProxy(Post); this.version = ""; }
}
export class User {
    __typename: t.String;
    id: t.String;
    username: t.String;
    primaryEmailAddress: t.String;
    isAdmin: t.Boolean;
    isActive: t.Boolean;
    createdAt: t.String;
    details: Details;
    resource: Resource;
    emails: UserEmail[];
    constructor() { this.__typename = ""; this.id = ""; this.username = ""; this.primaryEmailAddress = ""; this.isAdmin = false; this.isActive = false; this.createdAt = ""; this.details = proxy(Details); this.resource = proxy(Resource); this.emails = arrayProxy(UserEmail); }
}
export class Details {
    __typename: t.String;
    firstName: t.Nullable<t.String>;
    lastName: t.Nullable<t.String>;
    avatarURL: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.firstName = null; this.lastName = null; this.avatarURL = null; }
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
export class UserEmail {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    isPrimary: t.Boolean;
    isVerified: t.Boolean;
    config: t.Nullable<EmailConfig>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.isPrimary = false; this.isVerified = false; this.config = proxy(EmailConfig); }
}
export class EmailConfig {
    __typename: t.String;
    id: t.String;
    isEnabled: t.Boolean;
    externalCredential: t.Nullable<ExternalCredential>;
    constructor() { this.__typename = ""; this.id = ""; this.isEnabled = false; this.externalCredential = proxy(ExternalCredential); }
}
export class ExternalCredential {
    __typename: t.String;
    smtp: t.Nullable<SMTPCredential>;
    oauth: t.Nullable<OAuthCredential>;
    constructor() { this.__typename = ""; this.smtp = proxy(SMTPCredential); this.oauth = proxy(OAuthCredential); }
}
export class SMTPCredential {
    __typename: t.String;
    host: t.String;
    port: t.NotSupportedYet;
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
export class Profile {
    __typename: t.String;
    id: t.String;
    userId: t.String;
    bio: t.Nullable<t.String>;
    createdAt: t.String;
    updatedAt: t.String;
    posts: Post[];
    starredPosts: StarredPosts[];
    followers: Profile[];
    following: Profile[];
    activity: Activity[];
    views: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.id = ""; this.userId = ""; this.bio = null; this.createdAt = ""; this.updatedAt = ""; this.posts = arrayProxy(Post); this.starredPosts = arrayProxy(StarredPosts); this.followers = arrayProxy(Profile); this.following = arrayProxy(Profile); this.activity = arrayProxy(Activity); this.views = null; }
}
export class Post {
    __typename: t.String;
    id: t.String;
    title: t.String;
    avatarURL: t.Nullable<t.String>;
    summary: t.Nullable<t.String>;
    content: t.Nullable<t.String>;
    profileId: t.String;
    createdAt: t.String;
    updatedAt: t.String;
    privacy: t.Nullable<Privacy>;
    profile: t.Nullable<Profile>;
    stars: Stars[];
    views: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.id = ""; this.title = ""; this.avatarURL = null; this.summary = null; this.content = null; this.profileId = ""; this.createdAt = ""; this.updatedAt = ""; this.privacy = null; this.profile = proxy(Profile); this.stars = arrayProxy(Stars); this.views = null; }
}
export class Stars {
    __typename: t.String;
    profile: Profile;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.profile = proxy(Profile); this.createdAt = ""; }
}
export class StarredPosts {
    __typename: t.String;
    post: Post;
    createdAt: t.String;
    constructor() { this.__typename = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Activity {
    __typename: t.String;
    createdAt: t.String;
    type: t.String;
    post: t.Nullable<Post>;
    follow: t.Nullable<Follow>;
    constructor() { this.__typename = ""; this.createdAt = ""; this.type = ""; this.post = proxy(Post); this.follow = proxy(Follow); }
}
export class Follow {
    __typename: t.String;
    createdAt: t.String;
    followed: Profile;
    constructor() { this.__typename = ""; this.createdAt = ""; this.followed = proxy(Profile); }
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
    userSSO: (args: {
        resourceId: t.String;
    }) => UserSSO;
    userRegister: (args: {
        resourceId: t.String;
        values: ValuesInputInput;
        skipEmailVerification?: t.Boolean;
    }) => UserRegister;
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
    socialProfileCreate: Profile;
    socialProfileUpdate: (args: {
        data: ProfileInput;
    }) => Profile;
    socialProfileDelete: t.Boolean;
    socialProfileFollow: (args: {
        followProfileId: t.String;
    }) => ProfileFollow;
    socialProfileUnfollow: (args: {
        followProfileId: t.String;
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
    }) => t.NotSupportedYet;
    socialPostStar: (args: {
        postId: t.String;
    }) => PostStar;
    socialPostUnstar: (args: {
        postId: t.String;
    }) => PostStar;
    constructor() { this.__typename = ""; this.passwordReset = () => false; this.passwordResetConfirm = () => false; this.userSignIn = fnProxy(UserSignIn); this.userSignOut = () => null; this.userRefresh = fnProxy(UserRefresh); this.userSSO = fnProxy(UserSSO); this.userRegister = fnProxy(UserRegister); this.userUpdate = fnProxy(User); this.userDelete = () => false; this.userEmailCreate = fnProxy(UserEmail); this.userEmailConfirm = fnProxy(UserEmailConfirm); this.userEmailConfirmationResend = fnProxy(Email); this.userEmailUpdate = fnProxy(UserEmail); this.userEmailDelete = () => false; this.userExternalCredentialCreate = () => ""; this.jaenPublish = () => ""; this.shopifyProductCreate = () => ""; this.shopifyProductUpdate = () => ""; this.shopifyProductDelete = () => ""; this.mailpressMailSchedule = () => ""; this.socialProfileCreate = proxy(Profile); this.socialProfileUpdate = fnProxy(Profile); this.socialProfileDelete = false; this.socialProfileFollow = fnProxy(ProfileFollow); this.socialProfileUnfollow = fnProxy(ProfileFollow); this.socialPostCreate = fnProxy(Post); this.socialPostUpdate = fnProxy(Post); this.socialPostDelete = () => null; this.socialPostStar = fnProxy(PostStar); this.socialPostUnstar = fnProxy(PostStar); }
}
export class UserSignIn {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = proxy(User); }
}
export class TokenPair {
    __typename: t.String;
    accessToken: t.String;
    refreshToken: t.String;
    constructor() { this.__typename = ""; this.accessToken = ""; this.refreshToken = ""; }
}
export class UserRefresh {
    __typename: t.String;
    tokenPair: TokenPair;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.me = proxy(User); }
}
export class UserSSO {
    __typename: t.String;
    tokenPair: TokenPair;
    user: User;
    me: User;
    constructor() { this.__typename = ""; this.tokenPair = proxy(TokenPair); this.user = proxy(User); this.me = proxy(User); }
}
export class UserRegister {
    __typename: t.String;
    user: User;
    accessToken: t.String;
    constructor() { this.__typename = ""; this.user = proxy(User); this.accessToken = ""; }
}
export class UserEmailConfirm {
    __typename: t.String;
    id: t.String;
    isVerified: t.Boolean;
    constructor() { this.__typename = ""; this.id = ""; this.isVerified = false; }
}
export class Email {
    __typename: t.String;
    id: t.String;
    emailAddress: t.String;
    resourceId: t.String;
    isPrimary: t.Boolean;
    isVerified: t.Boolean;
    userId: t.Nullable<t.String>;
    config: t.Nullable<EmailConfig_1>;
    constructor() { this.__typename = ""; this.id = ""; this.emailAddress = ""; this.resourceId = ""; this.isPrimary = false; this.isVerified = false; this.userId = null; this.config = proxy(EmailConfig_1); }
}
export class EmailConfig_1 {
    __typename: t.String;
    id: t.String;
    isEnabled: t.Boolean;
    externalCredential: ExternalCredential_1;
    constructor() { this.__typename = ""; this.id = ""; this.isEnabled = false; this.externalCredential = proxy(ExternalCredential_1); }
}
export class ExternalCredential_1 {
    __typename: t.String;
    id: t.String;
    smtp: t.Nullable<SMTPCredential>;
    oauth: t.Nullable<OAuthCredential>;
    constructor() { this.__typename = ""; this.id = ""; this.smtp = proxy(SMTPCredential); this.oauth = proxy(OAuthCredential); }
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

