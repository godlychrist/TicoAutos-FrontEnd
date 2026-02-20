// import api from './api.js';

const vehicleService = {
    async getAll() {
        // Mock de datos para que la vista se vea "bonita" desde ya
        return [
            {
                id: 1,
                name: 'Tesla Model S Plaid',
                brand: 'Tesla',
                price: '129.990',
                image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
                category: 'Premium',
                stats: { speed: '322km/h', range: '637km', power: '1020hp' }
            },
            {
                id: 2,
                name: 'Porsche Taycan Turbo S',
                brand: 'Porsche',
                price: '185.000',
                image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
                category: 'Sport',
                stats: { speed: '260km/h', range: '412km', power: '750hp' }
            },
            {
                id: 3,
                name: 'Audi RS Q8',
                brand: 'Audi',
                price: '115.400',
                image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
                category: 'SUV Luxury',
                stats: { speed: '250km/h', range: '480km', power: '591hp' }
            },
            {
                id: 4,
                name: 'BMW M8 Competition',
                brand: 'BMW',
                price: '130.000',
                image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
                category: 'Performance',
                stats: { speed: '305km/h', range: '560km', power: '617hp' }
            },
            {
                id: 5,
                name: 'Ferrari F8 Tributo',
                brand: 'Ferrari',
                price: '276.550',
                image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
                category: 'Supercar',
                stats: { speed: '340km/h', range: '450km', power: '710hp' }
            },
            {
                id: 6,
                name: 'Lamborghini Urus',
                brand: 'Lamborghini',
                price: '220.000',
                image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800',
                category: 'Hyper SUV',
                stats: { speed: '305km/h', range: '600km', power: '641hp' }
            },
            {
                id: 7,
                name: 'Mercedes-Benz G63 AMG',
                brand: 'Mercedes',
                price: '179.000',
                image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800',
                category: 'SUV Icon',
                stats: { speed: '220km/h', range: '500km', power: '577hp' }
            },
            {
                id: 8,
                name: 'Range Rover SV',
                brand: 'Land Rover',
                price: '210.000',
                image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800',
                category: 'SUV Ultra',
                stats: { speed: '240km/h', range: '550km', power: '523hp' }
            }
        ];
    }
};

export default vehicleService;
