import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "How does SalonHub work?",
		answer:
			"Create an account, explore salons and their services, choose the professional and time that suit you, then confirm your appointment in one place.",
	},
	{
		question: "Can I choose a specific stylist?",
		answer:
			"Yes. When a salon has individual team profiles available, you can compare specialties and choose the professional whose work best matches your style.",
	},
	{
		question: "Can I change or cancel an appointment?",
		answer:
			"Appointment changes depend on each salon's policy. Your booking details will show the available options and any notice period before you confirm.",
	},
	{
		question: "How do I know a salon is right for me?",
		answer:
			"Salon profiles bring together services, team specialties, opening hours, and client feedback so you can make an informed choice before booking.",
	},
	{
		question: "Is SalonHub for independent professionals too?",
		answer:
			"SalonHub is designed for multi-location salons, independent studios, and beauty professionals who want a simpler way to manage appointments.",
	},
];

export function Faq() {
	return (
		<section id="faq" className="border-y border-border/70 bg-card/35 px-4 py-24 sm:px-6 sm:py-32">
			<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Need to know</p>
					<h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
						A few things, made clear.
					</h2>
					<p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
						Everything you need before finding your next salon appointment.
					</p>
				</div>

				<Accordion multiple defaultValue={["0"]} className="border-t border-border/70">
					{faqs.map((faq, index) => (
						<AccordionItem key={faq.question} value={String(index)} className="border-border/70 py-2">
							<AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline sm:text-lg">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="max-w-2xl pb-5 text-sm leading-7 text-muted-foreground sm:text-base">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
