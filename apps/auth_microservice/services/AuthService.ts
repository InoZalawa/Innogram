import { Pool } from 'pg';
// Import 'bcrypt' lub podobnej biblioteki do hashowania
// import bcrypt from 'bcrypt'; 

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'users',
    port: 5432,
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
        console.error("Hasła się nie zgadzają.");
        return 0 
    }

    const client = await pool.connect()

    try {
        await client.query('BEGIN');

        const encryptedPassword = signUpDto.password // TODO bcrypt

        const userUniqnessQuery = `
        SELECT 1 FROM users 
        WHERE email = $1 AND username = $2
        LIMIT 1`

        const isUserUnique = await client.query(userUniqnessQuery, [signUpDto.email, signUpDto.username])

        if (isUserUnique.rows.length === 0) {
            const insertUserQuery = `
            INSERT INTO users(username, password, email)
            VALUES($1, $2, $3)`
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