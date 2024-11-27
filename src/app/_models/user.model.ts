export interface UserLogin {
    username: string;
    password: string;
}

export interface UserToken {
    token: string;
}

export interface Charity extends User {
}

export interface User {
    id: string;
}

export interface UserDetails {
    id: string;
    username: string;
}

export interface AuthResult {
    isAuthenticated: boolean;
    errorMessage: string;
}

export interface RegisterResult {
    errorMessage: string;
}

// export interface ValidationMessage {
    
// }

// Record<string, Array<Record<string, string>>>

export interface LoginErrors {
    username: Array<Record<string, string>>;
    password: Array<Record<string, string>>;
}

export interface RegisterErrors extends LoginErrors {
    userType: Array<Record<string, string>>;
}

export interface RoleData {
    name: string;
    normalizedName: string;
}

// export interface ValidationErrorSignals {
    
// }

export interface ClaimDeposit {
    address: string;
}

export interface UserRegister {
    username: string;
    password: string;
    userType: string;
}