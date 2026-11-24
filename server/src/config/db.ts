import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/client";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
	try {
		await prisma.$connect();
		console.log("PostgreSQL Connected Successfully!");
	} catch (error) {
		console.error("Database Connection Error:", error);
		process.exit(1);
	}
};

export { prisma };
export default connectDB;
