import { Pool } from 'pg';

import bcrypt from 'bcrypt'; 

import * as env from 'dotenv';

env.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port:  parseInt(process.env.DB_PORT || '5432', 10), //temporary solution 
    password: process.env.DB_PASSWORD,
});

class SignUpDto {
    public constructor(
        readonly username: string,
        readonly password: string,
        readonly repeatPassword: string,
        readonly email: string
    ) {}
}

const registerUser = async (signUpDto: SignUpDto) => {
    
    if (signUpDto.password !== signUpDto.repeatPassword) {
        console.log("PASSWORDS ARENT MATCHING");
        return 0 
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN;');
        let encryptedPassword
        bcrypt.hash(signUpDto.password,12,(err: Error | undefined, encrypted: string)=>{
            if(err){
                console.log(err)
                return 0
            }
            encryptedPassword = encrypted
        })

        const userUniqnessQuery = `
        SELECT 1 FROM users 
        WHERE email = $1 OR username = $2
        LIMIT 1;`

        const isUserUnique = await client.query(userUniqnessQuery, [signUpDto.email, signUpDto.username])

        if (isUserUnique.rows.length === 0) {
            const insertUserQuery = `
            INSERT INTO users(username, password, email)
            VALUES($1, $2, $3);`
            await client.query(insertUserQuery, [signUpDto.username, encryptedPassword, signUpDto.email])
            console.log("Użytkownik zarejestrowany pomyślnie.")
        } else {
            console.log("USER ALREADY EXISTS")
        }

        await client.query("COMMIT")
    } catch (err) {
        console.log("REGISTRATION ERROR:", err)
        await client.query("ROLLBACK")
    } finally {
        client.release();
    }
};