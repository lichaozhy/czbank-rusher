import '@produck/duck'
import '@produck/duck-web-koa-router'
import Sequelize from 'sequelize'
import http from 'http'
import https from 'https'

declare module '@produck/duck' {
	interface InstalledInjection {
		Sequelize: Sequelize.Sequelize
		Utils: CZBankRusher.Utils
		Model: CZBankRusher.Model
		ReportResolver: CZBankRusher.Report.FileReader,
		Constant: {
			ADJUSTMENT: {
				TYPE: {
					PLAN: 0x10,
					PLAN_VARIATION: 0x20,
					ACTIVITY: 0x30,
					PRESENT: 0x40,
					MANUAL: 0x50
				}
			}
		}
	}
}

declare module '@produck/duck-web-koa-router' {
	interface DuckWebKoaRouterInstanceInjection {
		Resource: CZBankRusher.Resource
	}
}

declare namespace CZBankRusher {
	namespace Report {
		type FileReader = (options) => read
		type read = (buffer: Buffer) => Report
		
		interface Abstract {
			[key: string]: AbstractData
		}

		interface AbstractData {
			balance: number
			average: number
		}

		namespace Namespace {
			interface AccountData {
				accountId: string
				data: Abstract
			}

			interface CustomerData {
				accountId: string
				customerId: string
				data: Abstract
			}

			interface Account {
				list: [],
				dataList: AccountData[]
			}

			interface Customer {
				list: [],
				dataList: CustomerData[]
			}
		}
		
		interface Report {
			date: string,
			Result: ReportResult
		}

		interface ReportResult {
			Account: Namespace.Account,
			Customer: Namespace.Customer,
			Abstract: Abstract
		}
	}

	interface CZBankRusher {
		AdministratorHttpServer(): http.Server
		AdministratorHttpsServer(): http.Server
		ManagerHttpServer(): https.Server
		ManagerHttpsServer(): https.Server
		install(): Promise<void>
		readonly sequelize: Sequelize.Sequelize
	}

	interface Utils {
		encodeSHA256(raw: Buffer | string): string
		randomInt(from: number, to: number): number
	}

	interface Model {
		AccountData: typeof Sequelize.Model
		AccountProductData: typeof Sequelize.Model
		CustomerPointAdjustmentByActivity: typeof Sequelize.Model
		CustomerPointAdjustmentByManual: typeof Sequelize.Model
		CustomerPointAdjustmentByPlan: typeof Sequelize.Model
		CustomerPointAdjustmentByPlanVariation: typeof Sequelize.Model
		CustomerPointAdjustmentByPresent: typeof Sequelize.Model
		CustomerPointAdjustment: typeof Sequelize.Model
		CustomerContribution: typeof Sequelize.Model
		CustomerData: typeof Sequelize.Model
		CustomerPoint: typeof Sequelize.Model
		CustomerProductData: typeof Sequelize.Model
		CustomerRelation: typeof Sequelize.Model
		ManagerContribution: typeof Sequelize.Model
		ManagerData: typeof Sequelize.Model
		ManagerProductData: typeof Sequelize.Model
		ProductDataSetting: typeof Sequelize.Model
		Account: typeof Sequelize.Model
		Activity: typeof Sequelize.Model
		Customer: typeof Sequelize.Model
		File: typeof Sequelize.Model
		Manager: typeof Sequelize.Model
		Plan: typeof Sequelize.Model
		Present: typeof Sequelize.Model
		Product: typeof Sequelize.Model
		PointBatchByPlan: typeof Sequelize.Model
		PointBatchByPlanVariation: typeof Sequelize.Model
	}

	interface Resource {
		Customer: (data: Sequelize.Model) => Object
		CustomerPerformance: (data: Sequelize.Model) => Object
		Manager: (data: Sequelize.Model) => Object
		ManagerPerformance: (data: Sequelize.Model) => Object
		ManagerPreview: (data: Sequelize.Model) => Object
		File: (data: Sequelize.Model) => Object
		Plan: (data: Sequelize.Model) => Object
		Activity: (data: Sequelize.Model) => Object
		Present: (data: Sequelize.Model) => Object
		Product: (data: Sequelize.Model) => Object
		CustomerPerformance: (data: Sequelize.Model) => Object
		PlanBatchPreview: (data: Sequelize.Model) => Object
		PlanBatch: (data: Sequelize.Model) => Object
		PlanVariationBatchPreview: (data: Sequelize.Model) => Object
		PlanVariationBatch: (data: Sequelize.Model) => Object
		PresentExchange: (data: Sequelize.Model) => Object
		CustomerPoint: (data: Sequelize.Model) => Object
		ActivityReward: (data: Sequelize.Model) => Object
		PointAdjustment: (data: Sequelize.Model) => Object
	}
}

declare function CZBankRusher(
	options
): CZBankRusher.CZBankRusher

export = CZBankRusher