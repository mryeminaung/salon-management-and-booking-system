import { Role } from "@prisma/constants";
import "dotenv/config";
import { prisma } from "@/config/db";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "password123";

const ownerData = {
	email: "admin@salon.com",
	password: "admin123",
	name: "Salon Admin",
	phone: "09123456789",
	role: "owner",

};

const managersData = [
	{ name: "Ye", email: "ye@salon.com", phone: "09966233407" },
	{ name: "Khin", email: "khin@salon.com", phone: "09797237421" },
];

const staffData = [
	// Glow Beauty Salon
	{ name: "Mya", email: "mya@salon.com", specialty: "Hair Stylist", salon: "Glow Beauty Salon",phone: "09123456789" },
	{ name: "Nwe", email: "nwe@salon.com", specialty: "Colorist", salon: "Glow Beauty Salon",phone: "09123456789" },
	// Style Studio
	{ name: "Zaw", email: "zaw@salon.com", specialty: "Barber", salon: "Style Studio",phone: "09123456789" },
	{ name: "Htun", email: "htun@salon.com", specialty: "Nail Technician", salon: "Style Studio",phone: "09123456789" },
];

const customersData = [
	{ name: "Aye", email: "aye@salon.com", phone: "09123456789" },
	{ name: "Kyaw", email: "kyaw@salon.com", phone: "09123456789" },
];

const salonsData = [
	{
		name: "Glow Beauty Salon",
		slug: "glow-beauty-salon",
		address: "78 35th Street, Mandalay",
		phone: "09 780 123 456",
		description: "A beautiful beauty salon offering top-notch services",
		managerEmail: "ye@salon.com",
	},
	{
		name: "Style Studio",
		slug: "style-studio",
		address: "62 78th Street, Mandalay",
		phone: "09 250 987 654",
		description: "Your one-stop shop for all styling needs",
		managerEmail: "khin@salon.com",
	},
];

const servicesData = [
	// Glow Beauty Salon
	{ name: "Haircut", slug: "haircut", description: "Professional haircut and styling", duration: 45, price: 12000, salon: "Glow Beauty Salon" },
	{ name: "Hair Coloring", slug: "hair-coloring", description: "Full hair coloring service", duration: 120, price: 35000, salon: "Glow Beauty Salon" },
	{ name: "Facial Treatment", slug: "facial-treatment", description: "Deep cleansing and relaxing facial", duration: 60, price: 25000, salon: "Glow Beauty Salon" },
	// Style Studio
	{ name: "Men's Haircut", slug: "mens-haircut", description: "Modern men's haircut and styling", duration: 30, price: 8000, salon: "Style Studio" },
	{ name: "Hair Wash & Blow Dry", slug: "hair-wash-blow-dry", description: "Hair wash with professional blow drying", duration: 40, price: 10000, salon: "Style Studio" },
	{ name: "Manicure", slug: "manicure", description: "Basic manicure and nail care", duration: 45, price: 15000, salon: "Style Studio" },
];

