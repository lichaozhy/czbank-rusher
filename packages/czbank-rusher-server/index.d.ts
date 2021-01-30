import '@produck/duck'
import Sequelize from 'sequelize'

declare module '@produck/duck' {
	interface InstalledInjection {
		Sequelize: Sequelize.Sequelize
		Mock: Mock,
		Foo: string
	}

	interface BaseInjection {
		Bar: string
	}
}