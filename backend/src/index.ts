import express from "express";
import UserRoutes from "../resources/user/user.routes.js";
import TaskRoutes from "../resources/task/task.routes.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(UserRoutes);
app.use(TaskRoutes);



import { connect } from 'mongoose';
connect(`mongodb+srv://${process.env.MONGODB_AUTHENTICATION}@trullocluster.sf9ye.mongodb.net/NP`)

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


