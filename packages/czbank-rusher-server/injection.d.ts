import Sequelize from 'sequelize'

declare module '@produck/duck' {
	interface InstalledInjection {
		Sequelize: Sequelize.Sequelize
	}
}