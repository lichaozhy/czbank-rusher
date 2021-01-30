import '@produck/duck'
import Sequelize from 'sequelize'
import http from 'http';
import https from 'https';

declare module '@produck/duck' {
	interface InstalledInjection {
		Sequelize: Sequelize.Sequelize
		Utils: CZBankRusher.Utils
	}
}

declare namespace CZBankRusher {
	interface CZBankRusher {
		HttpServer(): http.Server
		HttpsServer(): https.Server
		install(): Promise<void>
		readonly sequelize: Sequelize.Sequelize
	}

	interface Utils {
		encodeSHA256(raw: Buffer | string): string
		randomInt(from: number, to: number): number
	}
}

declare function CZBankRusher(
	options
): CZBankRusher.CZBankRusher

export = CZBankRusher