<template>

<div>
	<h1>产品设定维护</h1><hr>
	<p>{{ $t('d.product.introduction') }}</p>

	<h2>产品总览</h2>
	<b-button-toolbar>
		<b-input-group
			prepend="过滤"
			class="mr-auto"
		>
			<b-form-input
				v-model="keyword"
				:placeholder="`${$t('c.manager.name')} / ${$t('c.manager.code')}`"
			/>
		</b-input-group>

		<b-button
			variant="primary"
			class="mr-1"
		>更新产品</b-button>

		<b-button
			variant="primary"
			class="mr-auto"
		>设置解析配置</b-button>

		<b-button
			variant="danger"
			class="mr-auto"
		>删除产品</b-button>

		<b-button
			class="mr-1"
			variant="primary"
			@click="getProductList"
		>刷新</b-button>

		<b-button
			class="mr-0"
			variant="success"
			@click="requestCreateProduct()"
		>添加产品</b-button>
	</b-button-toolbar>

	<b-table
		id="product-list"
		class="mt-3"
		bordered
		:items="productItemList"
		:fields="productFieldList"
		small
	></b-table>

	<b-modal ref="create">
		<CreateProduct />
	</b-modal>
</div>

</template>

<script>
import CreateProduct from './Create';

export default {
	data() {
		return {
			keyword: '',
			productList: [],
			selectedProductId: null
		};
	},
	methods: {
		async getProductList() {
			this.productList = await this.$rusher.backend.Product.query();
		},
		requestCreateProduct() {
			this.$refs.create.show();
		}
	},
	computed: {
		productFieldList() {
			return [
				{
					key: 'name',
					label: this.$t('c.product.name'),
					class: 'col-name'
				},
				{
					key: 'code',
					label: this.$t('c.product.code'),
					class: 'col-code'
				},
				{
					key: 'description',
					label: this.$t('c.product.description'),
					class: 'col-description'
				},
			];
		},
		productItemList() {
			return this.productList.map(product => {
				return {
					id: product.id,
					name: product.name,
					code: product.code,
					description: product.description,
					fieldIndex: {
						averageDeposit: '',
						balance: ''
					}
				};
			});
		}
	},
	mounted() {
		this.getProductList();
	},
	components: { CreateProduct },
};
</script>

<style lang="scss">
#product-list {
	.col-name {
		width: 12em
	}

	.col-code {
		width: 20em
	}
}
</style>
