const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ...existing code...

app.listen(process.env.PORT || 3000, () => {
    console.log(`API server running on port ${process.env.PORT || 3000}`);
});