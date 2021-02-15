<template>

<b-container
	class="mt-3"
>
	<b-breadcrumb>
    <b-breadcrumb-item
			:to="{ name: 'home' }"
		>{{ $t('u.home') }}</b-breadcrumb-item>
    <b-breadcrumb-item
			active
		>{{ $t('m.point.label') }}</b-breadcrumb-item>
	</b-breadcrumb>

	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-card
				no-body
				header="总览"
				class="mb-3"
			>
				<b-list-group flush>
					<b-list-group-item
						:to="{ name: 'workbench.point.overview' }"
					>{{ $t('m.point.overview.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.point.history' }"
					>{{ $t('m.point.history.label') }}</b-list-group-item>
				</b-list-group>
			</b-card>

			<b-card
				no-body
				header="调整工具"
				class="mb-3"
			>
				<b-list-group flush>
					<b-list-group-item
						:to="{ name: 'workbench.point.adjustment.plan' }"
					>{{ $t('m.point.adjustment.plan.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.point.adjustment.plan-variation' }"
					>{{ $t('m.point.adjustment.planVariation.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.point.adjustment.present' }"
					>{{ $t('m.point.adjustment.present.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.point.adjustment.activity' }"
					>{{ $t('m.point.adjustment.activity.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.point.adjustment.manual' }"
					>{{ $t('m.point.adjustment.manual.label') }}</b-list-group-item>
				</b-list-group>
			</b-card>
		</b-col>

		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Manager Panel</router-view>
		</b-col>
	</b-row>
</b-container>

</template>

<script>
export default {

};
</script>

<style>

</style>
