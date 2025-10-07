let prices = [
    { Id: 1, Sport: 'Cricket', Price: 800, CreatedAt: new Date().toISOString() },
    { Id: 2, Sport: 'Football', Price: 700, CreatedAt: new Date().toISOString() },
    { Id: 3, Sport: 'Badminton', Price: 400, CreatedAt: new Date().toISOString() },
    { Id: 4, Sport: 'Pickleball', Price: 500, CreatedAt: new Date().toISOString() },
    { Id: 5, Sport: 'Gaming', Price: 300, CreatedAt: new Date().toISOString() },
    { Id: 6, Sport: 'Party', Price: 1000, CreatedAt: new Date().toISOString() }
];
let nextId = 7;
// Table: PriceMaster (Id, Sport, Price, CreatedAt, UpdatedAt)
// Optionally add: CreatedBy, UpdatedBy in DB; we still capture actor in audit logs.
export const listPrices = async (_req, res) => {
    console.log("listPrices");
    try {
        res.json(prices);
    }
    catch (error) {
        console.error('Error getting prices:', error);
        res.status(500).json({ error: 'Failed to get prices' });
    }
};
export const getPriceById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const price = prices.find(p => p.Id === id);
        if (!price)
            return res.status(404).json({ error: 'Price config not found' });
        res.json(price);
    }
    catch (error) {
        console.error('Error getting price by ID:', error);
        res.status(500).json({ error: 'Failed to get price' });
    }
};
export const getPriceBySport = async (req, res) => {
    try {
        const sport = String(req.params.sport);
        const price = prices.find(p => p.Sport.toLowerCase() === sport.toLowerCase());
        if (!price)
            return res.status(404).json({ error: 'Price config not found' });
        res.json(price);
    }
    catch (error) {
        console.error('Error getting price by sport:', error);
        res.status(500).json({ error: 'Failed to get price' });
    }
};
export const createPrice = async (req, res) => {
    try {
        const { sport, price } = req.body;
        if (!sport || typeof price !== 'number')
            return res.status(400).json({ error: 'sport and price required' });
        const newPrice = {
            Id: nextId++,
            Sport: sport,
            Price: price,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
        };
        prices.push(newPrice);
        // const actor = (req as any).user as { sub?: number | string; email?: string } | undefined;
        // await logAudit({ action: 'PRICE_CREATE', entity: 'PriceMaster', entityId: data.Id, actorId: actor?.sub ?? null, actorEmail: actor?.email ?? null, meta: { sport, price } });
        res.status(201).json(newPrice);
    }
    catch (error) {
        console.error('Error creating price:', error);
        res.status(500).json({ error: 'Failed to create price' });
    }
};
export const updatePrice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { sport, price } = req.body;
        const priceIndex = prices.findIndex(p => p.Id === id);
        if (priceIndex === -1)
            return res.status(404).json({ error: 'Price config not found' });
        const update = {};
        if (sport)
            update.Sport = sport;
        if (typeof price === 'number')
            update.Price = price;
        update.UpdatedAt = new Date().toISOString();
        const updatedPrice = { ...prices[priceIndex], ...update };
        prices[priceIndex] = updatedPrice;
        // const actor = (req as any).user as { sub?: number | string; email?: string } | undefined;
        // await logAudit({ action: 'PRICE_UPDATE', entity: 'PriceMaster', entityId: id, actorId: actor?.sub ?? null, actorEmail: actor?.email ?? null, meta: { sport, price } });
        res.json(updatedPrice);
    }
    catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Failed to update price' });
    }
};
export const deletePrice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const priceIndex = prices.findIndex(p => p.Id === id);
        if (priceIndex === -1)
            return res.status(404).json({ error: 'Price config not found' });
        const deletedPrice = prices.splice(priceIndex, 1)[0];
        // const actor = (req as any).user as { sub?: number | string; email?: string } | undefined;
        // await logAudit({ action: 'PRICE_DELETE', entity: 'PriceMaster', entityId: id, actorId: actor?.sub ?? null, actorEmail: actor?.email ?? null });
        res.json({ message: 'Price config deleted' });
    }
    catch (error) {
        console.error('Error deleting price:', error);
        res.status(500).json({ error: 'Failed to delete price' });
    }
};
