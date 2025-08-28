
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

// Dummy data for best ordered food today
const bestOrderedFoods = [
  {
    id: 1,
    name: 'Chicken Momos',
    image: '/images/foods/chicken-momos.jpg',
    price: 120,
    shop: 'Momos Point',
    rating: 4.8,
    orders: 156,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    image: '/images/foods/pizza.jpg',
    price: 180,
    shop: 'Pizza Corner',
    rating: 4.6,
    orders: 142,
  },
  {
    id: 3,
    name: 'Crispy Burger',
    image: '/images/foods/burger.jpg',
    price: 150,
    shop: 'Burger Hub',
    rating: 4.5,
    orders: 128,
  },
  {
    id: 4,
    name: 'Cold Coffee',
    image: '/images/foods/cold-coffee.jpg',
    price: 80,
    shop: 'Campus Cafe',
    rating: 4.7,
    orders: 115,
  },
];

// Dummy data for best food stores of the week
const bestFoodStores = [
  {
    id: 1,
    name: 'Momos Point',
    image: '/images/shops/momos-point.jpg',
    rating: 4.8,
    location: 'Block A, Campus Center',
    cuisine: 'Chinese, Tibetan',
  },
  {
    id: 2,
    name: 'Pizza Corner',
    image: '/images/shops/pizza-corner.jpg',
    rating: 4.6,
    location: 'Food Court, Block C',
    cuisine: 'Italian, Fast Food',
  },
  {
    id: 3,
    name: 'Burger Hub',
    image: '/images/shops/burger-hub.jpg',
    rating: 4.5,
    location: 'Student Center',
    cuisine: 'American, Fast Food',
  },
];

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-2xl overflow-hidden h-[300px] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-800/90 z-10" />
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-60" />
          <div className="relative z-20 h-full flex flex-col justify-center px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Campus Food Delivery
            </h1>
            <p className="text-xl text-white/90 mb-6 max-w-lg">
              Order from your favorite campus food outlets and get it delivered to your hostel or classroom.
            </p>
            <div>
              <Button asChild size="lg" className="bg-white text-green-800 hover:bg-white/90">
                <Link href="/search">Order Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Ordered Food Today Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Ordered Food Today</h2>
          <Button variant="outline" asChild>
            <Link href="/search">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestOrderedFoods.map((food) => (
            <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                {/* Placeholder for actual images */}
                {/* <Image 
                  src={food.image} 
                  alt={food.name} 
                  fill 
                  className="object-cover" 
                /> */}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{food.name}</h3>
                  <span className="font-bold text-green-600">₹{food.price}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{food.shop}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm">{food.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">{food.orders} orders today</span>
                </div>
                <Button className="w-full mt-3">Add to Cart</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Best Food Store of the Week Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Food Store of the Week</h2>
          <Button variant="outline" asChild>
            <Link href="/shops">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestFoodStores.map((store) => (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                {/* Placeholder for actual images */}
                {/* <Image 
                  src={store.image} 
                  alt={store.name} 
                  fill 
                  className="object-cover" 
                /> */}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{store.cuisine}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-sm mr-2">{store.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="inline-block mr-1">📍</span>
                  {store.location}
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/shop/${store.id}`}>View Menu</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promotional Section */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">50% Off on First Order!</h2>
              <p className="text-white/90 mb-4">Use code CAMPUS50 at checkout</p>
              <Button className="bg-white text-orange-600 hover:bg-white/90">Order Now</Button>
            </div>
            <div className="w-full md:w-1/3 relative h-48">
              <div className="absolute inset-0 bg-white/20 rounded-lg flex items-center justify-center">
                <span>Promo Image</span>
              </div>
              {/* <Image 
                src="/images/promo.jpg" 
                alt="Promotional offer" 
                fill 
                className="object-cover rounded-lg" 
              /> */}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
