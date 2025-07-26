import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function findAll(){
    const returnUser = await prisma.user.findMany();
    return returnUser
}

async function findUser(email, phone){
    const returnUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { phone: phone }
            ]
        }
    });
    return returnUser;
}


async function findById(id){
    const returnUser = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return returnUser
}

async function createUser(userData){
    const user = await prisma.user.create({
        data: userData
    });
    return user;
}


export default {findAll, findUser, createUser, findById}