export interface User {
  sub: string;
  email?: string;
  name?: string;
  roles: string[];
  account_ids?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
}