async function main() {
	const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
	const ownerHashedPassword = await bcrypt.hash(ownerData.password, SALT_ROUNDS);

	// ── Owner ──────────────────────────────────────────────
	let ownerUser = await prisma.user.findUnique({ where: { email: ownerData.email } });
	if (!ownerUser) {
		ownerUser = await prisma.$transaction(async (tx) => {
			const user = await tx.user.create({
				data: { email: ownerData.email, password: ownerHashedPassword, name: ownerData.name, phone: ownerData.phone, role: Role.OWNER },
			});
			await tx.owner.create({ data: { userId: user.id } });
			return user;
		});
		console.log("✅ Owner created:", ownerData.email, "/ admin123");
	} else {
		console.log("⚠️  Owner already exists:", ownerData.email);
	}

	const owner = await prisma.owner.findUnique({ where: { userId: ownerUser.id } });
	if (!owner) throw new Error("Owner profile not found");

	// ── Managers ───────────────────────────────────────────
	const managerMap = new Map<string, string>(); // email → managerId

	for (const m of managersData) {
		let user = await prisma.user.findUnique({ where: { email: m.email } });
		if (!user) {
			user = await prisma.$transaction(async (tx) => {
				const u = await tx.user.create({
					data: { email: m.email, password: hashedPassword, phone: m.phone, name: m.name, role: Role.MANAGER },
				});
				await tx.manager.create({ data: { userId: u.id } });
				return u;
			});
			console.log("✅ Manager created:", m.email, "/ password123");
		} else {
			console.log("⚠️  Manager already exists:", m.email);
		}
		const mgr = await prisma.manager.findUnique({ where: { userId: user.id } });
		if (mgr) managerMap.set(m.email, mgr.id);
	}

	// ── Salons ─────────────────────────────────────────────
	const salonMap = new Map<string, string>(); // name → salonId

	for (const s of salonsData) {
		let salon = await prisma.salon.findFirst({ where: { name: s.name, ownerId: owner.id } });
		if (!salon) {
			const managerId = managerMap.get(s.managerEmail) || null;
			salon = await prisma.salon.create({
				data: { name: s.name, slug: s.slug, address: s.address, phone: s.phone, ownerId: owner.id, description: s.description, managerId },
			});
			if (managerId) {
				await prisma.manager.update({ where: { id: managerId }, data: { salonId: salon.id } });
			}
			console.log("✅ Salon created:", s.name);
		} else {
			console.log("⚠️  Salon already exists:", s.name);
		}
		salonMap.set(s.name, salon.id);
	}

	// ── Staff ──────────────────────────────────────────────
	for (const st of staffData) {
		const salonId = salonMap.get(st.salon);
		if (!salonId) continue;

		let user = await prisma.user.findUnique({ where: { email: st.email } });
		if (!user) {
			user = await prisma.$transaction(async (tx) => {
				const u = await tx.user.create({
					data: { email: st.email, password: hashedPassword, phone: st.phone, name: st.name, role: Role.STAFF },
				});
				await tx.staff.create({
					data: { userId: u.id, salonId, specialty: st.specialty },
				});
				return u;
			});
			console.log("✅ Staff created:", st.name, "→", st.salon);
		} else {
			console.log("⚠️  Staff already exists:", st.email);
		}
	}

	// ── Customers ──────────────────────────────────────────
	for (const c of customersData) {
		let user = await prisma.user.findUnique({ where: { email: c.email } });
		if (!user) {
			user = await prisma.$transaction(async (tx) => {
				const u = await tx.user.create({
					data: { email: c.email, password: hashedPassword, phone: c.phone, name: c.name, role: Role.CUSTOMER },
				});
				await tx.customer.create({ data: { userId: u.id } });
				return u;
			});
			console.log("✅ Customer created:", c.email, "/ password123");
		} else {
			console.log("⚠️  Customer already exists:", c.email);
		}
	}

	// ── Services ───────────────────────────────────────────
	for (const svc of servicesData) {
		const salonId = salonMap.get(svc.salon);
		if (!salonId) continue;

		const existing = await prisma.service.findFirst({ where: { name: svc.name, salonId } });
		if (!existing) {
			await prisma.service.create({
				data: { name: svc.name, slug: svc.slug, description: svc.description, price: svc.price, duration: svc.duration, salonId },
			});
			console.log("✅ Service created:", svc.name, "→", svc.salon);
		} else {
			console.log("⚠️  Service already exists:", svc.name);
		}
	}

	console.log("\n🎉 Seed complete!");
	console.log("   Owner login:    admin@salon.com / admin123");
	console.log("   Manager login:  ye@salon.com / password123");
	console.log("   Manager login:  khin@salon.com / password123");
	console.log("   Staff login:    mya@salon.com / password123");
	console.log("   Staff login:    nwe@salon.com / password123");
	console.log("   Staff login:    zaw@salon.com / password123");
	console.log("   Staff login:    htun@salon.com / password123");
	console.log("   Customer login: aye@salon.com / password123");
	console.log("   Customer login: kyaw@salon.com / password123");
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
