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
				placeholder="产品名 / 描述"
			/>
		</b-input-group>

		<b-button
			variant="primary"
			class="mr-1"
			:disabled="selectedProductId === null"
			@click="requestUpdateProduct()"
		>更新产品</b-button>

		<b-button
			variant="primary"
			class="mr-auto"
			:disabled="selectedProductId === null"
		>设置解析配置</b-button>

		<b-button
			variant="danger"
			class="mr-auto"
			:disabled="selectedProductId === null"
			@click="deleteProduct"
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
		selectable
		select-mode="single"
		@row-selected="selectProduct"
	>
		<template #cell(averageDepositFieldIndex)="row">
			{{ row.item.averageDepositFieldIndex === null ? '未设定' : row.item.averageDepositFieldIndex }}
		</template>

		<template #cell(balanceFieldIndex)="row">
			{{ row.item.balanceFieldIndex === null ? '未设定' : row.item.balanceFieldIndex }}
		</template>
	</b-table>

	<b-modal
		title="创建产品设定"
		ref="create"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="createProduct($event)"
	>
		<ProductCreatingForm
			ref="product-creating-form"
		/>
	</b-modal>

	<b-modal
		title="创建产品设定"
		ref="updating"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="updateProduct($event)"
	>
		<ProductUpdatingForm
			ref="product-updating-form"
			:product-id="selectedProductId"
		/>
	</b-modal>
</div>

</template>

<script>
import ProductCreatingForm from './Creating';
import ProductUpdatingForm from './Updating';

export default {
	data() {
		return {
			keyword: '',
			productList: [],
			selectedProductId: null
		};
	},
	methods: {
		selectProduct(rows) {
			this.selectedProductId = rows.length > 0 ? rows[0].id : null;
		},
		async getProductList() {
			this.productList = await this.$rusher.backend.Product.query();
		},
		async deleteProduct() {
			await this.$rusher.backend.Product(this.selectedProductId).delete();
			await this.getProductList();
		},
		requestCreateProduct() {
			this.$refs.create.show();
		},
		async createProduct(event) {
			try {
				await this.$refs['product-creating-form'].create();
				await this.getProductList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		requestUpdateProduct() {
			this.$refs.updating.show();
		},
		async updateProduct() {
			try {
				await this.$refs['product-updating-form'].update();
				await this.getProductList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		requestProductSetting() {

		},
		async updateProductSetting() {

		}
	},
	computed: {
		productFieldList() {
			return [
				{
					key: 'name',
					label: this.$t('c.product.name'),
					class: 'col-name',
					sortable: true
				},
				{
					key: 'code',
					label: this.$t('c.product.code'),
					class: 'col-code',
					sortable: true
				},
				{
					key: 'averageDepositFieldIndex',
					label: '日均存款列号',
					class: 'col-average-deposit',
					sortable: true
				},
				{
					key: 'balanceFieldIndex',
					label: '余额列号',
					class: 'col-balance',
					sortable: true
				},
				{
					key: 'description',
					label: this.$t('c.product.description'),
					class: 'col-description'
				},
				{
					key: 'blank',
					label: '',
					class: 'col-blank',
				}
			];
		},
		productItemList() {
			return this.productList.map(product => {
				return {
					id: product.id,
					name: product.name,
					code: product.code,
					description: product.description,
					averageDepositFieldIndex: null,
					balanceFieldIndex: null
				};
			});
		}
	},
	mounted() {
		this.getProductList();
	},
	components: {
		ProductCreatingForm,
		ProductUpdatingForm
	},
};
</script>

<style lang="scss">
#product-list {
	.col-name {
		width: 12em;
	}

	.col-code {
		width: 20em;
	}

	.col-average-deposit {
		width: 8em;
		text-align: center;
	}

	.col-balance {
		width: 8em;
		text-align: center;
	}
}
</style>
