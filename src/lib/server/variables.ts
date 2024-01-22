import { JWT_SECRET } from '$env/static/private'
import { JWTCookies } from './cookies/main'
export const jwt = new JWTCookies(JWT_SECRET)
import { DATABASE_DATABASE, DATABASE_IP, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER, JWT_SECRET } from '$env/static/private'
import type { DB } from '$types/database'
import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'

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
