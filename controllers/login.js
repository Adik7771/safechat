const bcrypt = require('bcrypt'); // Do hashowania haseł
const jwt=require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.login=async(req,res)=>{
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({message:"Wszystkie pola są wymagane"});
    if(email=="" || password=="") return res.status(400).json({message:"Pola nie mogą być puste"});    
    try{
         const existingUser = await prisma.user_safechat.findFirst({
            where: { email: email }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Użytkownik z takim emailem nie istnieje' });
        }

        const pascheck=await bcrypt.compare(password,existingUser.pass);
        if(!pascheck) return res.status(400).json({message:"Podane hasło jest nieprawidłowe"});
        const token=jwt.sign({user_id:existingUser.user_id},process.env.SECRET_KEY,{expiresIn:"12h"});
        return res.status(200).json({ message: 'Zalogowano pomyślnie',token:token });
    }
    catch(er){
        return res.status(500).json({message:`Wewnętrzny błąd serwera:${er}`});
    }
}