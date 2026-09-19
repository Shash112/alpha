import { QueryResult, QueryResultRow } from 'pg';
export declare function getDbPool(): any;
export declare function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
export declare function transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
//# sourceMappingURL=client.d.ts.map