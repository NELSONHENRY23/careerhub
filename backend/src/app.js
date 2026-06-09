import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", jobRoutes);


export default app;



