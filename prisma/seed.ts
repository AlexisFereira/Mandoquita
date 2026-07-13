import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "audio" },
      update: { name: "Audio", active: true, visible: true },
      create: { slug: "audio", name: "Audio", active: true, visible: true },
    }),
    prisma.category.upsert({
      where: { slug: "computing" },
      update: { name: "Computing", active: true, visible: true },
      create: { slug: "computing", name: "Computing", active: true, visible: true },
    }),
    prisma.category.upsert({
      where: { slug: "home-living" },
      update: { name: "Home Living", active: true, visible: true },
      create: { slug: "home-living", name: "Home Living", active: true, visible: true },
    }),
  ]);

  await Promise.all([
    prisma.product.upsert({
      where: { slug: "wireless-headset-pro" },
      update: { featured: true, featuredOrder: 1 },
      create: {
        slug: "wireless-headset-pro",
        name: "Wireless Headset Pro",
        description: "Over-ear headset with active noise cancellation.",
        price: 129.99,
        currency: "USD",
        imageUrl: "https://images.example.com/wireless-headset-pro.jpg",
        active: true,
        featured: true,
        featuredOrder: 1,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "mechanical-keyboard-tkl" },
      update: { featured: true, featuredOrder: 2 },
      create: {
        slug: "mechanical-keyboard-tkl",
        name: "Mechanical Keyboard TKL",
        description: "Compact keyboard with tactile switches and RGB backlight.",
        price: 94.5,
        currency: "USD",
        imageUrl: "https://images.example.com/mechanical-keyboard-tkl.jpg",
        active: true,
        featured: true,
        featuredOrder: 2,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "usb-c-dock-8in1" },
      update: { featured: true, featuredOrder: 3 },
      create: {
        slug: "usb-c-dock-8in1",
        name: "USB-C Dock 8-in-1",
        description: "Docking station with HDMI, USB-A, Ethernet, and card reader.",
        price: 79.0,
        currency: "USD",
        imageUrl: "https://images.example.com/usb-c-dock-8in1.jpg",
        active: true,
        featured: true,
        featuredOrder: 3,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "studio-speaker-duo" },
      update: { featured: true, featuredOrder: 4 },
      create: {
        slug: "studio-speaker-duo",
        name: "Studio Speaker Duo",
        description: "Compact stereo speakers with rich sound and natural tuning.",
        price: 149.0,
        currency: "USD",
        imageUrl: "https://images.example.com/studio-speaker-duo.jpg",
        active: true,
        featured: true,
        featuredOrder: 4,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "noise-cancel-earbuds" },
      update: { featured: true, featuredOrder: 5 },
      create: {
        slug: "noise-cancel-earbuds",
        name: "Noise Cancel Earbuds",
        description: "Pocket-sized wireless earbuds with active noise cancellation.",
        price: 99.0,
        currency: "USD",
        imageUrl: "https://images.example.com/noise-cancel-earbuds.jpg",
        active: true,
        featured: true,
        featuredOrder: 5,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "ultrabook-14" },
      update: { featured: true, featuredOrder: 6 },
      create: {
        slug: "ultrabook-14",
        name: "Ultrabook 14",
        description: "Lightweight laptop designed for work, travel, and productivity.",
        price: 1099.0,
        currency: "USD",
        imageUrl: "https://images.example.com/ultrabook-14.jpg",
        active: true,
        featured: true,
        featuredOrder: 6,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "4k-monitor-27" },
      update: { featured: true, featuredOrder: 7 },
      create: {
        slug: "4k-monitor-27",
        name: "4K Monitor 27",
        description: "High-clarity display with excellent color reproduction for creators.",
        price: 329.0,
        currency: "USD",
        imageUrl: "https://images.example.com/4k-monitor-27.jpg",
        active: true,
        featured: true,
        featuredOrder: 7,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "ceramic-table-lamp" },
      update: { featured: true, featuredOrder: 8 },
      create: {
        slug: "ceramic-table-lamp",
        name: "Ceramic Table Lamp",
        description: "Warm ambient lighting for desks, bedrooms, and living areas.",
        price: 59.0,
        currency: "USD",
        imageUrl: "https://images.example.com/ceramic-table-lamp.jpg",
        active: true,
        featured: true,
        featuredOrder: 8,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "linen-storage-basket" },
      update: { featured: false, featuredOrder: null },
      create: {
        slug: "linen-storage-basket",
        name: "Linen Storage Basket",
        description: "Soft storage basket for organizing living spaces elegantly.",
        price: 39.0,
        currency: "USD",
        imageUrl: "https://images.example.com/linen-storage-basket.jpg",
        active: true,
        featured: false,
        featuredOrder: null,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "walnut-side-table" },
      update: { featured: false, featuredOrder: null },
      create: {
        slug: "walnut-side-table",
        name: "Walnut Side Table",
        description: "Minimal side table with a premium walnut finish.",
        price: 189.0,
        currency: "USD",
        imageUrl: "https://images.example.com/walnut-side-table.jpg",
        active: true,
        featured: false,
        featuredOrder: null,
        categoryId: categories[2].id,
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
