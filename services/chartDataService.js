
const getLastNTradingDays = (n) => {
    const dates = [];
    let currentDate = new Date();

    // Start from the last weekday to ensure consistency
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 6) { // Saturday
        currentDate.setDate(currentDate.getDate() - 1);
    } else if (dayOfWeek === 0) { // Sunday
        currentDate.setDate(currentDate.getDate() - 2);
    }

    while (dates.length < n) {
        const currentDayOfWeek = currentDate.getDay();
        if (currentDayOfWeek !== 0 && currentDayOfWeek !== 6) {
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return dates.reverse();
};


export const generateVcpChartData = () => {
    const data = [];
    let price = 100;
    const baseVolume = 20000;

    const createDay = (o, h, l, c, v) => ({
        open: parseFloat(o.toFixed(2)),
        high: parseFloat(h.toFixed(2)),
        low: parseFloat(l.toFixed(2)),
        close: parseFloat(c.toFixed(2)),
        volume: Math.round(v),
    });

    // Phase 1: Initial Uptrend (10 days)
    for (let i = 0; i < 10; i++) {
        const move = price * (Math.random() * 0.03 + 0.005); // Upward bias
        const open = price;
        const close = open + move;
        const high = close * (1 + Math.random() * 0.015);
        const low = open * (1 - Math.random() * 0.01);
        const volume = baseVolume * (0.8 + Math.random() * 0.4);
        data.push(createDay(open, high, low, close, volume));
        price = close;
    }

    const peakPrice = price;

    // Phase 2: First Contraction (~15 days)
    const pullbackTarget1 = peakPrice * 0.88; // ~12% pullback
    for (let i = 0; i < 15; i++) {
        const progress = i / 14;
        const volatility = 0.04 * (1 - progress); // Volatility decreases
        let move = price * volatility * (Math.random() - 0.55); // Downward bias
        
        // Guide price towards target
        if (price > pullbackTarget1) {
            move -= price * 0.005;
        } else {
             move += price * 0.005; // start recovering
        }

        const open = price;
        let close = open + move;
        const high = Math.max(open, close) + (price * volatility * Math.random());
        const low = Math.min(open, close) - (price * volatility * Math.random());
        close = Math.max(low, Math.min(high, close));
        
        const volume = baseVolume * 1.5 * (1 - progress) * (0.8 + Math.random() * 0.4); // Volume dries up
        data.push(createDay(open, high, low, close, volume));
        price = close;
    }

    // Phase 3: Second, shallower contraction (~15 days)
    const pullbackTarget2 = peakPrice * 0.94; // ~6% pullback from peak
     for (let i = 0; i < 15; i++) {
        const progress = i / 14;
        const volatility = 0.02 * (1 - progress); // Even less volatility
        let move = price * volatility * (Math.random() - 0.52); // Slight downward/sideways bias
        
        // Guide price towards target
        if (price > pullbackTarget2) {
            move -= price * 0.002;
        } else {
             move += price * 0.003; // Start recovering
        }

        const open = price;
        let close = open + move;
        const high = Math.max(open, close) + (price * volatility * Math.random());
        const low = Math.min(open, close) - (price * volatility * Math.random());
        close = Math.max(low, Math.min(high, close));

        const volume = baseVolume * 0.6 * (1 - progress) * (0.7 + Math.random() * 0.6); // Very low volume
        data.push(createDay(open, high, low, close, volume));
        price = close;
    }

    // Phase 4: Final tightening (~9 days)
    for (let i = 0; i < 9; i++) {
        const volatility = 0.01; // Super tight range
        const move = price * volatility * (Math.random() - 0.5);
        const open = price;
        const close = open + move;
        const high = Math.max(open, close) + (price * volatility * Math.random() * 0.5);
        const low = Math.min(open, close) - (price * volatility * Math.random() * 0.5);
        const volume = baseVolume * 0.2 * (0.6 + Math.random() * 0.4); // Extremely low volume
        data.push(createDay(open, high, low, close, volume));
        price = close;
    }

    // Day 50: The Breakout
    const open = price;
    const close = price * 1.08; // 8% jump
    const high = close * 1.01;
    const low = open;
    const volume = baseVolume * 4; // Massive volume spike
    data.push(createDay(open, high, low, close, volume));

    const tradingDates = getLastNTradingDays(data.length);

    return data.map((d, i) => ({ 
        ...d, 
        name: tradingDates[i].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
};
