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
			@click="requestProductSetting"
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
		:filter="keyword"
	>
		<template #cell(averageFieldIndex)="row">
			{{ row.item.averageFieldIndex === null ? '&lt;!未设定>' : row.item.averageFieldIndex }}
		</template>

		<template #cell(balanceFieldIndex)="row">
			{{ row.item.balanceFieldIndex === null ? '&lt;!未设定>' : row.item.balanceFieldIndex }}
		</template>
	</b-table>

	<b-modal
		centered
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
		centered
		title="更新产品设定"
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

	<b-modal
		v-if="selectedProduct !== null"
		centered
		:title="`解析配置 - 产品：${selectedProduct.name}`"
		ref="setting"
		:ok-title="$t('u.ok')"
		:cancel-title="$t('u.cancel')"
		@ok="updateProductSetting($event)"
	>
		<ProductSettingForm
			ref="product-setting-form"
			:product-id="selectedProductId"
		/>
	</b-modal>
</div>

</template>

<script>
import ProductCreatingForm from './Creating';
import ProductUpdatingForm from './Updating';
import ProductSettingForm from './Setting';

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
		async updateProduct(event) {
			try {
				await this.$refs['product-updating-form'].update();
				await this.getProductList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		},
		requestProductSetting() {
			this.$refs.setting.show();
		},
		async updateProductSetting(event) {
			try {
				await this.$refs['product-setting-form'].update();
				await this.getProductList();
			} catch (err) {
				console.log(err);
				event.preventDefault();
			}
		}
	},
	computed: {
		selectedProduct() {
			return this.productList
				.find(product => product.id === this.selectedProductId) || {};
		},
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
					key: 'averageFieldIndex',
					label: '日均存款列号',
					class: 'col-average',
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
				const { fieldIndex } = product;

				return {
					id: product.id,
					name: product.name,
					code: product.code,
					description: product.description,
					averageFieldIndex: fieldIndex.average,
					balanceFieldIndex: fieldIndex.balance
				};
			});
		}
	},
	mounted() {
		this.getProductList();
	},
	components: {
		ProductCreatingForm,
		ProductUpdatingForm,
		ProductSettingForm
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

	.col-average {
		width: 8em;
		text-align: center;
	}

	.col-balance {
		width: 8em;
		text-align: center;
	}
}
</style>
