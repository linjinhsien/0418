export type SuggestionError = 'api_error' | 'offline' | 'no_history';

export interface MigrationError {
  type: 'migration_error';
  version: number;
  cause: string;
}
