<template>

<b-container
	class="mt-3"
>
	<b-row>
		<b-col
			xxl="2"
			xl="3"
		>
			<b-card
				no-body
				header="客户分析">
				<b-list-group flush>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.customer-asset-distribution' }"
					>{{ $t('menu.analysis.CustomerAssetDistribution.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.customer-gender-rate' }"
					>{{ $t('menu.analysis.CustomerGenderRate.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.customer-age-distribution' }"
					>{{ $t('menu.analysis.CustomerAgeDistribution.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.customer-asset' }"
					>{{ $t('menu.analysis.CustomerAsset.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.customer-relation' }"
					>{{ $t('menu.analysis.CustomerRelation.label') }}</b-list-group-item>
				</b-list-group>
			</b-card>

			<b-card
				no-body
				class="mt-3"
				header="客户经理分析">
				<b-list-group flush>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.manager-contribution-value-distribution' }"
					>{{ $t('menu.analysis.ManagerContributionValueDistribution.label') }}</b-list-group-item>
					<b-list-group-item
						:to="{ name: 'workbench.analysis.manager-customer-contribution-value-distribution' }"
					>{{ $t('menu.analysis.ManagerCustomerContributionValueDistribution.label') }}</b-list-group-item>
				</b-list-group>
			</b-card>
		</b-col>
		<b-col
			xxl="10"
			xl="9"
		>
			<router-view>Database Function Panel</router-view>
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
