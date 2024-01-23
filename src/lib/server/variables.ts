import { DATABASE_DATABASE, DATABASE_IP, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER, JWT_SECRET } from '$env/static/private'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { JWTCookies } from './cookies/main'
export const jwt = new JWTCookies(JWT_SECRET)

const dialect = new MysqlDialect({
    pool: createPool({
        host: DATABASE_IP,
        port: parseInt(DATABASE_PORT),
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DATABASE
    })
})

export const conn = new Kysely<Database>({
    dialect
})
