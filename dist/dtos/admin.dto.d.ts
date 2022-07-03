export declare class IdDto {
    id: string;
}
export declare class AdminLoginDto {
    email: string;
    password: string;
}
export declare class ToggleUserStatusDto extends IdDto {
    status: boolean;
}
export declare class PrivacyPolicyDto {
    content: string;
}
