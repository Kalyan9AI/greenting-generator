import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
	category: z.string().optional(),
	customOccasion: z.string().optional(),
	recipient: z.string().optional(),
	tone: z.string().optional(),
	stylePerson: z.string().optional(),
	count: z.number().min(1).max(20).optional(),
	language: z.string().optional(),
});

export async function POST(req: NextRequest) {
	if (!process.env.OPENAI_API_KEY) {
		return NextResponse.json(
			{ error: "Missing OPENAI_API_KEY" },
			{ status: 500 }
		);
	}

	let json: unknown;
	try {
		json = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = requestSchema.safeParse(json);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid request", details: parsed.error.flatten() },
			{ status: 400 }
		);
	}

	const {
		category,
		customOccasion,
		recipient,
		tone,
		stylePerson,
		count = 10,
		language,
	} = parsed.data;

	const occasion = (customOccasion?.trim() || category || "Greeting").trim();

	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

	const messages = [
		{
			role: "system" as const,
			content:
				"You are a concise greeting quote generator. Always respond with a pure JSON array of strings only. No backticks, no markdown, no keys, no commentary.",
		},
		{
			role: "user" as const,
			content:
				`Generate ${count} unique greeting quotes for the occasion: "${occasion}".\n` +
				`Recipient details: ${recipient || "N/A"}.\n` +
				`Tone: ${tone || "sincere"}.\n` +
				`${stylePerson ? `Write in the recognizable style of ${stylePerson}.` : ""}\n` +
				`${language ? `Language: ${language}.` : ""}\n` +
				"Each quote should be 1-2 sentences and free of leading numbers, bullets, or quotes. Return JSON array only.",
		},
	];

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages,
			temperature: 0.9,
		});

		const content = completion.choices?.[0]?.message?.content || "";

		let quotes: string[] = [];
		try {
			quotes = JSON.parse(content);
			if (!Array.isArray(quotes)) throw new Error("Not an array");
			quotes = quotes.map((q) => String(q).trim()).filter(Boolean);
		} catch {
			// Fallback: try to extract JSON within code fences or brackets
			const match = content.match(/\[[\s\S]*\]/);
			if (match) {
				try {
					quotes = JSON.parse(match[0]).map((q: unknown) => String(q).trim());
				} catch {
					// ignore
				}
			}
			if (!quotes.length) {
				quotes = content
					.split(/\n+/)
					.map((line) => line.replace(/^[-*\d\.)\s]+/, "").replace(/^"|"$/g, "").trim())
					.filter(Boolean)
					.slice(0, count);
			}
		}

		// Ensure we have exactly `count` items if possible
		if (quotes.length > count) quotes = quotes.slice(0, count);

		return NextResponse.json({ quotes });
	} catch (err) {
		console.error("OpenAI error:", err);
		return NextResponse.json(
			{ error: "Failed to generate quotes" },
			{ status: 500 }
		);
	}
}


