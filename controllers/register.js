const bcrypt = require('bcrypt'); // Do hashowania haseł
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Endpoint rejestracji
exports.register=async (req, res) => {
    const { nickname, email, password } = req.body;

    if (!nickname || !email || !password) return res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
    if (nickname=="" || email=="" || password=="") return res.status(400).json({message:"Pola nie mogą być puste"});    
    try {
        // Sprawdzenie, czy email lub nickname już istnieje
        const existingUser = await prisma.user_safechat.findFirst({
            where: {
                OR: [
                    { email: email },
                    { nickname: nickname }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik z takim emailem lub nickiem już istnieje.' });
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tworzenie nowego użytkownika
        const newUser = await prisma.user_safechat.create({
            data: {
                nickname: nickname,
                email: email,
                pass: hashedPassword,
            }
        });

        return res.status(200).json({ message: 'Konto zostało utworzone!'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji.' });
    }
};
