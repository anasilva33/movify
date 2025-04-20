import { faker } from '@faker-js/faker';

const generateFakeMovie = (id: number) => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    year: faker.number.int({ min: 1950, max: 2024 }),
    rank: id + 1,
    revenue: Number(faker.number.float({ min: 1, max: 1000, fractionDigits: 2 })),
    genre: faker.helpers.arrayElement(['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance']),
    description: faker.lorem.paragraph(),
    director: faker.person.fullName(),
    actors: [
        faker.person.fullName(),
        faker.person.fullName(),
        faker.person.fullName(),
    ].join(', '),
    runtime: faker.number.int({ min: 80, max: 180 }),
    rating: Number(faker.number.float({ min: 1, max: 10, fractionDigits: 1 })),
    votes: faker.number.int({ min: 1000, max: 1000000 }),
    metascore: faker.number.int({ min: 10, max: 100 }),
});

const total = 500;
const data = Array.from({ length: total }, (_, i) =>
    generateFakeMovie(i)
);

export const mockApi = {
    getById: async (id: string) => {
        const movie = data.find(m => m.id === id);
        return new Promise((resolve) =>
            setTimeout(() => resolve({ data: movie }), 300)
        );
    },

    getPagedList: async (page: number, size: number) => {
        const start = (page - 1) * size;
        const end = start + size;
        const pagedData = data.slice(start, end);

        return new Promise((resolve) =>
            setTimeout(
                () =>
                    resolve({
                        data: {
                            content: pagedData,
                            totalElements: total,
                            page,
                            size,
                        },
                    }),
                300
            )
        );
    },
};
