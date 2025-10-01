import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const server = process.env.DB_SERVER;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT;

if (!user || !password || !server || !database || !port) {
    throw new Error("Faltan variables de entorno para la conexión a SQL Server");
}

const config: sql.config = {
    user,
    password,
    server,
    database,
    port: Number(port),
    options: {
        trustServerCertificate: true // importante para certificados auto-firmados
    }
};

export const getPool = async (): Promise<sql.ConnectionPool> => {
    const pool = await sql.connect(config);
    return pool;
};