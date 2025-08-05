import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getLocationById(id) {
    return await prisma.locations.findUnique({
        where: {
            id: parseInt(id),
        },
    });
}

async function getStates() {
    return await prisma.locations.findMany({
        select: {
            state: true,
        },
        distinct: ['state'],
    });
}

async function getCityByState(state) {
    return await prisma.locations.findMany({
        where: {
            state: {
                equals: state,
                mode: 'insensitive'
            }
        },
        select: {
            city: true,
        },
        distinct: ['city'],
    });
}

async function getIdByStateAndCity(city, state) {
    return await prisma.locations.findFirst({
        where: {
            city: {
                equals: city,
                mode: 'insensitive'
            },
            state: {
                equals: state,
                mode: 'insensitive'
            }
        },
    });
}

export default {
    getLocationById,
    getCityByState,
    getStates,
    getIdByStateAndCity,
};
