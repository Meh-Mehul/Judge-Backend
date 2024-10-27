import express, { Request, Response } from "express";
const app = express();
require('dotenv').config();
// security?
import helmet from 'helmet';
import rateLimiter from 'express-rate-limit';
//db
const connectDB = require('./database/connect');
// for CORS
const cors = require('cors');
app.use(cors())
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 5 * 60 * 1000, // 100 request per 5 minutes from one IP.
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.urlencoded({extended:false}));
app.use(helmet());
app.use(express.json());



app.get('/', (req: Request, res: Response) => {
    res.json({"Message":"This is the Backend API For an Online Code Execution System"});
});


// routes
const SubmissionRoutes = require('./routes/submit');
const QuestionRoutes = require('./routes/question');
app.use('/', SubmissionRoutes);
app.use('/polygon', QuestionRoutes);
// Running the app
const port = process.env.PORT || 5000;
const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };

start();