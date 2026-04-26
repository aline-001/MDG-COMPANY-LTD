import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { customerName, pickupLocation } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        customerName,
        pickupLocation,
        userId: 1, // Temporarily hardcoded until you add auth
      },
    });

    // Send the phone notification via ntfy
    await fetch('https://ntfy.sh/mdg_shoe_laundry_admin', {
      method: 'POST',
      body: `New Order: ${customerName} at ${pickupLocation}`,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Database failed" });
  }
});

export default router;