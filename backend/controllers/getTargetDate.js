import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'targetDate.json');

// Function to set or get the constant target date
export const getTargetDate = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const { targetDate } = JSON.parse(data);
        return new Date(targetDate);
    } else {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 24); // Set target to 24 days from now

        fs.writeFileSync(filePath, JSON.stringify({ targetDate }));
        return targetDate;
    }
};


