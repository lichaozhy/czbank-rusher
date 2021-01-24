declare namespace Workspace {

}

class Workspace {
	constructor()

	root: string

	buildAll(): Promise<void>
	buildRoot(): Promise<void>
	build(
		/**
		 * The name of path.
		 */
		name: stirng,

		/**
		 * A relative path after the path specify by the name.
		 */
		pathname?: string
	): Promise<void>

	setPath(
		name: string,
		pathname: string,
		fromRoot?: boolean
	): void

	getPath(
		name: string
	)

	resolve(
		name: string,
		pathname: string
	)
}

declare module '@produck/duck' {
	interface InstalledInjection {
		Workspace: Workspace
	}
}