import type { Metadata } from "next";
import "../index.css";
import Providers from "@/components/providers";
import Header from "@/components/header";


export const metadata: Metadata = {
	title: "Autonome",
	description: "Autonomous AI Trading Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
